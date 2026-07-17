export const difficulties = {
	red: 'Red ball / first rally',
	orange: 'Orange ball / early development',
	green: 'Green ball / building patterns',
	yellow: 'Yellow ball / full court',
  competitive: 'Competitive training'
} as const;

export const ageGroups = {
	u8: 'Under 8',
	u10: 'Under 10',
	u12: 'Under 12',
	u14: 'Under 14',
	u16: 'Under 16',
	u18: 'Under 18',
	adult: 'Adult'
} as const;

export const skillFocuses = {
	serve: 'Serve',
	return: 'Return',
	rally: 'Rally',
  groundstrokes: 'Groundstrokes',
	volley: 'Volley',
	footwork: 'Footwork',
	tactics: 'Tactics',
	fitness: 'Fitness',
	coordination: 'Coordination',
	teamwork: 'Teamwork',
  competition: 'Competition'
} as const;

export const equipment = {
	balls: 'Tennis balls',
	cones: 'Cones',
	targets: 'Targets',
	hoops: 'Hoops',
	strips: 'Throw-down lines',
  baskets: 'Ball baskets',
  buckets: 'Any bucket/container'
} as const;

export type Difficulty = keyof typeof difficulties;
export type AgeGroup = keyof typeof ageGroups;
export type SkillFocus = keyof typeof skillFocuses;
export type Equipment = keyof typeof equipment;

export const difficultyOrder = Object.keys(difficulties) as Difficulty[];
export const ageGroupOrder = Object.keys(ageGroups) as AgeGroup[];

export const normalizeTag = (tag: string) =>
	tag
		.trim()
		.toLowerCase()
		.replace(/[\s_-]+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/^-+|-+$/g, '');

export const formatTag = (tag: string) =>
	normalizeTag(tag)
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
