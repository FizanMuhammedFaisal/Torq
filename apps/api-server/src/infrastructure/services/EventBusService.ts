import { type IRedisClient } from "@/application/port/messageBroker/redisClient.interface";
import { EventEntry, IEventBus } from "@/application/port/services/eventBus.interface";
import { TOKENS } from "@/config/di/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class EventBusService implements IEventBus {
    constructor(
        @inject(TOKENS.RedisClient) private redisClient: IRedisClient
    ) { }
    async subscribeToEvents(
        topic: string,
        listenMs: number,
        count: number = 100,
        cursorId: string = '$',
    ): Promise<EventEntry[] | null> {
        const client = await this.redisClient.getClient();
        const results = await client.xRead(
            { key: topic, id: cursorId },
            { BLOCK: listenMs, COUNT: count }
        );
        if (!results) return null;
        return results[0].messages.map(({ id, message }) => ({ id, fields: message }));
    }
    async getRecentEvents(topic: string, count: number): Promise<EventEntry[]> {
        const client = await this.redisClient.getClient();
        const results = await client.xRevRange(topic, "+", "-", {
            COUNT: count
        })
        return results.reverse().map(({ id, message }) => ({ id, fields: message }));
    }
    async getEventsBefore(topic: string, beforeId: string, count: number): Promise<EventEntry[]> {
        const client = await this.redisClient.getClient();
        const results = await client.xRevRange(topic, `(${beforeId}`, "-", {
            COUNT: count
        })
        return results.reverse().map(({ id, message }) => ({ id, fields: message }));
    }
    async *getAllEvents(
        topic: string,
        chunkSize: number = 500
    ): AsyncGenerator<EventEntry[]> {
        const client = await this.redisClient.getClient();
        let cursor = '-';

        while (true) {
            const results = await client.xRange(topic, cursor, '+', { COUNT: chunkSize });

            if (results.length === 0) break;

            yield results.map(({ id, message }) => ({ id, fields: message }));

            if (results.length < chunkSize) break; // last page

            // current last record cursor
            cursor = `(${results[results.length - 1].id}`;
        }
    }

}