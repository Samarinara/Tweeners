import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { drillFrontmatterSchema } from '../src/lib/drills/schema';

const drillDirectory = join(process.cwd(), 'src/content/drills');

const frontmatterPattern = /^---\n([\s\S]*?)\n---/;

const parseScalar = (value: string) => {
	const trimmed = value.trim();
	if (trimmed === '[]') return [];
	if (/^\d+$/.test(trimmed)) return Number(trimmed);
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	return trimmed.replace(/^['"]|['"]$/g, '');
};

const parseFrontmatter = (source: string) => {
	const match = source.match(frontmatterPattern);
	if (!match) throw new Error('Missing frontmatter block.');

	const root: Record<string, unknown> = {};
	const stack: Array<{ indent: number; value: Record<string, unknown> | unknown[] }> = [
		{ indent: -1, value: root }
	];

	const lines = match[1].split('\n');

	for (const [index, rawLine] of lines.entries()) {
		if (!rawLine.trim()) continue;

		const indent = rawLine.search(/\S/);
		const line = rawLine.trim();

		while (stack.at(-1) && indent <= stack.at(-1)!.indent) stack.pop();
		const parent = stack.at(-1)!.value;

		if (line.startsWith('- ')) {
			if (!Array.isArray(parent)) throw new Error(`Unexpected list item: ${line}`);
			const value = line.slice(2);

			if (value.includes(':')) {
				const [key, ...rest] = value.split(':');
				const item: Record<string, unknown> = {};
				const scalar = rest.join(':').trim();
				if (scalar) item[key.trim()] = parseScalar(scalar);
				parent.push(item);
				stack.push({ indent, value: item });
			} else {
				parent.push(parseScalar(value));
			}
			continue;
		}

		const [key, ...rest] = line.split(':');
		const name = key.trim();
		const scalar = rest.join(':').trim();

		if (Array.isArray(parent)) throw new Error(`Unexpected mapping in list: ${line}`);

		if (scalar) {
			parent[name] = parseScalar(scalar);
			continue;
		}

		const nextLine = lines
			.slice(index + 1)
			.find((candidate) => candidate.search(/\S/) > indent && candidate.trim());
		const value: Record<string, unknown> | unknown[] = nextLine?.trim().startsWith('- ') ? [] : {};
		parent[name] = value;
		stack.push({ indent, value });
	}

	return root;
};

let failures = 0;

for (const file of await readdir(drillDirectory)) {
	if (!file.endsWith('.svx')) continue;

	const path = join(drillDirectory, file);
	const source = await readFile(path, 'utf8');

	try {
		const frontmatter = parseFrontmatter(source);
		const result = drillFrontmatterSchema.safeParse(frontmatter);

		if (!result.success) {
			failures += 1;
			console.error(`Invalid drill ${basename(path)}:`);
			console.error(
				result.error.issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n')
			);
		}
	} catch (error) {
		failures += 1;
		console.error(`Could not validate ${basename(path)}:`);
		console.error(error instanceof Error ? error.message : error);
	}
}

if (failures > 0) {
	process.exitCode = 1;
} else {
	console.log('All drill files are valid.');
}
