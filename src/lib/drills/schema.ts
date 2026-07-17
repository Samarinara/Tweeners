import { z } from 'zod';
import { ageGroups, difficulties, equipment, normalizeTag, skillFocuses } from './config';

const keys = <T extends Record<string, unknown>>(value: T) =>
	Object.keys(value) as [keyof T & string, ...(keyof T & string)[]];

const optionalStringArray = z.array(z.string().trim().min(1)).default([]);
const requiredStringArray = z.array(z.string().trim().min(1)).min(1);

export const playerCountSchema = z.object({
	min: z.number().int().positive(),
	max: z.number().int().positive().optional()
});

export const variationSchema = z.object({
	title: z.string().trim().min(1),
	summary: z.string().trim().optional(),
	difficulties: z.array(z.enum(keys(difficulties))).default([]),
	ages: z.array(z.enum(keys(ageGroups))).default([]),
	instructions: optionalStringArray,
	progressions: optionalStringArray,
	safetyNotes: optionalStringArray
});

export const drillFrontmatterSchema = z.object({
	title: z.string().trim().min(1),
	summary: z.string().trim().min(1),
	goals: requiredStringArray,
	safetyNotes: requiredStringArray,
	difficulties: z.array(z.enum(keys(difficulties))).default([]),
	ages: z.array(z.enum(keys(ageGroups))).default([]),
	playerCount: playerCountSchema,
	coaches: z.number().int().positive().optional(),
	equipment: z.array(z.enum(keys(equipment))).default([]),
	skillFocus: z.array(z.enum(keys(skillFocuses))).default([]),
	tags: z.array(z.string().trim().min(1).transform(normalizeTag)).default([]),
	durationMinutes: z.number().int().positive().optional(),
	instructions: optionalStringArray,
	progressions: optionalStringArray,
	variations: z.array(variationSchema).default([])
});

export type DrillFrontmatter = z.infer<typeof drillFrontmatterSchema>;
