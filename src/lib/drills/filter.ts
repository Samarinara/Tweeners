import {
	ageGroupOrder,
	difficultyOrder,
	type AgeGroup,
	type Difficulty,
	type Equipment,
	type SkillFocus
} from './config';
import type { Drill } from './index';

export type DrillFilters = {
	query: string;
	difficulties: Difficulty[];
	ages: AgeGroup[];
	playerCount?: number;
	skillFocus: SkillFocus[];
	equipment: Equipment[];
	sort: 'title' | 'difficulty' | 'players';
};

const intersects = <T>(selected: T[], values: T[]) =>
	selected.length === 0 || selected.some((value) => values.includes(value));

const hasEquipment = (available: Equipment[], required: Equipment[]) =>
	available.length === 0 || required.every((item) => available.includes(item));

export const matchesDrill = (drill: Drill, filters: DrillFilters) => {
	const query = filters.query.trim().toLowerCase();
	const playerCount = filters.playerCount;

	return (
		(query === '' || drill.searchText.includes(query)) &&
		intersects(filters.difficulties, drill.difficulties) &&
		intersects(filters.ages, drill.ages) &&
		(playerCount === undefined ||
			(drill.playerCount.min <= playerCount &&
				(drill.playerCount.max === undefined || drill.playerCount.max >= playerCount))) &&
		intersects(filters.skillFocus, drill.skillFocus) &&
		hasEquipment(filters.equipment, drill.equipment)
	);
};

export const sortDrills = (drills: Drill[], sort: DrillFilters['sort']) =>
	[...drills].sort((a, b) => {
		if (sort === 'difficulty') {
			return (
				Math.min(...a.difficulties.map((difficulty) => difficultyOrder.indexOf(difficulty))) -
				Math.min(...b.difficulties.map((difficulty) => difficultyOrder.indexOf(difficulty)))
			);
		}

		if (sort === 'players') {
			return a.playerCount.min - b.playerCount.min;
		}

		return a.title.localeCompare(b.title);
	});

export const labelPlayers = (drill: Pick<Drill, 'playerCount'>) =>
	drill.playerCount.max
		? `${drill.playerCount.min}-${drill.playerCount.max}`
		: `${drill.playerCount.min}+`;

export const minAgeIndex = (ages: AgeGroup[]) =>
	Math.min(...ages.map((age) => ageGroupOrder.indexOf(age)));
