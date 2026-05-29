# ArtWise Conversation Design

## App Principle

ArtWise is optimized for one visitor intent:

> Turn one museum artwork photo into a guided art trail.

The model is the navigation. The app should not ask the user to fill a form, open a dashboard, or choose from menus before it helps. One tool call should return everything needed for the answer or a single view.

## Ideal Conversations

### 1. One Photo, No Extra Context

User says:

> I am in a museum. Turn this artwork photo into a guided trail.

Model action:

> Call `generate_art_trail` with a cautious visual description inferred from the image. Pass unknown title, artist, museum, and room as empty or `Unknown`.

App returns:

> A complete ArtTrail with a confidence note, observation guide, route choices, related artwork comparison cards with images, map search terms, location guidance, and a 3 to 5 stop mini trail.

### 2. Photo Plus Museum Context

User says:

> This is at the Musée d'Orsay in the Impressionist gallery. I want related works without photographing every painting.

Model action:

> Call `generate_art_trail` with museum, approximate room, inferred image description, and the user's natural-language goal.

App returns:

> An Impressionism-focused trail, comparison cards for Monet, Degas, Manet, and Pissarro, cautious location guidance, and a route that starts from the current room.

### 3. User Asks For a Different Route

User says:

> I prefer a theme route rather than artist names.

Model action:

> Use the already returned ArtTrail context to recommend the theme path. Call `generate_art_trail` again only if the user provides a new artwork photo or a materially different goal.

App returns:

> The theme route, using the same comparison cards and mini trail context already visible to the user and model.

## Tool Contract

- Tool: `generate_art_trail`
- Intent: generate a connected museum exploration trail from one photographed or described artwork.
- Inputs: optional and model-filled from the user's photo and conversation.
- Output: front-loaded data for a single complete response or one view.
- Do not add separate tools for route steps, artwork cards, location details, or follow-up questions unless a new user intent appears.
