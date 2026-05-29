import "@/index.css";

import { useToolInfo } from "@/helpers.js";

type ArtworkInfo = {
  title?: string;
  artist?: string;
  museum_context?: string;
  likely_period_or_movement?: string;
  subject_or_scene?: string;
  technique_and_surface?: string;
  key_interpretation?: string;
  what_is_uncertain?: string;
};

type RelatedArtworkCard = {
  title?: string;
  artist?: string;
  date_or_period?: string;
  image_url?: string;
  why_compare?: string;
  what_to_notice?: string;
  likely_location_detail?: string;
  map_search_terms?: string[];
};

type TrailStop = {
  stop?: string;
  recommended_artwork?: string;
  recommended_artist?: string;
  image_url?: string;
  location_guidance?: string;
  map_search_terms?: string[];
  what_to_look_for?: string;
  why_connected?: string;
};

type ArtTrailOutput = {
  current_artwork_full_info?: ArtworkInfo;
  confidence_note?: string;
  related_artwork_cards?: RelatedArtworkCard[];
  suggested_mini_trail?: TrailStop[];
  room_or_location_guidance?: string;
  next_best_photo_if_needed?: string;
};

function TextLine({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-zinc-200 py-2 text-sm last:border-b-0 dark:border-zinc-800">
      <dt className="font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-zinc-950 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function KeywordList({ terms }: { terms?: string[] }) {
  if (!terms?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {terms.map((term) => (
        <span
          key={term}
          className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          {term}
        </span>
      ))}
    </div>
  );
}

export default function ArtTrail() {
  const { output } = useToolInfo<"generate_art_trail">();
  const data = output as ArtTrailOutput | undefined;
  const artwork = data?.current_artwork_full_info;
  const related = data?.related_artwork_cards ?? [];
  const trail = data?.suggested_mini_trail ?? [];

  return (
    <main className="mx-auto max-h-[720px] w-full max-w-4xl overflow-y-auto bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            ArtWise museum trail
          </p>
          <h1 className="text-xl font-semibold leading-tight sm:text-2xl">
            {artwork?.title ?? "Artwork trail"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {artwork?.artist ?? "Artist to verify"} ·{" "}
            {artwork?.likely_period_or_movement ?? "Context to verify"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-base font-semibold">Current artwork</h2>
          <dl>
            <TextLine label="Title" value={artwork?.title} />
            <TextLine label="Artist" value={artwork?.artist} />
            <TextLine label="Museum" value={artwork?.museum_context} />
            <TextLine label="Movement" value={artwork?.likely_period_or_movement} />
            <TextLine label="Subject" value={artwork?.subject_or_scene} />
            <TextLine label="Technique" value={artwork?.technique_and_surface} />
          </dl>
          {artwork?.key_interpretation ? (
            <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {artwork.key_interpretation}
            </p>
          ) : null}
          {data?.confidence_note ? (
            <p className="mt-3 border-t border-zinc-200 pt-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {data.confidence_note}
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-base font-semibold">Suggested trail map</h2>
          <div className="grid gap-2">
            {trail.slice(0, 5).map((stop, index) => (
              <div
                key={`${stop.stop}-${index}`}
                className="grid grid-cols-[2rem_1fr] gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {stop.recommended_artwork ?? stop.stop}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {stop.location_guidance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Related artwork images</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Use these as visual comparison stops. Verify exact locations on
              the museum map.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((card) => (
            <article
              key={`${card.artist}-${card.title}`}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.title ?? "Related artwork"}
                  className="aspect-[4/3] w-full bg-zinc-100 object-cover dark:bg-zinc-800"
                />
              ) : null}
              <div className="space-y-3 p-3">
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {card.artist} · {card.date_or_period}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {card.why_compare}
                </p>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {card.likely_location_detail}
                </p>
                <KeywordList terms={card.map_search_terms} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <h2 className="mb-3 text-base font-semibold">Mini trail details</h2>
        <div className="grid gap-3">
          {trail.slice(0, 5).map((stop, index) => (
            <article
              key={`${stop.recommended_artwork}-${index}`}
              className="grid gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 sm:grid-cols-[7rem_1fr]"
            >
              {stop.image_url ? (
                <img
                  src={stop.image_url}
                  alt={stop.recommended_artwork ?? "Trail stop"}
                  className="aspect-[4/3] w-full rounded-md bg-zinc-100 object-cover dark:bg-zinc-800"
                />
              ) : null}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {index + 1}. {stop.recommended_artwork}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {stop.recommended_artist}
                </p>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {stop.what_to_look_for}
                </p>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {stop.why_connected}
                </p>
                <KeywordList terms={stop.map_search_terms} />
              </div>
            </article>
          ))}
        </div>
        {data?.next_best_photo_if_needed ? (
          <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Next photo if needed: {data.next_best_photo_if_needed}
          </p>
        ) : null}
      </section>
    </main>
  );
}
