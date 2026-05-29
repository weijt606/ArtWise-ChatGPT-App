import { Button } from "@alpic-ai/ui/components/button";
import { Map } from "lucide-react";
import { useEffect, useState } from "react";
import { useCallTool } from "@/helpers.js";
import Doc from "@/views/components/doc.js";
import DocLink from "@/views/components/doc-link.js";

export default function ToolCall() {
  // useCallTool: invoke a server tool from within the view.
  const { callTool, isPending, data } = useCallTool("generate_art_trail");
  const [brief, setBrief] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setBrief(
        (
          data.structuredContent as
            | { current_artwork_brief?: string }
            | undefined
        )?.current_artwork_brief ?? null,
      );
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-3">
        <p className="">
          <strong>Tools</strong> can also be triggered from the view:
        </p>
        <div className="flex">
          <Button
            variant="cta"
            loading={isPending}
            icon={<Map />}
            onClick={() =>
              callTool({
                museum_name: "Musée d'Orsay",
                gallery_or_room: "Impressionist gallery",
                artwork_title: "Unknown",
                artist_name: "Renoir",
                artwork_description:
                  "A lively Impressionist painting showing people gathered outdoors, with soft light, warm colors, loose brushwork, and a social leisure scene.",
                user_interest:
                  "I want to understand Impressionism through related works without taking photos of every painting.",
                known_nearby_artworks:
                  "Works by Monet, Degas, Manet, Pissarro, Sisley, and other Impressionist painters in the same museum.",
              })
            }
          >
            <code>generate_art_trail</code>
          </Button>
        </div>
        <p
          className={`font-mozilla italic text-primary mt-2 ${
            brief ? "" : "invisible"
          }`}
          aria-hidden={!brief}
        >
          {brief || "none"}
        </p>
      </div>
      <Doc>
        Use{" "}
        <DocLink href="https://docs.skybridge.tech/api-reference/use-call-tool">
          useCallTool
        </DocLink>{" "}
        to request tools from within the view.
      </Doc>
    </>
  );
}
