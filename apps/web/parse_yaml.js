import { parser } from '@lezer/yaml';
import { styleTags, tags as t } from '@lezer/highlight';

const tree = parser.parse(`
name: production-deploy
triggers:
  - type: push
    branches: [main]
steps:
  - name: Build and Test
    run: npm ci && npm test
`);

let out = "";
tree.cursor().iterate(node => {
  out += node.name + " (" + node.from + "-" + node.to + ")\n";
});
console.log(out);
