import { describe, expect, it } from 'vitest';
import { matchesDrill, sortDrills, type DrillFilters } from './filter';
import type { Drill } from './index';

const baseDrill: Drill = {
	title: 'Rally River',
	summary: 'Control rally',
	goals: ['Build consistency'],
	safetyNotes: ['Keep balls clear'],
	difficulties: ['orange'],
	ages: ['u10'],
	playerCount: { min: 2, max: 8 },
	coaches: 1,
	equipment: ['balls', 'cones'],
	optionalEquipment: ['targets'],
	skillFocus: ['rally'],
	tags: ['cooperative-rally'],
	durationMinutes: 15,
	instructions: [],
	progressions: [],
	variations: [],
	slug: 'rally-river',
	component: (() => null) as unknown as Drill['component'],
	searchText: 'rally river control rally cooperative-rally orange u10'
};

const filters = (overrides: Partial<DrillFilters> = {}): DrillFilters => ({
	query: '',
	difficulties: [],
	ages: [],
	playerCount: undefined,
	skillFocus: [],
	equipment: [],
	sort: 'title',
	...overrides
});

describe('drill filters', () => {
	it('requires all selected filter groups to match', () => {
		expect.assertions(2);

		expect(
			matchesDrill(
				baseDrill,
				filters({ difficulties: ['orange'], ages: ['u10'], skillFocus: ['rally'] })
			)
		).toBe(true);
		expect(
			matchesDrill(
				baseDrill,
				filters({ difficulties: ['orange'], ages: ['u12'], skillFocus: ['rally'] })
			)
		).toBe(false);
	});

	it('matches player counts inclusively', () => {
		expect.assertions(3);

		expect(matchesDrill(baseDrill, filters({ playerCount: 2 }))).toBe(true);
		expect(matchesDrill(baseDrill, filters({ playerCount: 8 }))).toBe(true);
		expect(matchesDrill(baseDrill, filters({ playerCount: 9 }))).toBe(false);
	});

	it('treats equipment as available inventory', () => {
		expect.assertions(2);

		expect(matchesDrill(baseDrill, filters({ equipment: ['balls', 'cones'] }))).toBe(true);
		expect(matchesDrill(baseDrill, filters({ equipment: ['balls'] }))).toBe(false);
	});

	it('sorts by minimum players', () => {
		expect.assertions(1);

		const larger = { ...baseDrill, title: 'Big Rally', playerCount: { min: 6, max: 12 } };
		expect(sortDrills([larger, baseDrill], 'players').map((drill) => drill.title)).toEqual([
			'Rally River',
			'Big Rally'
		]);
	});
});
