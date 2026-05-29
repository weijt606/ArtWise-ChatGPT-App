# ArtWise ChatGPT App

ArtWise is a lightweight ChatGPT App for museum visitors. Its core experience, ArtTrail, turns one photographed or described artwork into a guided museum trail with related artwork comparisons, image cards, map search terms, and cautious location guidance.

Built with Skybridge and exposed to ChatGPT through one MCP tool.

## What It Does

- Explains the current artwork in concise museum-guide language.
- Gives a confidence note when the artwork identity is uncertain.
- Suggests route choices such as artist path, movement path, theme path, and visual motif path.
- Recommends related artworks or comparison categories.
- Includes comparison images and map search terms for demo-ready artwork cards.
- Builds a 3 to 5 stop suggested museum trail.
- Avoids pretending to know exact room numbers when no current museum map data is provided.

## Product Principle

Design conversations, not screens.

The intended user flow is:

1. The user selects ArtWise in ChatGPT.
2. The user uploads one museum artwork photo.
3. ChatGPT calls `generate_art_trail`.
4. ArtWise returns everything needed in one response: artwork brief, route choices, comparison cards, location strategy, and mini trail.

No database, authentication, crawler, museum API, indoor navigation, or custom image recognition model is required for this hack-night version.

## Tool

### `generate_art_trail`

Generate a connected museum exploration trail from one photographed or described artwork.

Inputs are optional because ChatGPT should infer what it can from the photo and conversation:

- `visitor_request`
- `museum_name`
- `gallery_or_room`
- `artwork_title`
- `artist_name`
- `artwork_description`
- `user_interest`
- `known_nearby_artworks`

The tool returns front-loaded `structuredContent` and visible text for ChatGPT, including:

- `conversation_model`
- `current_artwork_brief`
- `confidence_note`
- `guided_options`
- `related_artwork_cards`
- `location_detail_plan`
- `suggested_mini_trail`
- `how_to_explore_without_repeated_photos`
- `next_best_photo_if_needed`

## Demo Prompt

In ChatGPT, connect the app through the Skybridge MCP URL, select ArtWise, upload a museum artwork photo, then ask:

```text
Use ArtWise to create a suggested museum trail from this photo. For every trail stop, include the related artwork image, approximate museum location guidance, and map search terms.
```

If ChatGPT needs an explicit instruction to call the tool:

```text
Call generate_art_trail using the image context. Use Unknown for title, artist, museum, or room if not visible.
```

## Development

Install dependencies:

```bash
npm install
```

Start Skybridge DevTools:

```bash
npm run dev
```

Start with an Alpic tunnel for ChatGPT testing:

```bash
npm run dev -- --tunnel
```

Build:

```bash
npm run build
```

Deploy to Alpic:

```bash
npm run deploy
```

## Testing In ChatGPT

Use the MCP URL printed by Skybridge, usually:

```text
https://<your-tunnel-or-production-domain>/mcp
```

Do not test the MCP endpoint by opening it directly in a browser. MCP endpoints expect an MCP client request, so a browser `GET` may return `Method not allowed`.

## Safety And Accuracy

ArtWise intentionally avoids high-risk claims:

- It does not claim exact artwork identity unless the user provides it.
- It does not fabricate exact museum room numbers.
- It does not claim live access to museum collections or maps.
- It asks the user to verify title, artist, date, and room on the wall label or current museum map.
- Related artwork images are demo comparison assets and should be treated as comparison aids, not proof that a work is currently nearby.

## Public Repo Hygiene

This repository is safe to publish because it should not include:

- `.env` files
- API keys
- Alpic local project bindings
- tunnel URLs
- local build output
- `node_modules`

Before pushing, scan tracked files for API keys, local tunnel URLs, session IDs, Alpic team/project/environment IDs, and personal account details.

Expected result: no real credentials or local deployment identifiers in tracked files.
