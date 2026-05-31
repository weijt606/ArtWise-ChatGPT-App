# ArtWise

Turn one museum photo into a guided art trail.

ArtWise is a lightweight ChatGPT App for museum visitors and travelers. Upload one artwork photo and ArtWise turns it into a compact museum-guide experience: a quick artwork brief, related artwork image cards, visual comparison prompts, map search terms, and a suggested 3 to 5 stop trail.

## Live Demo

- Alpic Playground: [artwise-51b9fcac.alpic.live/try](https://artwise-51b9fcac.alpic.live/try)
- Production MCP server: `https://artwise-51b9fcac.alpic.live/mcp`

## Why ArtWise

Repeatedly photographing every artwork and asking separate questions interrupts a museum visit. ArtWise uses one photo as the starting point for a connected exploration route.

The goal is not only artwork identification. ArtWise helps visitors understand what to notice next through:

- the same artist or artistic circle
- the same movement or period
- related subjects and themes
- similar visual motifs
- useful contrast works

## Core Experience

1. Select ArtWise in ChatGPT.
2. Upload one museum artwork photo.
3. Optionally mention the museum, gallery, or a preference such as artist, history, technique, or a quick trail.
4. ArtWise renders a museum-guide widget with current artwork context, related artwork images, cautious location guidance, and a mini trail.

ArtWise front-loads the full trail in one tool call. There is no dashboard, database, account system, or multi-step form.

## ChatGPT App Tools

### `warmup_artwise`

Returns a short onboarding message before an artwork photo is available. It tells the visitor to upload one clear photo and optionally share a museum location or viewing preference.

### `generate_art_trail`

Generates the full guided museum trail from an artwork photo, description, or conversation context. The tool returns structured content for the ArtWise widget, including:

- current artwork information and confidence note
- visual observation guide
- related artwork image cards
- comparison prompts
- approximate location guidance
- map search terms
- suggested 3 to 5 stop mini trail
- next best photo only when clarification is needed

## Widget

The ArtWise widget is rendered by the ChatGPT App UI rather than relying on a text response to preserve markdown images. It displays:

- a museum-label-style artwork summary
- related artwork comparison cards with images
- a visual route summary
- trail stops with artwork images and location guidance

## Demo Prompt

Upload an artwork photo and ask:

```text
Use ArtWise. Turn this artwork photo into a guided museum trail.
```

For a location-aware demo:

```text
Use ArtWise. I am in Musee d'Orsay in the Impressionist galleries. Turn this artwork into a 5-stop trail with related artwork images and map search terms.
```

Before uploading a photo:

```text
Hi, I am in Hamburger Bahnhof in Berlin. How should I use ArtWise?
```

## Local Development

Install dependencies:

```bash
npm install
```

Start Skybridge DevTools:

```bash
npm run dev -- --port 3000
```

Open:

```text
http://localhost:3000/
```

The local MCP endpoint is:

```text
http://localhost:3000/mcp
```

Start with an Alpic tunnel:

```bash
npm run dev -- --port 3000 --tunnel
```

Build:

```bash
npm run build
```

Deploy to Alpic:

```bash
npm run deploy
```

## Architecture

ArtWise is intentionally small:

- Skybridge MCP server
- React widget for ChatGPT App rendering
- static public-domain comparison images hosted on Wikimedia Commons
- Alpic Cloud deployment

This hack-night version does not include:

- authentication
- a database
- external museum APIs
- real indoor navigation
- live museum collection access
- custom image recognition models
- artwork pricing or investment advice

## Accuracy And Safety

ArtWise uses cautious language when information is incomplete:

- It does not claim an exact artwork identity when the input is uncertain.
- It does not fabricate room numbers or current display locations.
- It asks visitors to verify title, artist, date, medium, and room using wall labels or the museum map.
- Related artwork images are visual comparison aids, not proof that a work is currently nearby or on view.

## Submission Materials

- [Privacy policy](./PRIVACY.md)
- [Terms of service](./TERMS.md)
- [ChatGPT submission notes](./CHATGPT_SUBMISSION.md)
- [ChatGPT submission JSON](./chatgpt-app-submission.json)

## License

This repository is an ArtWise prototype built for a hack-night demo.
