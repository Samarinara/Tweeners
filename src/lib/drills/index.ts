import type { Component } from 'svelte';
import { drillFrontmatterSchema, type DrillFrontmatter } from './schema';

type DrillModule = {
	default: Component;
	metadata?: unknown;
};

export type Drill = DrillFrontmatter & {
	slug: string;
	component: Component;
	searchText: string;
};

const modules = import.meta.glob<DrillModule>('/src/content/drills/*.svx', {
	eager: true
});

const slugFromPath = (path: string) =>
	path
		.split('/')
		.pop()
		?.replace(/\.svx$/, '') ?? path;

const buildSearchText = (drill: DrillFrontmatter) =>
	[
		drill.title,
		drill.summary,
		drill.goals.join(' '),
		drill.skillFocus.join(' '),
		drill.tags.join(' '),
		drill.difficulties.join(' '),
		drill.ages.join(' ')
	]
		.join(' ')
		.toLowerCase();

export const drills = Object.entries(modules)
	.map(([path, module]) => {
		const result = drillFrontmatterSchema.safeParse(module.metadata);

		if (!result.success) {
			console.warn(`Skipping invalid drill "${path}":`, result.error.format());
			return null;
		}

		return {
			...result.data,
			slug: slugFromPath(path),
			component: module.default,
			searchText: buildSearchText(result.data)
		};
	})
	.filter((drill): drill is Drill => drill !== null)
	.sort((a, b) => a.title.localeCompare(b.title));

export const getDrill = (slug: string) => drills.find((drill) => drill.slug === slug);

export const allTags = Array.from(new Set(drills.flatMap((drill) => drill.tags))).sort();
