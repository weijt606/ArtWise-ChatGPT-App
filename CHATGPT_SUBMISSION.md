# ArtWise ChatGPT App Submission Notes

## App Info

- Display name: ArtWise
- Subtitle: Museum art trails
- Category: EDUCATION
- Production MCP Server URL: `https://artwise-51b9fcac.alpic.live/mcp`
- Playground URL: `https://artwise-51b9fcac.alpic.live/try`
- Privacy policy URL: `https://github.com/weijt606/ArtWise-ChatGPT-App/blob/main/PRIVACY.md`

## Short Description

ArtWise turns one museum artwork photo into a guided art trail with concise artwork context, related artwork image cards, and cautious location guidance.

## Long Description

ArtWise helps museum visitors avoid repeatedly photographing every artwork and asking separate questions. The user selects ArtWise in ChatGPT, uploads one artwork photo, and optionally provides museum or preference context. ArtWise returns a compact museum-guide experience: current artwork details, confidence notes, visual observation cues, related artworks or artwork types, image-backed comparison cards, map search terms, and a 3 to 5 stop mini trail.

ArtWise is not a real-time museum map, indoor navigation system, or live collection search tool. When exact title, artist, date, room, or current display status is uncertain, it asks the user to verify details on the wall label or museum map.

## Tools

### warmup_artwise

Use when the user greets ArtWise, mentions a museum/location, or asks how to start before uploading an artwork photo.

Expected behavior:

- Give a brief greeting.
- Ask the user to upload one clear artwork photo.
- Suggest optional preferences such as artist, history, technique, theme, related works, or a quick trail.

### generate_art_trail

Use when the user shares an artwork photo, artwork description, or asks for a connected museum trail.

Expected behavior:

- Explain the current artwork in concise museum-guide language.
- Clearly state uncertainty when exact identity cannot be confirmed.
- Generate related artwork image cards and comparison prompts.
- Provide approximate location guidance and map search terms.
- Render the ArtWise widget with current artwork details, related images, and a mini trail.

## Recommended Review Prompts

1. Warmup before a photo:

```text
Hi, I am in Hamburger Bahnhof in Berlin. How should I use ArtWise?
```

2. One artwork photo, concise trail:

```text
Use ArtWise. Turn this artwork photo into a guided museum trail.
```

3. Artwork with user preference:

```text
Use ArtWise. I want to understand this artist and find related works nearby without photographing every painting.
```

4. Known museum context:

```text
Use ArtWise. I am in Musee d'Orsay in the Impressionist galleries. Turn this artwork into a 5-stop trail with related artwork images and map search terms.
```

5. Uncertain artwork identity:

```text
Use ArtWise. I do not know the title or artist. Based on this photo, give me a cautious museum trail and tell me what to verify on the wall label.
```

## Negative Test Prompts

The app should not be invoked for these unrelated requests:

- "Book a restaurant near the museum."
- "Buy a print of this artwork."
- "Give me real-time indoor directions to the nearest restroom."
- "Authenticate with the museum website and pull my tickets."
- "Predict whether this artwork is a good financial investment."

## Review Notes

- No user authentication.
- No database.
- No payment or commerce flow.
- No external museum API.
- No real indoor navigation.
- No claim of live collection access.
- Wikimedia image URLs are used as visual comparison aids.
- Exact artwork identity and room location should be verified by wall label or museum map when uncertain.
