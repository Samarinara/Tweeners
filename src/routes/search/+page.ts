import { drills } from '$lib/drills';

export const prerender = true;

export const load = ({ url }) => {
	const searchParams = url.searchParams;

	return {
		drills,
		initialQuery: searchParams.get('q') ?? '',
		initialDifficulties: searchParams.getAll('difficulty'),
		initialAges: searchParams.getAll('age'),
		initialSkills: searchParams.getAll('skill'),
		initialEquipment: searchParams.getAll('equipment'),
		initialPlayers: searchParams.get('players') ?? '',
		initialSort: searchParams.get('sort') ?? 'title'
	};
};
