import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');

/**
 * Automates the creation of barrel exports (index.js files) and updates package.json exports.
 * This ensures that consumers can import from clean paths like '@torq-system/grpc/protos'.
 */

//  Find all folders containing generated proto files (_pb.js or _connect.js)
function getProtoDirs(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const dirs = entries
		.filter((e: fs.Dirent) => e.isDirectory())
		.map((e: fs.Dirent) => path.join(dir, e.name));

	const hasProtos = fs.readdirSync(dir).some((f: string) => f.endsWith('_pb.js') || f.endsWith('_connect.js'));
	const subDirs = dirs.flatMap(getProtoDirs);

	return hasProtos ? [dir, ...subDirs] : subDirs;
}

//  Create index.js and index.d.ts (barrels) for a directory
function createBarrel(dir: string) {
	const files = fs.readdirSync(dir);
	const exports = files
		.filter((f: string) => f.endsWith('_pb.js') || f.endsWith('_connect.js'))
		.map((f: string) => `export * from './${f.replace('.js', '.js')}';`);

	if (exports.length === 0) return;

	// Write JS barrel
	fs.writeFileSync(path.join(dir, 'index.js'), `${exports.join('\n')}\n`);
	// Write TS declaration barrel (identical but without .js extensions in exports for TS)
	fs.writeFileSync(path.join(dir, 'index.d.ts'), `${exports.map((e: string) => e.replace(".js';", "';")).join('\n')}\n`);

	console.log(`Created barrel: ${path.relative(packageRoot, dir)}`);
}

//  Update package.json 'exports' field mapping
function syncPackageExports(protoDirs: string[]) {
	const pkgPath = path.join(packageRoot, 'package.json');
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

	// Default exports
	pkg.exports = {
		'.': './dist/generated/index.js',
		'./*': './dist/*',
	};

	// Map each proto folder to a subpath export
	const exportsObj = pkg.exports as Record<string, unknown>;
	for (const fullPath of protoDirs) {
		const relative = path.relative(path.join(distDir, 'generated'), fullPath);
		if (relative === '') continue; // Skip root as it's defined above

		exportsObj[`./${relative}`] = {
			types: `./dist/generated/${relative}/index.d.ts`,
			import: `./dist/generated/${relative}/index.js`,
			default: `./dist/generated/${relative}/index.js`,
		};
	}

	fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
	console.log(' Updated package.json exports');
}


// --- Main Execution ---
console.log(' Generating barrel files...');

// Scan and create barrels
const rootGenDir = path.join(distDir, 'generated');
const allDirs = getProtoDirs(rootGenDir);

for (const dir of allDirs) {
	createBarrel(dir);
}

// Generate root barrel in dist/generated
const rootExports: string[] = [];
for (const dir of allDirs) {
	if (dir === rootGenDir) continue;
	const relative = path.relative(rootGenDir, dir);
	const files = fs.readdirSync(dir);
	for (const file of files) {
		if (file.endsWith('_pb.js') || file.endsWith('_connect.js')) {
			rootExports.push(`export * from './${relative}/${file}';`);
		}
	}
}

if (rootExports.length > 0) {
	fs.writeFileSync(path.join(rootGenDir, 'index.js'), `${rootExports.join('\n')}\n`);
	fs.writeFileSync(path.join(rootGenDir, 'index.d.ts'), `${rootExports.map((e) => e.replace(".js';", "';")).join('\n')}\n`);
	console.log(' Generated root barrel');
}

// Sync with package.json
syncPackageExports(allDirs);
console.log('Done.');
