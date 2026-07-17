import { error } from '@sveltejs/kit';
import { drills, getDrill } from '$lib/drills';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => drills.map((drill) => ({ slug: drill.slug }));

export const load: PageLoad = ({ params }) => {
	const drill = getDrill(params.slug);

	if (!drill) {
		error(404, 'Drill not found');
	}

	return { drill };
};
