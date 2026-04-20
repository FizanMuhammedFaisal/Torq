import { inject, injectable, singleton } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IRedisClient } from '@/application/port/messageBroker/redisClient.interface';
import type { IConsumer } from '@/application/port/messageBroker/consumer.interface';
import { logger } from '@/infrastructure/logger/logger';
import type { IWorkflowRunRepository } from '@/application/port/repositories/workflowRunRepository.interface';

const STREAM_KEY = 'workflow_run_states';
const GROUP_NAME = 'db-updater';
const CONSUMER_NAME = process.env.HOSTNAME || `api-server-${Date.now()}`;

export interface WorkflowRunStateEvent {
	runName: string;
	status: string;
	stepName?: string;
	reason?: string;
	ts: string;
}

@singleton()
@injectable()
export class WorkflowRunStateConsumer implements IConsumer {
	private isRunning = false;
	private reaperInterval: Timer | null = null;

	constructor(
		@inject(TOKENS.RedisClient) private redisClientWrapper: IRedisClient,
		@inject(TOKENS.WorkflowRunRepository) private workflowRunRepository: IWorkflowRunRepository
	) { }

	public async start(): Promise<void> {
		if (this.isRunning) return;
		this.isRunning = true;

		logger.info({ group: GROUP_NAME, consumer: CONSUMER_NAME }, '[DB Updater] Starting consumer group');

		try {
			await this.ensureGroupExists();

			//  Recover un-acked messages for this specific consumer
			await this.recover();

			//  Start the reaper to claim long-idle messages from crashed pods (run every 60s)
			this.reaperInterval = setInterval(() => this.reaper(), 60_000);

			//  Enter the main consume loop (does not block startup)
			setTimeout(() => this.consumeLoop(), 0);
		} catch (error) {
			logger.error({ error }, '[DB Updater] Fatal error starting consumer');
			this.isRunning = false;
		}
	}

	public stop(): void {
		this.isRunning = false;
		if (this.reaperInterval) clearInterval(this.reaperInterval);
		logger.info('[DB Updater] Stopping consumer queue');
	}

	private async ensureGroupExists(): Promise<void> {
		const redis = await this.redisClientWrapper.getClient();
		try {
			await redis.xGroupCreate(STREAM_KEY, GROUP_NAME, '$', { MKSTREAM: true });
			logger.info({ stream: STREAM_KEY, group: GROUP_NAME }, '[DB Updater] Created consumer group');
			// biome-ignore lint/suspicious/noExplicitAny: <fals>
		} catch (error: any) {
			if (error.message?.includes('BUSYGROUP')) {
				logger.debug({ group: GROUP_NAME }, '[DB Updater] Consumer group already exists');
			} else {
				throw error;
			}
		}
	}

	private async recover(): Promise<void> {
		const redis = await this.redisClientWrapper.getClient();
		logger.info('[DB Updater] Starting recovery of PEL (Pending Entries List)');

		while (this.isRunning) {
			try {
				// Read from "0" -> get pending messages for THIS consumer
				const result = await redis.xReadGroup(
					GROUP_NAME,
					CONSUMER_NAME,
					[{ key: STREAM_KEY, id: '0' }],
					{ COUNT: 10 }
				);

				if (!result || result.length === 0 || !result[0].messages || result[0].messages.length === 0) {
					logger.info('[DB Updater] PEL is empty, recovery complete');
					break;
				}

				const streamEntries = result[0].messages;
				for (const entry of streamEntries) {
					await this.processMessage(entry.id, entry.message);
				}
			} catch (error) {
				logger.error({ error }, '[DB Updater] Error during recovery');
				await new Promise((r) => setTimeout(r, 5000));
			}
		}
	}

	private async consumeLoop(): Promise<void> {
		const redis = await this.redisClientWrapper.getClient();
		logger.info('[DB Updater] Entering main consume loop');

		while (this.isRunning) {
			try {
				const result = await redis.xReadGroup(
					GROUP_NAME,
					CONSUMER_NAME,
					[{ key: STREAM_KEY, id: '>' }],
					{ BLOCK: 5000, COUNT: 10 }
				);

				if (!result || result.length === 0) {
					continue;
				}

				const streamEntries = result[0].messages;
				for (const entry of streamEntries) {
					await this.processMessage(entry.id, entry.message);
				}
			} catch (error) {
				logger.error({ error }, '[DB Updater] Error in main consume loop');
				await new Promise((r) => setTimeout(r, 5000));
			}
		}
	}
	/**
	 *  Only steal entries that have been in PEL for more than 60 seconds without being ACKed.
	 *  This catches dead pods their entries sat there since the pod died.
	 */
	private async reaper(): Promise<void> {
		if (!this.isRunning) return;
		const redis = await this.redisClientWrapper.getClient();
		try {
			// Autoclaim messages idle for > 60s
			const result = await redis.xAutoClaim(STREAM_KEY, GROUP_NAME, CONSUMER_NAME, 60000, '0-0', { COUNT: 100 });
			const claimedEntries = result.messages;

			if (!claimedEntries || claimedEntries.length === 0) return;

			logger.warn({ count: claimedEntries.length }, '[DB Updater] Reaper claimed idle messages');

			for (const entry of claimedEntries) {
				if (entry) await this.processMessage(entry.id, entry.message);
			}
		} catch (error) {
			logger.error({ error }, '[DB Updater] Error in reaper loop');
		}
	}

	private async processMessage(messageId: string, messageRecord: Record<string, string>): Promise<void> {
		const redis = await this.redisClientWrapper.getClient();
		try {
			const payload = messageRecord as unknown as Partial<WorkflowRunStateEvent>;

			if (!payload.runName || !payload.status) {
				logger.warn({ messageId, payload }, '[DB Updater] Invalid stream message shape, skipping');
				await redis.xAck(STREAM_KEY, GROUP_NAME, messageId);
				return;
			}

			// Upsert DB
			const event = payload as WorkflowRunStateEvent;
			await this.updateDatabase({
				...event,
				status: event.status.toUpperCase()
			});

			// Acknowledge ONLY after DB write succeeds
			await redis.xAck(STREAM_KEY, GROUP_NAME, messageId);
			logger.debug({ messageId, runName: payload.runName }, '[DB Updater] Processed and ACKed message');

		} catch (error) {
			logger.error({ error, messageId }, '[DB Updater] Failed to process message, will persist in PEL attached to this consumer');
		}
	}

	private async updateDatabase(event: WorkflowRunStateEvent): Promise<void> {
		try {
			const runId = event.runName.replace('run-', '').toUpperCase();
			await this.workflowRunRepository.updateRunState(
				runId,
				event.status,
				event.stepName,
				event.ts ? new Date(event.ts) : undefined
			);
			logger.info(
				{ status: event.status, stepName: event.stepName, Message: '[DB Updater] Updated Postgres workflow_run successfully via repository' },

			);
		} catch (error) {
			logger.error({ error, runName: event.runName, Message: "[DB Updater] DB Update transaction failed" });
			throw error;
		}
	}
}
