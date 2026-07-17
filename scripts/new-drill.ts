import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const title = process.argv.slice(2).join(' ').trim();

if (!title) {
	console.error('Usage: pnpm run drills:new -- "Drill Name"');
	process.exit(1);
}

const slug = title
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '');

const drillDirectory = join(process.cwd(), 'src/content/drills');
const path = join(drillDirectory, `${slug}.svx`);

if (existsSync(path)) {
	console.error(`Drill already exists: ${path}`);
	process.exit(1);
}

const template = `---
title: ${title}
summary: Add a short courtside summary.
goals:
  - Add the main coaching goal.
safetyNotes:
  - Add the main safety reminder.
difficulties:
  - orange
ages:
  - u10
playerCount:
  min: 2
  max: 8
coaches: 1
equipment:
  - balls
skillFocus:
  - rally
tags:
  - new drill
durationMinutes: 15
instructions:
  - Add the first instruction.
progressions: []
variations: []
---

## Setup

Add setup notes.

## Coaching Cues

- Add a cue.
`;

await mkdir(drillDirectory, { recursive: true });
await writeFile(path, template, 'utf8');
console.log(`Created ${path}`);
