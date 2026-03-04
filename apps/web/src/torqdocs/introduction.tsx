import { H1, H2, P, Ul, InlineCode, Alert } from '@/components/docs/typography';
import { CodeBlock } from '@/components/docs/code-block';

export function IntroductionDocs() {
	return (
		<>
			<H1 id="introduction">Introduction to Torq YAML</H1>
			<P>
				Torq uses a declarative YAML Domain Specific Language (DSL) to define execution pipelines.
				Unlike traditional shell scripts, Torq workflows execute in isolated, deterministic
				environments where steps run in parallel by default unless dependencies are explicitly
				defined.
			</P>

			<Alert type="info">
				Every Torq workflow must exist as a single <InlineCode>.yml</InlineCode> or{' '}
				<InlineCode>.yaml</InlineCode> file in your repository.
			</Alert>

			<H2 id="structure">Workflow Structure</H2>
			<P>At a macroscopic level, every workflow file requires three core sections:</P>
			<Ul>
				<li>
					<strong>Metadata:</strong> Information identifying the workflow (e.g.,{' '}
					<InlineCode>name</InlineCode>).
				</li>
				<li>
					<strong>Triggers:</strong> Events that start the workflow (e.g.,{' '}
					<InlineCode>push</InlineCode>, <InlineCode>schedule</InlineCode>).
				</li>
				<li>
					<strong>Steps:</strong> The array of actions that execute when triggered.
				</li>
			</Ul>

			<CodeBlock
				filename="example-workflow.yml"
				language="yaml"
				code={`
name: production-deploy

triggers:
  - type: push
    branches: [main]

steps:
  - name: Build and Test
    run: npm ci && npm test
				`}
			/>

			<H2 id="validation">Validation & Secrets</H2>
			<P>
				The Torq execution engine performs strict static analysis on your workflow definitions
				before startup. If you reference a secret via{' '}
				<InlineCode>{`\${{ secrets.DB_URL }}`}</InlineCode>, Torq will ensure the environment
				provides that secret before initializing the container.
			</P>
		</>
	);
}
