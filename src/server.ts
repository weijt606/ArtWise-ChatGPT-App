import { McpServer } from "skybridge/server";
import { z } from "zod";

const unknownValues = new Set(["", "unknown", "unsure", "n/a", "na", "none"]);

function clean(value?: string) {
  return value?.trim() ?? "";
}

function isKnown(value?: string) {
  return !unknownValues.has(clean(value).toLowerCase());
}

function splitNearbyArtworks(value: string) {
  return value
    .split(/[\n;,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferMovement(description: string, interest: string) {
  const text = `${description} ${interest}`.toLowerCase();

  if (
    text.includes("impression") ||
    text.includes("loose brushwork") ||
    text.includes("soft light") ||
    text.includes("leisure")
  ) {
    return "Impressionism";
  }

  if (text.includes("cubist") || text.includes("fragmented")) {
    return "Cubism";
  }

  if (text.includes("renaissance") || text.includes("linear perspective")) {
    return "Renaissance art";
  }

  if (text.includes("baroque") || text.includes("dramatic light")) {
    return "Baroque art";
  }

  if (text.includes("abstract") || text.includes("nonrepresentational")) {
    return "modern abstraction";
  }

  return "the period, movement, and visual tradition suggested by the wall label";
}

function inferSubject(description: string, interest: string) {
  const text = `${description} ${interest}`.toLowerCase();

  if (
    text.includes("leisure") ||
    text.includes("luncheon") ||
    text.includes("boating") ||
    text.includes("social") ||
    text.includes("café") ||
    text.includes("cafe") ||
    text.includes("outdoor")
  ) {
    return "modern leisure, social life, and everyday experience";
  }

  if (text.includes("portrait") || text.includes("pose") || text.includes("figure")) {
    return "the figure, pose, identity, and social presence";
  }

  if (text.includes("landscape") || text.includes("garden") || text.includes("water")) {
    return "landscape, atmosphere, weather, and light";
  }

  if (text.includes("religious") || text.includes("saint") || text.includes("altar")) {
    return "religious narrative, devotion, and symbolic detail";
  }

  if (text.includes("abstract") || text.includes("nonrepresentational")) {
    return "color, form, rhythm, surface, and spatial tension";
  }

  return "the main subject and visual clues visible in the photo";
}

function inferTechnique(description: string, movement: string) {
  const text = `${description} ${movement}`.toLowerCase();

  if (
    text.includes("impression") ||
    text.includes("loose brushwork") ||
    text.includes("soft light") ||
    text.includes("dappled")
  ) {
    return "loose visible brushwork, broken color, and attention to light";
  }

  if (text.includes("flat") || text.includes("decorative") || text.includes("symbol")) {
    return "flattened color, simplified forms, and symbolic composition";
  }

  if (text.includes("dramatic light") || text.includes("baroque")) {
    return "strong light contrast, theatrical composition, and heightened gesture";
  }

  return "composition, color, material, surface, light, and handling";
}

function getRelatedArtworkCards(movement: string, knownNearbyArtworks: string) {
  const text = `${movement} ${knownNearbyArtworks}`.toLowerCase();

  if (
    text.includes("impression") ||
    text.includes("monet") ||
    text.includes("degas") ||
    text.includes("manet") ||
    text.includes("pissarro") ||
    text.includes("sisley")
  ) {
    return [
      {
        title: "The Saint-Lazare Station",
        artist: "Claude Monet",
        date_or_period: "1877, Impressionism",
        likely_location_detail:
          "At Musée d'Orsay, look in the Impressionist / Monet area or search the museum map for 'Monet' and 'Gare Saint-Lazare'. Verify the exact room on the current museum map.",
        map_search_terms: ["Monet", "Gare Saint-Lazare", "Impressionism"],
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/6/61/Claude_Monet_-_The_Saint-Lazare_Station_-_Google_Art_Project.jpg",
        why_compare:
          "Compare Monet's modern urban atmosphere with the uploaded work's light, brushwork, and sense of passing time.",
        what_to_notice:
          "Look at steam, reflected light, cropped space, and how loose marks create movement rather than precise detail.",
        viewing_prompt:
          "Does the first artwork feel more social, more atmospheric, or more observational than Monet's railway scene?",
      },
      {
        title: "L'Absinthe",
        artist: "Edgar Degas",
        date_or_period: "1875-1876, Impressionist circle",
        likely_location_detail:
          "At Musée d'Orsay, search the map or gallery labels for 'Degas' or 'In a Café / L'Absinthe'. It may be grouped with modern Parisian life rather than outdoor Impressionist landscapes.",
        map_search_terms: ["Degas", "L'Absinthe", "In a Café", "modern Paris"],
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/1/1f/Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project.jpg",
        why_compare:
          "Degas shifts Impressionist modern life indoors, making social observation feel quieter and more psychologically tense.",
        what_to_notice:
          "Compare pose, spacing, table edges, muted color, and the feeling of being an observer inside the scene.",
        viewing_prompt:
          "How does the mood change when modern leisure becomes still, interior, and slightly uneasy?",
      },
      {
        title: "Olympia",
        artist: "Édouard Manet",
        date_or_period: "1863, Realism / precursor to Impressionism",
        likely_location_detail:
          "At Musée d'Orsay, search the museum map for 'Manet' or 'Olympia'. Use it as a transition stop before or near the Impressionist galleries, depending on the museum's current layout.",
        map_search_terms: ["Manet", "Olympia", "Realism", "modern painting"],
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg",
        why_compare:
          "Manet helps explain the break with academic polish that made Impressionism possible.",
        what_to_notice:
          "Look for flatness, direct gaze, simplified modeling, strong contrast, and the shock of modern subject matter.",
        viewing_prompt:
          "What feels more radical: the subject, the pose, or the way the paint refuses a polished illusion?",
      },
      {
        title: "Boulevard Montmartre, Spring",
        artist: "Camille Pissarro",
        date_or_period: "1897, Impressionism",
        likely_location_detail:
          "At Musée d'Orsay, search for 'Pissarro' or 'Boulevard Montmartre'. If it is not nearby, look for another Pissarro city view or landscape in the same Impressionist section.",
        map_search_terms: ["Pissarro", "Boulevard Montmartre", "city view"],
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/f/ff/Camille_Pissarro_-_Boulevard_Montmartre%2C_Spring_-_Google_Art_Project.jpg",
        why_compare:
          "Pissarro turns modern city life into a pattern of atmosphere, crowds, weather, and repeated marks.",
        what_to_notice:
          "Compare viewpoint, rhythm, small figures, seasonal light, and how the scene is organized from a distance.",
        viewing_prompt:
          "Does distance make the modern scene feel more personal or more like a living system?",
      },
    ];
  }

  return [
    {
      title: "Same-artist comparison",
      artist: "Use the wall label to verify",
      date_or_period: "Same artist or workshop direction",
      likely_location_detail:
        "Start with the current room, then search nearby labels and the museum map for the artist name from the uploaded work. If the museum map has no result, use this as a comparison category rather than an exact stop.",
      map_search_terms: ["same artist", "artist name from wall label", "workshop"],
      image_url:
        "https://upload.wikimedia.org/wikipedia/commons/6/61/Claude_Monet_-_The_Saint-Lazare_Station_-_Google_Art_Project.jpg",
      why_compare:
        "A second work by the same artist helps separate recurring style from details unique to the uploaded artwork. The image shown here is an illustrative comparison card; verify the actual nearby work on the museum map.",
      what_to_notice:
        "Compare composition, subject, technique, color, and repeated motifs.",
      viewing_prompt:
        "Which choices repeat, and which choices seem specific to the photographed artwork?",
    },
    {
      title: "Same-period comparison",
      artist: "Nearby artist from the same room",
      date_or_period: "Similar date range",
      likely_location_detail:
        "Use the date range on the current wall label and look for nearby labels within roughly the same decade or movement section.",
      map_search_terms: ["same period", "same movement", "date range"],
      image_url:
        "https://upload.wikimedia.org/wikipedia/commons/1/1f/Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project.jpg",
      why_compare:
        "A work from the same period shows what the first artwork shares with its historical moment.",
      what_to_notice:
        "Compare labels for dates, materials, patronage, subject, and movement terms.",
      viewing_prompt:
        "What does the first artwork share with its neighbors, and where does it stand apart?",
    },
    {
      title: "Contrast work",
      artist: "Nearby contrasting artist",
      date_or_period: "Different style or medium",
      likely_location_detail:
        "Stay in the same gallery first and choose a visibly different work; if none is nearby, use the next adjacent room as the contrast stop.",
      map_search_terms: ["contrast", "different medium", "adjacent room"],
      image_url:
        "https://upload.wikimedia.org/wikipedia/commons/5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg",
      why_compare:
        "A contrasting work makes the uploaded artwork's visual choices easier to see.",
      what_to_notice:
        "Look for differences in scale, medium, surface, mood, perspective, and finish.",
      viewing_prompt:
        "What becomes clearer about the first artwork after seeing its opposite?",
    },
  ];
}

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildTrailMapSvg(
  museum: string,
  room: string,
  trail: Array<{
    stop: string;
    recommended_artwork: string;
    recommended_artist: string;
  }>,
) {
  const short = (value: string, max = 24) =>
    value.length > max ? `${value.slice(0, max - 1)}…` : value;
  const nodes = [
    { x: 88, y: 92 },
    { x: 260, y: 92 },
    { x: 432, y: 92 },
    { x: 432, y: 238 },
    { x: 260, y: 238 },
  ];
  const lines = nodes
    .slice(1)
    .map((node, index) => {
      const previous = nodes[index];
      return `<line x1="${previous.x}" y1="${previous.y}" x2="${node.x}" y2="${node.y}" stroke="#7C6F64" stroke-width="3" stroke-dasharray="8 7" />`;
    })
    .join("");
  const labels = trail
    .map((stop, index) => {
      const node = nodes[index];
      return `
        <g>
          <circle cx="${node.x}" cy="${node.y}" r="30" fill="#F3EEE7" stroke="#3E3A36" stroke-width="2" />
          <text x="${node.x}" y="${node.y + 6}" text-anchor="middle" font-size="18" font-family="Arial" font-weight="700" fill="#24211F">${index + 1}</text>
          <text x="${node.x}" y="${node.y + 49}" text-anchor="middle" font-size="13" font-family="Arial" font-weight="700" fill="#24211F">${short(stop.recommended_artwork, 22)}</text>
          <text x="${node.x}" y="${node.y + 67}" text-anchor="middle" font-size="11" font-family="Arial" fill="#625B54">${short(stop.recommended_artist, 24)}</text>
        </g>`;
    })
    .join("");

  const subtitle = room
    ? `${room} · verify exact locations on the museum map`
    : `${museum} · use map search and wall labels`;

  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="520" height="340" viewBox="0 0 520 340">
      <rect width="520" height="340" rx="18" fill="#FBFAF7" />
      <rect x="24" y="28" width="472" height="284" rx="14" fill="#FFFFFF" stroke="#D9D1C7" />
      <text x="44" y="58" font-size="18" font-family="Arial" font-weight="700" fill="#24211F">Suggested museum trail</text>
      <text x="44" y="79" font-size="12" font-family="Arial" fill="#625B54">${short(subtitle, 66)}</text>
      ${lines}
      ${labels}
      <text x="44" y="294" font-size="11" font-family="Arial" fill="#7C6F64">Approximate guide only. Follow current wall labels and museum map.</text>
    </svg>
  `);
}

const fallbackArtworkImages = [
  "https://upload.wikimedia.org/wikipedia/commons/6/61/Claude_Monet_-_The_Saint-Lazare_Station_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/1f/Edgar_Degas_-_In_a_Caf%C3%A9_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/ff/Camille_Pissarro_-_Boulevard_Montmartre%2C_Spring_-_Google_Art_Project.jpg",
];

function requiredArtworkImage(imageUrl: string | undefined, index: number) {
  return clean(imageUrl) || fallbackArtworkImages[index % fallbackArtworkImages.length];
}

const server = new McpServer(
  {
    name: "ArtWise",
    version: "0.0.1",
  },
  { capabilities: {} },
)
  .registerTool(
    {
      name: "warmup_artwise",
      description:
        "Use this when the user greets ArtWise, says where they are, or asks how to start before uploading an artwork photo. This is only for onboarding before an artwork photo is available.",
      inputSchema: {
        visitor_message: z
          .string()
          .optional()
          .describe("The user's greeting or location context."),
        museum_or_location: z
          .string()
          .optional()
          .describe("Museum, city, station, or rough location if the user mentioned one."),
      },
      annotations: {
        title: "Start ArtWise",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        "openai/toolInvocation/invoking": "Getting ArtWise ready…",
        "openai/toolInvocation/invoked": "ArtWise is ready.",
      },
    },
    async (input) => {
      const location = clean(input.museum_or_location);
      const contextLine = location
        ? `You are at or near ${location}.`
        : "You can start from any museum gallery.";
      const structuredContent = {
        greeting: "Hi, I am ArtWise.",
        short_response:
          `${contextLine} Take one clear photo of an artwork, and I will turn it into a short museum trail.`,
        what_to_send_next: [
          "A photo of the artwork.",
          "Optional: the museum or gallery name if you know it.",
          "Optional: whether you prefer the artist, historical background, technique, theme, or nearby comparisons.",
        ],
        example_preferences: [
          "I want to understand the artist.",
          "I care more about the historical background.",
          "Show me nearby related works with images.",
          "Make it quick. I am walking through the gallery.",
        ],
        next_prompt:
          "Upload one artwork photo and add a preference if you have one.",
      };

      return {
        structuredContent,
        content: [
          {
            type: "text",
            text:
              `Hi, I am ArtWise. ${contextLine}\n\n` +
              "Take one clear photo of an artwork. If you want, add a preference:\n" +
              "- artist\n" +
              "- historical background\n" +
              "- technique and visual details\n" +
              "- related works nearby\n" +
              "- a quick walking trail\n\n" +
              "Then I will give you a concise ArtTrail with related images, map search terms, and approximate location guidance.",
          },
        ],
        isError: false,
      };
    },
  )
  .registerTool(
  {
    name: "generate_art_trail",
    description:
      "Use this whenever the user selects ArtWise and shares a museum artwork photo, artwork description, or asks for a museum trail, related artworks, comparison images, where to go next, map search terms, or location guidance. Do not just identify or explain the artwork; generate the full ArtWise trail. The final answer must preserve the image-backed related artwork cards and the mini-trail location guidance from this tool result. If the user only provides a photo, infer cautious visual context from the image and pass unknown text fields as empty or Unknown.",
    inputSchema: {
      visitor_request: z
        .string()
        .optional()
        .describe(
          "The user's natural-language request, such as 'turn this photo into a museum trail'. Do not ask the user to fill a form; infer the other fields from the photo and conversation when possible.",
        ),
      museum_name: z.string().optional().describe("Museum name, if known."),
      gallery_or_room: z
        .string()
        .optional()
        .describe("Approximate gallery, wing, floor, or room, if known."),
      artwork_title: z
        .string()
        .optional()
        .describe("Artwork title. May be 'Unknown' if not visible."),
      artist_name: z
        .string()
        .optional()
        .describe("Artist name. May be 'Unknown' if not visible."),
      artwork_description: z
        .string()
        .optional()
        .describe(
          "Concise visual description inferred from the user's photo or provided by the user.",
        ),
      user_interest: z
        .string()
        .optional()
        .describe(
          "What the visitor wants to understand or explore. If omitted, default to a concise museum trail.",
        ),
      known_nearby_artworks: z
        .string()
        .optional()
        .describe(
          "Known nearby artworks, artists, or gallery context. Can be empty.",
        ),
    },
    annotations: {
      title: "Generate ArtTrail",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
    },
    view: {
      component: "art-trail",
      description:
        "A compact museum guide with artwork details, related artwork images, and a suggested mini trail.",
      prefersBorder: true,
      csp: {
        resourceDomains: ["https://upload.wikimedia.org"],
      },
    },
    _meta: {
      "openai/toolInvocation/invoking": "Building your ArtTrail…",
      "openai/toolInvocation/invoked": "ArtTrail ready.",
    },
  },
  async (input) => {
    const museum = clean(input.museum_name) || "the museum";
    const room = clean(input.gallery_or_room);
    const titleKnown = isKnown(input.artwork_title);
    const artistKnown = isKnown(input.artist_name);
    const title = titleKnown ? clean(input.artwork_title) : "an unidentified work";
    const artist = artistKnown ? clean(input.artist_name) : "an unidentified artist";
    const description = clean(input.artwork_description);
    const interest =
      clean(input.user_interest) ||
      clean(input.visitor_request) ||
      "I want a concise museum trail from this artwork without repeatedly taking photos.";
    const nearbyText = clean(input.known_nearby_artworks);
    const nearby = splitNearbyArtworks(nearbyText);
    const movement = inferMovement(description, interest);
    const subject = inferSubject(description, interest);
    const technique = inferTechnique(description, movement);
    const locationPhrase = room
      ? `${room} at ${museum}`
      : `${museum}, using the museum map or nearby wall labels`;
    const identityPhrase =
      titleKnown && artistKnown
        ? `${title} by ${artist}`
        : titleKnown
          ? `${title}, with the artist not confirmed from the input`
          : artistKnown
            ? `a work likely connected to ${artist}, with the title not confirmed from the input`
            : "an artwork whose exact title and artist cannot be confirmed from the available input";

    const relatedArtworksOrTypes =
      nearby.length > 0
        ? nearby.map((item) => `Look for ${item} and compare it with ${identityPhrase}.`)
        : [
            `Look for works by ${artistKnown ? artist : "the same artist, if the wall label identifies one"}.`,
            `Check whether ${museum} has works from ${movement} or from the same period.`,
            "Nearby, search for artworks with similar subjects, poses, color harmonies, materials, or lighting.",
            "Ask the museum map for galleries organized by artist, movement, period, or national school.",
          ];
    const relatedArtworkCards = getRelatedArtworkCards(movement, nearbyText).map(
      (card, index) => ({
        ...card,
        image_url: requiredArtworkImage(card.image_url, index),
        image_required: true,
      }),
    );

    const suggestedMiniTrail = [
      {
        stop: "1. Begin with the photographed work",
        recommended_artwork: titleKnown ? title : "The uploaded artwork",
        recommended_artist: artistKnown ? artist : "Verify from the wall label",
        image_url: requiredArtworkImage(undefined, 0),
        location_guidance: room
          ? `Start exactly where you are now: ${room}. Use the wall label to confirm title, artist, date, and movement.`
          : "Start with the uploaded artwork and photograph/read its wall label if the title, artist, date, or room is unclear.",
        map_search_terms: [
          ...(artistKnown ? [artist] : []),
          ...(titleKnown ? [title] : []),
          movement,
        ],
        what_to_look_for:
          "Study the main subject, the composition, the treatment of light, and the artist's handling of surface or material.",
        why_connected:
          "This is the anchor for the trail: every later stop should clarify one aspect of this first encounter.",
        how_it_changes_understanding:
          "It turns the first artwork from an isolated object into a set of clues: artist, period, theme, technique, and mood.",
      },
      {
        stop: "2. Find the closest match by artist or circle",
        recommended_artwork: relatedArtworkCards[0]?.title ?? "Same-artist comparison",
        recommended_artist: relatedArtworkCards[0]?.artist ?? "Verify from wall label",
        image_url: requiredArtworkImage(relatedArtworkCards[0]?.image_url, 0),
        location_guidance:
          relatedArtworkCards[0]?.likely_location_detail ??
          "Search the museum map for the artist name from the uploaded artwork, then check nearby rooms first.",
        map_search_terms:
          relatedArtworkCards[0]?.map_search_terms ??
          (artistKnown ? [artist, "same artist"] : ["same artist", "wall label"]),
        what_to_look_for: artistKnown
          ? `Look for another work by ${artist}, or by artists shown beside ${artist}.`
          : "Look for a work whose wall label shares an artist, workshop, school, or close date range.",
        why_connected:
          "A second related work helps separate the artist's recurring choices from details unique to this image.",
        how_it_changes_understanding:
          "You begin to see style as a pattern rather than a single impression.",
      },
      {
        stop: "3. Compare a work from the same movement or period",
        recommended_artwork: relatedArtworkCards[1]?.title ?? "Same-period comparison",
        recommended_artist: relatedArtworkCards[1]?.artist ?? "Nearby artist from the same period",
        image_url: requiredArtworkImage(relatedArtworkCards[1]?.image_url, 1),
        location_guidance:
          relatedArtworkCards[1]?.likely_location_detail ??
          "Search for the movement or date range shown on the uploaded artwork's wall label; prefer same-gallery or adjacent-room matches.",
        map_search_terms:
          relatedArtworkCards[1]?.map_search_terms ?? [movement, "same period"],
        what_to_look_for: `Look for ${movement} labels, similar dates, shared subjects, or comparable techniques.`,
        why_connected:
          "The artwork belongs to a wider conversation about taste, society, materials, and ways of seeing.",
        how_it_changes_understanding:
          "The first work becomes part of a historical moment rather than only a personal expression.",
      },
      {
        stop: "4. Follow the subject or theme",
        recommended_artwork: relatedArtworkCards[2]?.title ?? "Theme comparison",
        recommended_artist: relatedArtworkCards[2]?.artist ?? "Nearby artist with a related subject",
        image_url: requiredArtworkImage(relatedArtworkCards[2]?.image_url, 2),
        location_guidance:
          relatedArtworkCards[2]?.likely_location_detail ??
          "Stay in the same room first and look for a related subject, scene, pose, symbol, or mood; then check adjacent rooms.",
        map_search_terms:
          relatedArtworkCards[2]?.map_search_terms ?? [
            "same subject",
            "same theme",
            "adjacent room",
          ],
        what_to_look_for:
          "Find another artwork with a related scene, figure type, landscape, social setting, symbol, or emotional tone.",
        why_connected:
          "Shared subjects reveal how different artists reshape similar material for different effects.",
        how_it_changes_understanding:
          "You notice interpretation: what the artist emphasizes, omits, idealizes, or makes strange.",
      },
      {
        stop: "5. End with contrast",
        recommended_artwork: relatedArtworkCards[3]?.title ?? "Contrast work",
        recommended_artist: relatedArtworkCards[3]?.artist ?? "Nearby contrasting artist",
        image_url: requiredArtworkImage(relatedArtworkCards[3]?.image_url, 3),
        location_guidance:
          relatedArtworkCards[3]?.likely_location_detail ??
          "Choose a nearby work that is visibly different in medium, scale, color, finish, or mood. Use the next adjacent room if the current room is visually uniform.",
        map_search_terms:
          relatedArtworkCards[3]?.map_search_terms ?? [
            "contrast",
            "different medium",
            "adjacent room",
          ],
        what_to_look_for:
          "Choose a work nearby that feels visually different in color, scale, medium, perspective, or mood.",
        why_connected:
          "Contrast makes the first artwork's choices sharper.",
        how_it_changes_understanding:
          "You leave with a clearer sense of what makes the original work distinctive.",
      },
    ];

    const confidenceNote =
      titleKnown && artistKnown
        ? `Use the wall label to verify details, but the provided input identifies this as ${title} by ${artist}.`
        : `The exact artwork cannot be confirmed from the available input. Based on the provided description, this appears to be ${identityPhrase}; verify the title, artist, and date on the wall label.`;
    const trailMapImage = buildTrailMapSvg(museum, room, suggestedMiniTrail);
    const artworkInfo = {
      title: titleKnown ? title : "Unknown title - verify on the wall label",
      artist: artistKnown ? artist : "Unknown artist - verify on the wall label",
      museum_context: locationPhrase,
      likely_period_or_movement: movement,
      subject_or_scene: subject,
      technique_and_surface: technique,
      key_interpretation:
        "Read this work as the anchor for a route through artist, movement, period, subject, visual motifs, and nearby contrasts.",
      what_is_uncertain:
        titleKnown && artistKnown
          ? "Date, medium, current room, and exact nearby works should still be verified on the wall label and museum map."
          : "Exact title, artist, date, medium, and current room should be verified on the wall label and museum map.",
    };

    const structuredContent = {
      conversation_model: {
        app_intent:
          "Turn one photographed or described museum artwork into a complete guided exploration trail.",
        model_instruction:
          "Keep the user in the conversation: show the recommended route, explain why each comparison matters, and ask only for a wall label or map photo if uncertainty blocks the trail.",
        one_call_contract:
          "This tool returns all content needed for the response or a single view in one call: artwork brief, confidence, route choices, comparison images, location guidance, mini trail, and next action.",
      },
      current_artwork_brief:
        `ArtTrail anchor: ${identityPhrase}. ` +
        `The description points toward ${movement}. ` +
        `Focus first on the subject, period clues, movement labels, and the way technique shapes the mood. ` +
        (description
          ? `From the visual description: ${description}`
          : "Add a wall-label detail or a fuller visual description if you want a tighter reading."),
      current_artwork_full_info: artworkInfo,
      confidence_note: confidenceNote,
      quick_read: {
        title: titleKnown ? title : "Unknown title",
        artist: artistKnown ? artist : "Unknown artist",
        likely_context: movement,
        one_sentence:
          description ||
          "Use the wall label and the visible subject, material, light, and composition to anchor the trail.",
        verify_first: [
          "Title",
          "Artist",
          "Date",
          "Movement or gallery label",
        ],
      },
      why_it_matters:
        "This artwork can act as a starting point for the room because it opens several routes at once: maker, movement, period, theme, subject, and visual method. The goal is not only to identify it, but to use it as a guide for what to notice next.",
      visual_observation_guide: [
        "Composition: notice where your eye enters, where it pauses, and how figures or forms are arranged.",
        "Color and light: look for warmth, contrast, shadows, reflected light, and atmosphere.",
        "Surface: compare brushwork, line, texture, finish, material, and visible revisions.",
        "Gesture and pose: ask what bodies, faces, or objects are doing emotionally.",
        "Symbols and setting: check labels and nearby works for recurring objects, places, costumes, or social cues.",
      ],
      guided_options: [
        {
          label: "Artist path",
          description:
            "Follow the same artist, workshop, or close artistic circle first.",
          best_when:
            "The wall label clearly identifies the artist or nearby labels repeat the name.",
        },
        {
          label: "Movement path",
          description:
            `Use ${movement} as the organizing thread and compare technique, light, subject, and modernity.`,
          best_when:
            "The room is organized by movement, period, or school.",
        },
        {
          label: "Theme path",
          description:
            "Track shared subjects such as leisure, city life, landscape, portraiture, ritual, myth, or everyday scenes.",
          best_when:
            "The user wants a story-driven route rather than a strict art history route.",
        },
        {
          label: "Visual motif path",
          description:
            "Follow repeated visual cues: pose, color, brushwork, light, perspective, material, and composition.",
          best_when:
            "The artwork identity is uncertain but the visual description is strong.",
        },
      ],
      display_sections: [
        {
          id: "anchor",
          title: "Start with this artwork",
          purpose:
            "Ground the visitor in what can be cautiously said from the photo and provided context.",
        },
        {
          id: "route_choices",
          title: "Choose a route",
          purpose:
            "Offer a small set of interpretive paths without making the user fill out controls.",
        },
        {
          id: "comparisons",
          title: "Related artworks to compare",
          purpose:
            "Show image-backed comparison cards with map search terms and location guidance.",
        },
        {
          id: "mini_trail",
          title: "Follow the mini trail",
          purpose:
            "Give the visitor 3 to 5 stops that work even when exact room data is unavailable.",
        },
      ],
      art_historical_context:
        `Treat this as a route into ${movement}. Look for how the work reflects its period: what kind of subject was considered worth painting or making, what techniques were valued, and what social or cultural world the artwork assumes.`,
      connection_map: {
        same_artist: artistKnown
          ? `Look for other works by ${artist}, nearby labels mentioning ${artist}, or artists shown as peers.`
          : "First verify the artist on the wall label, then look for another work by the same artist or workshop.",
        same_movement: `Follow labels, gallery headings, or map sections connected to ${movement}.`,
        same_period:
          "Compare date ranges on wall labels to see what other artists were making at the same time.",
        same_theme:
          "Track shared subjects, social settings, myths, landscapes, portraits, rituals, or everyday scenes.",
        similar_composition:
          "Look for repeated arrangements: central figures, cropped viewpoints, diagonals, shallow space, symmetry, or theatrical lighting.",
        historical_context:
          "Use labels to connect the work to patronage, modern life, politics, religion, technology, travel, or changing exhibition culture.",
        geographic_or_cultural_context:
          "Compare works from the same region or cultural setting, then look for nearby contrasts from other places.",
      },
      related_artworks_or_artwork_types: relatedArtworksOrTypes,
      related_artwork_cards: relatedArtworkCards,
      image_display_policy: {
        required:
          "Every final user-facing response must include the Related artwork image cards section. Every related artwork card and every recommended trail stop must display an image_url and image markdown.",
        fallback:
          "If the exact related artwork image is unavailable, use an illustrative public-domain comparison image and say it is a comparison aid.",
      },
      trail_map: {
        title: "Suggested museum trail map",
        image_url: trailMapImage,
        note:
          "This is a schematic route, not real indoor navigation. Verify exact positions with the current museum map and wall labels.",
      },
      location_detail_plan: {
        starting_point: room
          ? `Begin from ${room} at ${museum}. Treat this as approximate unless confirmed by a current museum map.`
          : `Begin from the artwork's current wall label at ${museum}. If the room is unknown, use the museum map first.`,
        how_to_find_related_works: [
          "Use the museum map search with artist names first, then movement terms, then artwork titles.",
          "Prefer works in the same gallery or adjacent rooms before crossing the museum.",
          "If a named comparison work is not nearby, substitute a work by the same artist, movement, subject, or period.",
          "Do not rely on exact room numbers unless the museum's current map or wall labels provide them.",
        ],
        map_keywords: Array.from(
          new Set(relatedArtworkCards.flatMap((card) => card.map_search_terms)),
        ),
      },
      suggested_mini_trail: suggestedMiniTrail,
      room_or_location_guidance: room
        ? `Start in ${room} at ${museum}. Do not assume exact room numbers beyond what the museum provides; use wall labels, gallery headings, and the museum map to locate related works.`
        : `Use the museum map or wall labels to locate these related works at ${museum}. Exact room locations are not available from the provided input.`,
      how_to_explore_without_repeated_photos: [
        "Read only the labels that share artist, movement, period, subject, or technique with the first work.",
        "Follow gallery headings and date ranges before taking another photo.",
        "Use this mini trail as the main guide, then pause longer in front of fewer works.",
        "Take one more photo only when a wall label, map, or related artwork would clarify an uncertain connection.",
      ],
      questions_to_ask_while_viewing: [
        "What did I notice first, and how did the artist make that happen?",
        "Which detail changes the mood of the whole work?",
        "What does this work share with its neighbors, and what does it resist?",
        "How would the meaning change if the light, scale, pose, or viewpoint were different?",
        "What should I look for in the next room to test this connection?",
      ],
      next_best_photo_if_needed:
        "If the connection remains unclear, photograph the wall label first. If the label is already clear, photograph the room map, another work by the same artist, or a nearby work from the same movement or period.",
    };

    const routeChoicesText = structuredContent.guided_options
      .map(
        (option) =>
          `- ${option.label}: ${option.description} Best when: ${option.best_when}`,
      )
      .join("\n");

    const artworkInfoText = [
      `- Title: ${artworkInfo.title}`,
      `- Artist: ${artworkInfo.artist}`,
      `- Museum context: ${artworkInfo.museum_context}`,
      `- Likely period / movement: ${artworkInfo.likely_period_or_movement}`,
      `- Subject / scene: ${artworkInfo.subject_or_scene}`,
      `- Technique: ${artworkInfo.technique_and_surface}`,
      `- Key interpretation: ${artworkInfo.key_interpretation}`,
      `- Verify: ${artworkInfo.what_is_uncertain}`,
    ].join("\n");

    const relatedCardsText = relatedArtworkCards
      .map((card, index) => {
        return [
          `### ${index + 1}. ${card.title}`,
          `![${card.title}](${card.image_url})`,
          `Image URL: ${card.image_url}`,
          `Artist / period: ${card.artist} · ${card.date_or_period}`,
          `Why it connects: ${card.why_compare}`,
          `What to compare: ${card.what_to_notice}`,
          `Approximate location: ${card.likely_location_detail}`,
          `Map search terms: ${card.map_search_terms.join(", ")}`,
          `Viewing question: ${card.viewing_prompt}`,
        ].join("\n\n");
      })
      .join("\n\n");

    const miniTrailText = suggestedMiniTrail
      .map((stop) => {
        return [
          `### ${stop.stop}`,
          `Recommended stop: ${stop.recommended_artwork}`,
          `Artist / source: ${stop.recommended_artist}`,
          `Image required: ${stop.image_url}`,
          `![${stop.recommended_artwork}](${stop.image_url})`,
          `Approximate location: ${stop.location_guidance}`,
          `Map search terms: ${stop.map_search_terms.join(", ")}`,
          `What to look for: ${stop.what_to_look_for}`,
          `Why connected: ${stop.why_connected}`,
          `How it changes the first artwork: ${stop.how_it_changes_understanding}`,
        ].join("\n\n");
      })
      .join("\n");

    return {
      structuredContent,
      content: [
        {
          type: "text",
          text:
            `ArtTrail ready for ${identityPhrase} at ${locationPhrase}.\n\n` +
            `Important for ChatGPT: preserve the artwork information, related artwork image cards, and mini-trail location guidance below. Do not replace this with a shorter text-only summary.\n\n` +
            `## Current artwork - museum label view\n\n` +
            `${artworkInfoText}\n\n` +
            `Confidence: ${structuredContent.confidence_note}\n\n` +
            `## Quick read for the gallery\n\n` +
            `${structuredContent.quick_read.one_sentence}\n\n` +
            `Look first at: composition, light, color, surface, pose or gesture, and the wall-label date/movement.\n\n` +
            `## Related artwork image cards\n\n` +
            `${relatedCardsText}\n\n` +
            `## Choose a route\n\n` +
            `${routeChoicesText}\n\n` +
            `## Visual trail map\n\n` +
            `![Suggested museum trail map](${trailMapImage})\n\n` +
            `This is a schematic guide, not real indoor navigation. Use the current museum map and wall labels for exact positions.\n\n` +
            `## Location strategy\n\n` +
            `${structuredContent.location_detail_plan.starting_point}\n\n` +
            `${structuredContent.location_detail_plan.how_to_find_related_works
              .map((item) => `- ${item}`)
              .join("\n")}\n\n` +
            `Map keywords: ${structuredContent.location_detail_plan.map_keywords.join(", ")}\n\n` +
            `## Mini trail\n\n` +
            `${miniTrailText}\n\n` +
            `Next photo only if needed: ${structuredContent.next_best_photo_if_needed}`,
        },
      ],
      isError: false,
    };
  },
);

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;
