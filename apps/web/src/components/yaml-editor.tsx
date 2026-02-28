import { yaml } from '@codemirror/lang-yaml';
import CodeMirror, { EditorView, type ReactCodeMirrorProps } from '@uiw/react-codemirror';
import jsYaml from 'js-yaml';
import * as React from 'react';

/* ─── Torq dark theme ─── */
const torqTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'oklch(0.10 0.005 285)',
			color: 'oklch(0.85 0 0)',
			fontSize: '13px',
			fontFamily: "'DM Sans', ui-monospace, 'SF Mono', Monaco, monospace",
		},
		'.cm-content': {
			padding: '12px 0',
			caretColor: 'oklch(0.70 0.15 162)',
		},
		'.cm-cursor': {
			borderLeftColor: 'oklch(0.70 0.15 162)',
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: 'oklch(0.70 0.15 162)',
		},
		'.cm-gutters': {
			backgroundColor: 'oklch(0.10 0.005 285)',
			color: 'oklch(0.40 0 0)',
			border: 'none',
			paddingLeft: '8px',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'oklch(0.14 0.005 285)',
			color: 'oklch(0.60 0 0)',
		},
		'.cm-activeLine': {
			backgroundColor: 'oklch(0.12 0.005 285)',
		},
		'.cm-selectionBackground': {
			backgroundColor: 'oklch(0.60 0.13 163 / 0.15) !important',
		},
		'&.cm-focused .cm-selectionBackground': {
			backgroundColor: 'oklch(0.60 0.13 163 / 0.2) !important',
		},
		'.cm-line': {
			padding: '0 12px',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: 'oklch(0.20 0 0)',
			border: 'none',
			color: 'oklch(0.50 0 0)',
		},
	},
	{ dark: true },
);

/* ─── Validation ─── */
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
}

export function YamlEditor({
	value,
	onChange,
	readOnly = false,
	height = '400px',
	onValidation,
	className,
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
	React.useEffect(() => {
		const errors = validateYaml(value);
		onValidation?.(errors);
		// eslint-disable-line react-hooks/exhaustive-deps
	}, []);

	const extensions = React.useMemo(() => {
		const exts: ReactCodeMirrorProps['extensions'] = [yaml(), torqTheme];
		if (readOnly) {
			exts.push(EditorView.editable.of(false));
		}
		return exts;
	}, [readOnly]);

	return (
		<div className={`rounded-xl border border-white/[0.07] overflow-hidden ${className ?? ''}`}>
			{/* Title bar */}
			<div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-[oklch(0.09_0.005_285)]">
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
				theme="dark"
			/>
		</div>
	);
}

export type { ValidationError };
