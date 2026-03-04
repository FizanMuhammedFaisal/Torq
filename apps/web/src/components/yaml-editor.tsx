import { yaml } from '@codemirror/lang-yaml';
import CodeMirror, { EditorView, type ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
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
			className={`rounded-xl border border-white/7 overflow-hidden ${className ?? ''} bg-[#0a0a0a]`}
		>
			{/* Title bar */}
			{!hideHeader && (
				<div className="flex items-center gap-2 px-4 py-2 border-b border-white/6 bg-[#0c0c0c]">
					<div className="flex gap-1.5">
						<div className="size-2.5 rounded-full bg-white/10" />
						<div className="size-2.5 rounded-full bg-white/10" />
						<div className="size-2.5 rounded-full bg-white/10" />
					</div>
					<span className="flex-1 text-center text-[10px] text-white/20 font-medium">
						workflow.yaml
					</span>
					{readOnly && (
						<span className="text-[9px] text-white/15 uppercase tracking-wider font-medium">
							read-only
						</span>
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
