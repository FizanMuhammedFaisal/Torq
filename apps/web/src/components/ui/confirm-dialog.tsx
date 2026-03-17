import * as React from 'react';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConfirmDialogProps {
	/** Whether the dialog is open */
	open: boolean;
	/** Callback when open state changes */
	onOpenChange: (open: boolean) => void;
	/** Dialog title */
	title: string;
	/** Description / warning message */
	description: string;
	/** The text the user must type to enable confirmation */
	confirmText: string;
	/** Label shown on the confirm button (default: "Confirm") */
	confirmLabel?: string;
	/** Visual variant — destructive shows red styling */
	variant?: 'destructive' | 'default';
	/** Callback when user confirms */
	onConfirm: () => void;
	/** Whether confirm action is in progress */
	isPending?: boolean;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmText,
	confirmLabel = 'Confirm',
	variant = 'default',
	onConfirm,
	isPending = false,
}: ConfirmDialogProps) {
	const [value, setValue] = React.useState('');
	const isMatch = value === confirmText;

	// Reset input when dialog opens/closes
	React.useEffect(() => {
		if (!open) setValue('');
	}, [open]);

	const handleConfirm = () => {
		if (!isMatch || isPending) return;
		onConfirm();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="flex flex-col gap-2">
					<p className="text-xs text-muted-foreground">
						Type{' '}
						<span className="font-semibold text-foreground">{confirmText}</span>{' '}
						to confirm:
					</p>
					<Input
						value={value}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setValue(e.target.value)
						}
						placeholder={confirmText}
						autoFocus
						autoComplete="off"
						onKeyDown={(e: React.KeyboardEvent) => {
							if (e.key === 'Enter' && isMatch) handleConfirm();
						}}
					/>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<Button
						variant={variant === 'destructive' ? 'destructive' : 'default'}
						disabled={!isMatch || isPending}
						onClick={handleConfirm}
					>
						{isPending ? 'Processing…' : confirmLabel}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
