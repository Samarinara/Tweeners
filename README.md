# Tweeners

Tweeners is a SvelteKit tennis drill library for club and school coaches. The site helps coaches find a practical drill courtside, filter by session constraints, and open a drill page with setup notes, coaching goals, progressions, variations, safety reminders, and print/share actions.

## Site

- `/` is a focused landing page with the Tweeners brand, court illustration, and a search box.
- `/search` lists all drills and supports keyword search, player count, difficulty, age group, skill focus, equipment, sorting, active filter chips, and a random drill action.
- `/drills/[slug]` renders each drill from MDsveX content with at-a-glance metadata, jump links, goals, setup content, progressions, variations, safety notes, copy link, and print controls.

Current drill content lives in `src/content/drills` and is loaded at build time.

## Developing

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm run dev
```

Run type and Svelte checks:

```sh
pnpm run check
```

Run tests:

```sh
pnpm run test
```

Build for production:

```sh
pnpm run build
```

Preview the production build:

```sh
pnpm run preview
```

## Drill Content

Create a new drill stub:

```sh
pnpm run drills:new -- "Drill Name"
```

Validate drill frontmatter:

```sh
pnpm run drills:validate
```

Each drill is an `.svx` file with frontmatter parsed by `src/lib/drills/schema.ts`. Frontmatter drives search, filtering, cards, and the drill page quick reference. The markdown body is rendered as the main setup/instruction content.

Supported frontmatter includes:

- `title`, `summary`, `goals`, and `safetyNotes`
- `difficulties`, `ages`, `skillFocus`, `equipment`, and `optionalEquipment`
- `playerCount`, `coaches`, and `durationMinutes`
- `tags`, `instructions`, `progressions`, and `variations`

Shared labels and valid filter keys are defined in `src/lib/drills/config.ts`.

## Quality Checks

The precommit script runs the drill validator, Svelte checks, and unit tests:

```sh
pnpm run precommit
```
