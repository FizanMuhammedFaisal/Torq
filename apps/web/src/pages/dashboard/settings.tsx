import {
	CodeIcon,
	MailIcon,
	NotificationIcon,
	ShieldIcon,
	UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function Toggle({ enabled }: { enabled: boolean }) {
	return (
		<div
			className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-white/[0.08]'}`}
		>
			<div
				className={`absolute top-[3px] size-3.5 rounded-full bg-white transition-transform ${enabled ? 'left-[19px]' : 'left-[3px]'}`}
			/>
		</div>
	);
}

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
			className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
			style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}
		>
			<div className="p-5 pb-4">
				<div className="flex items-center gap-3">
					<div className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
						{icon}
					</div>
					<div>
						<h3 className="text-[15px] font-semibold text-white">{title}</h3>
						<p className="text-[12px] text-white/25">{description}</p>
					</div>
				</div>
			</div>
			<div className="border-t border-white/[0.04] p-5">{children}</div>
		</motion.div>
	);
}

/* ── Page ─── */

export function SettingsPage() {
	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-6 lg:px-8 py-6 border-b border-white/[0.05]">
				<h1 className="text-2xl font-bold tracking-tight text-white">
					Settings
				</h1>
				<p className="text-[13px] text-white/30 mt-1">
					Manage your account and preferences
				</p>
			</div>

			<div className="flex-1 overflow-y-auto p-6 lg:p-8">
				<div className="max-w-2xl space-y-4">
					{/* Profile */}
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
									<Input id="settings-name" defaultValue="John Black" />
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
										defaultValue="john.black@example.com"
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

					{/* Notifications */}
					<SettingSection
						icon={
							<HugeiconsIcon
								icon={NotificationIcon}
								className="size-[18px] text-white/40"
								strokeWidth={2}
							/>
						}
						title="Notifications"
						description="How you receive updates"
						delay={0.04}
					>
						<div className="space-y-4">
							<div className="flex gap-2 pb-4 mb-4 border-b border-white/[0.04]">
								<Button
									size="sm"
									variant="outline"
									className="text-xs h-8 px-3 rounded-full border-white/[0.08]"
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
									className="text-xs h-8 px-3 rounded-full border-white/[0.08]"
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
									className="text-xs h-8 px-3 rounded-full border-white/[0.08]"
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
									className="text-xs h-8 px-3 rounded-full border-white/[0.08]"
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

							{[
								{
									label: 'Workflow failures',
									desc: 'Get notified when a workflow fails',
									enabled: true,
								},
								{
									label: 'Workflow success',
									desc: 'Get notified when a workflow completes',
									enabled: false,
								},
								{
									label: 'Weekly digest',
									desc: 'Summary of your workflow activity',
									enabled: true,
								},
							].map((item, i) => (
								<div
									key={item.label}
									className={`flex items-center justify-between ${i > 0 ? 'pt-4 border-t border-white/[0.04]' : ''}`}
								>
									<div>
										<p className="text-[14px] text-white/70">{item.label}</p>
										<p className="text-[12px] text-white/25 mt-0.5">
											{item.desc}
										</p>
									</div>
									<Toggle enabled={item.enabled} />
								</div>
							))}
						</div>
					</SettingSection>

					{/* API Keys */}
					<SettingSection
						icon={
							<HugeiconsIcon
								icon={CodeIcon}
								className="size-[18px] text-white/40"
								strokeWidth={2}
							/>
						}
						title="API Keys"
						description="Manage your API access tokens"
						delay={0.08}
					>
						<div className="space-y-3">
							{[
								{
									name: 'Production',
									key: 'torq_pk_••••••••••',
									color: 'oklch(0.60 0.13 163)',
								},
								{
									name: 'Development',
									key: 'torq_dk_••••••••••',
									color: 'rgba(234,179,8,1)',
								},
							].map((item) => (
								<div
									key={item.name}
									className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3.5"
								>
									<div className="flex items-center gap-3">
										<span
											className="size-[7px] rounded-full"
											style={{ background: item.color }}
										/>
										<div>
											<p className="text-[14px] font-medium text-white/70">
												{item.name}
											</p>
											<p className="text-[12px] text-white/20 font-mono">
												{item.key}
											</p>
										</div>
									</div>
									<span className="text-[10px] font-medium uppercase tracking-wider text-white/20 border border-white/[0.06] rounded-full px-2.5 py-1">
										Active
									</span>
								</div>
							))}
							<Button
								size="sm"
								variant="outline"
								className="rounded-full gap-1.5 mt-1 border-white/[0.08]"
							>
								Generate new key
							</Button>
						</div>
					</SettingSection>

					{/* Security */}
					<SettingSection
						icon={
							<HugeiconsIcon
								icon={ShieldIcon}
								className="size-[18px] text-white/40"
								strokeWidth={2}
							/>
						}
						title="Security"
						description="Password and authentication"
						delay={0.12}
					>
						<FieldGroup className="gap-4">
							<Field>
								<FieldLabel
									htmlFor="settings-password"
									className="text-[11px] uppercase tracking-wider text-white/25"
								>
									Current password
								</FieldLabel>
								<Input
									id="settings-password"
									type="password"
									placeholder="••••••••"
								/>
							</Field>
							<div className="grid grid-cols-2 gap-4">
								<Field>
									<FieldLabel
										htmlFor="settings-new-pw"
										className="text-[11px] uppercase tracking-wider text-white/25"
									>
										New password
									</FieldLabel>
									<Input
										id="settings-new-pw"
										type="password"
										placeholder="••••••••"
									/>
								</Field>
								<Field>
									<FieldLabel
										htmlFor="settings-confirm-pw"
										className="text-[11px] uppercase tracking-wider text-white/25"
									>
										Confirm
									</FieldLabel>
									<Input
										id="settings-confirm-pw"
										type="password"
										placeholder="••••••••"
									/>
								</Field>
							</div>
							<Field orientation="horizontal">
								<Button size="sm" className="rounded-full px-5">
									Update password
								</Button>
							</Field>
						</FieldGroup>
					</SettingSection>

					{/* Email */}
					<SettingSection
						icon={
							<HugeiconsIcon
								icon={MailIcon}
								className="size-[18px] text-white/40"
								strokeWidth={2}
							/>
						}
						title="Email Preferences"
						description="Control what emails you receive"
						delay={0.16}
					>
						<div className="space-y-4">
							{[
								{
									label: 'Marketing emails',
									desc: 'Product updates and announcements',
									enabled: false,
								},
								{
									label: 'Security alerts',
									desc: 'Important security notifications',
									enabled: true,
								},
							].map((item, i) => (
								<div
									key={item.label}
									className={`flex items-center justify-between ${i > 0 ? 'pt-4 border-t border-white/[0.04]' : ''}`}
								>
									<div>
										<p className="text-[14px] text-white/70">{item.label}</p>
										<p className="text-[12px] text-white/25 mt-0.5">
											{item.desc}
										</p>
									</div>
									<Toggle enabled={item.enabled} />
								</div>
							))}
						</div>
					</SettingSection>

					{/* Danger */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
						className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] overflow-hidden"
					>
						<div className="p-5 pb-4">
							<h3 className="text-[15px] font-semibold text-red-400">
								Danger Zone
							</h3>
							<p className="text-[12px] text-white/25 mt-0.5">
								Irreversible actions
							</p>
						</div>
						<div className="border-t border-red-500/[0.06] p-5 flex items-center justify-between">
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
