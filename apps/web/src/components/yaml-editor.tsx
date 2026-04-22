import { yaml } from '@codemirror/lang-yaml';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import CodeMirror, {
	EditorView,
	type ReactCodeMirrorProps,
} from '@uiw/react-codemirror';
import jsYaml from 'js-yaml';
import * as React from 'react';

const torqTheme = vscodeDarkInit({
	settings: {
		background: 'transparent',
		backgroundImage: '',
		foreground: '#e5e7eb',
		caret: '#10b981',
		selection: 'rgba(16, 185, 129, 0.2)',
		selectionMatch: 'rgba(16, 185, 129, 0.3)',
		lineHighlight: 'rgba(255, 255, 255, 0.03)',
		gutterBackground: 'transparent',
		gutterForeground: 'rgba(255, 255, 255, 0.3)',
		gutterBorder: 'transparent',
		fontFamily: "ui-monospace, 'SF Mono', Monaco, monospace",
	},
});

interface ValidationError {
	line: number;
	message: string;
}

function validateYaml(source: string): ValidationError[] {
	try {
		jsYaml.load(source);
		return [];
	} catch (e) {
		if (e instanceof jsYaml.YAMLException) {
			return [
				{
					line: e.mark?.line ?? 0,
					message: e.reason || 'Invalid YAML',
				},
			];
		}
		return [{ line: 0, message: 'Unknown error' }];
	}
}

/* ─── Component ─── */
export interface YamlEditorProps {
	/** YAML content */
	value: string;
	/** Called when content changes */
	onChange?: (value: string) => void;
	/** Read-only mode */
	readOnly?: boolean;
	/** Editor height (CSS value) */
	height?: string;
	/** Callback with validation errors on every change */
	onValidation?: (errors: ValidationError[]) => void;
	/** Additional className */
	className?: string;
	/** Hide title header */
	hideHeader?: boolean;
}

export function YamlEditor({
	value,
	onChange,
	readOnly = false,
	height = '400px',
	onValidation,
	className,
	hideHeader = false,
}: YamlEditorProps) {
	const handleChange = React.useCallback(
		(val: string) => {
			onChange?.(val);
			const errors = validateYaml(val);
			onValidation?.(errors);
		},
		[onChange, onValidation],
	);

	// Validate on mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: Validation strictly on mount
	React.useEffect(() => {
		const errors = validateYaml(value);
		onValidation?.(errors);
	}, []);

	const extensions = React.useMemo(() => {
		const exts: ReactCodeMirrorProps['extensions'] = [yaml(), torqTheme];
		if (readOnly) {
			exts.push(EditorView.editable.of(false));
		}
		return exts;
	}, [readOnly]);

	return (
		<div
			className={`rounded-xl border border-white/7 overflow-hidden ${className ?? ''} bg-zinc-950`}
		>
			{/* Title bar */}
			{!hideHeader && (
				<div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
					<div className="flex items-center gap-1.5">
						<div className="size-2 rounded-full bg-rose-500/20 border border-rose-500/30" />
						<div className="size-2 rounded-full bg-amber-500/20 border border-amber-500/30" />
						<div className="size-2 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
					</div>
					<div className="h-4 w-px bg-white/10 mx-1" />
					<span className="flex-1 text-[12px] font-mono font-bold text-white/40 tracking-wider">
						workflow.yaml
					</span>
					{readOnly && (
						<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5">
							<span className="text-[9px] font-black uppercase tracking-widest text-white/20">
								READ-ONLY
							</span>
						</div>
					)}
				</div>
			)}

			<CodeMirror
				value={value}
				onChange={handleChange}
				extensions={extensions}
				height={height}
				basicSetup={{
					lineNumbers: true,
					foldGutter: true,
					highlightActiveLine: true,
					highlightActiveLineGutter: true,
					indentOnInput: true,
					bracketMatching: true,
					autocompletion: false,
				}}
				theme={torqTheme}
			/>
		</div>
	);
}

export type { ValidationError };
