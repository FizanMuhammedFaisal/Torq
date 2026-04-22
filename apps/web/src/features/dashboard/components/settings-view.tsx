import {
	LogoutIcon,
	NotificationIcon,
	UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAppConfig } from '@/lib/app-config';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/auth';

/* ── Setting Section ─── */

function SettingSection({
	icon,
	title,
	description,
	children,
	delay = 0,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	children: React.ReactNode;
	delay?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay, ease: [0.25, 1, 0.5, 1] }}
			className="rounded-2xl border border-white/6 bg-white/2 overflow-hidden"
			style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}
		>
			<div className="p-5 pb-4">
				<div className="flex items-center gap-3">
					<div className="size-9 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center shrink-0">
						{icon}
					</div>
					<div>
						<h3 className="text-[15px] font-semibold text-white">{title}</h3>
						<p className="text-[12px] text-white/25">{description}</p>
					</div>
				</div>
			</div>
			<div className="border-t border-white/4 p-5">{children}</div>
		</motion.div>
	);
}

/* ── Page ─── */

export function SettingsView() {
	const { data: session } = authClient.useSession();
	const config = useAppConfig();
	const navigate = useNavigate();
	const { clearAuth } = useAuthStore();

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-6 lg:px-8 py-6 border-b border-white/5 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white">
						Settings
					</h1>
					<p className="text-[13px] text-white/30 mt-1">
						Manage your account and preferences
					</p>
				</div>
				<span className="text-xl font-black tracking-tighter text-white/10 hidden sm:block">
					torq
				</span>
			</div>

			<div className="flex-1 overflow-y-auto p-6 lg:p-8">
				<div className="max-w-2xl space-y-4">
					{/* Profile */}
					{config.authEnabled && (
						<SettingSection
							icon={
								<HugeiconsIcon
									icon={UserIcon}
									className="size-[18px] text-white/40"
									strokeWidth={2}
								/>
							}
							title="Profile"
							description="Your personal information"
							delay={0}
						>
							<FieldGroup className="gap-4">
								<div className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel
											htmlFor="settings-name"
											className="text-[11px] uppercase tracking-wider text-white/25"
										>
											Display name
										</FieldLabel>
										<Input
											id="settings-name"
											defaultValue={session?.user?.name || ''}
										/>
									</Field>
									<Field>
										<FieldLabel
											htmlFor="settings-email"
											className="text-[11px] uppercase tracking-wider text-white/25"
										>
											Email
										</FieldLabel>
										<Input
											id="settings-email"
											type="email"
											defaultValue={session?.user?.email || ''}
											disabled
										/>
									</Field>
								</div>
								<Field orientation="horizontal">
									<Button size="sm" className="rounded-full px-5">
										Save changes
									</Button>
								</Field>
							</FieldGroup>
						</SettingSection>
					)}

					{/* Toast Notifications (Easily removable test area) */}
					<SettingSection
						icon={
							<HugeiconsIcon
								icon={NotificationIcon}
								className="size-[18px] text-white/40"
								strokeWidth={2}
							/>
						}
						title="Toast Testing"
						description="Developer tools to verify toast notifications"
						delay={config.authEnabled ? 0.04 : 0}
					>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								className="text-xs h-8 px-3 rounded-full border-white/8"
								onClick={() => {
									import('react-hot-toast').then(({ toast }) =>
										toast.success('Workspace settings updated successfully.'),
									);
								}}
							>
								Test Success
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="text-xs h-8 px-3 rounded-full border-white/8"
								onClick={() => {
									import('react-hot-toast').then(({ toast }) =>
										toast.error('Failed to connect to the database.'),
									);
								}}
							>
								Test Error
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="text-xs h-8 px-3 rounded-full border-white/8"
								onClick={() => {
									import('react-hot-toast').then(({ toast }) =>
										toast('Your subscription will expire in 3 days.'),
									);
								}}
							>
								Test Info
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="text-xs h-8 px-3 rounded-full border-white/8"
								onClick={() => {
									import('react-hot-toast').then(({ toast }) => {
										toast.loading('Deploying to production...', {
											duration: 2000,
										});
									});
								}}
							>
								Test Loading
							</Button>
						</div>
					</SettingSection>

					{/* Danger */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.2,
							delay: config.authEnabled ? 0.08 : 0.04,
							ease: [0.25, 1, 0.5, 1],
						}}
						className="rounded-2xl border border-red-500/10 bg-red-500/2 overflow-hidden"
					>
						<div className="p-5 pb-4">
							<h3 className="text-[15px] font-semibold text-red-400">
								Danger Zone
							</h3>
							<p className="text-[12px] text-white/25 mt-0.5">
								Account & Session Management
							</p>
						</div>

						{/* Sign Out Section */}
						{config.authEnabled && (
							<div className="border-t border-red-500/6 p-5 flex items-center justify-between">
								<div>
									<p className="text-[14px] text-white/70">Sign out of Torq</p>
									<p className="text-[12px] text-white/25 mt-0.5">
										End your active session on this device
									</p>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="rounded-full px-5 border-white/8 hover:bg-white/4 text-white"
									onClick={async () => {
										await authClient.signOut();
										clearAuth();
										toast.success('Signed out successfully');
										navigate('/login');
									}}
								>
									<HugeiconsIcon
										icon={LogoutIcon}
										className="size-[14px] mr-2"
										strokeWidth={2}
									/>
									Sign out
								</Button>
							</div>
						)}

						{/* Delete Account Section */}
						<div className="border-t border-red-500/6 p-5 flex items-center justify-between">
							<div>
								<p className="text-[14px] text-white/70">Delete account</p>
								<p className="text-[12px] text-white/25 mt-0.5">
									Permanently delete your account and all data
								</p>
							</div>
							<Button
								size="sm"
								variant="destructive"
								className="rounded-full px-5"
							>
								Delete Account
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
