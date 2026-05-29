import { useToolInfo } from "@/helpers.js";
import Doc from "@/views/components/doc.js";
import DocLink from "@/views/components/doc-link.js";

export default function ToolOutput() {
  // useToolInfo: read the input, output and metadata of the tool that opened this view.
  const { output } = useToolInfo<"generate_art_trail">();
  const brief = (output as { current_artwork_brief?: string } | undefined)
    ?.current_artwork_brief;

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-3">
        <h1 className="type-display-xs font-mozilla font-semibold">
          <span className="text-primary">ArtTrail</span>
        </h1>
        <p>
          {brief ??
            "Generate a concise museum trail from one photographed or described artwork."}
        </p>
      </div>
      <Doc>
        Use{" "}
        <DocLink href="https://docs.skybridge.tech/api-reference/use-tool-info">
          useToolInfo
        </DocLink>{" "}
        to hydrate the view with tool input, output and metadata.
      </Doc>
    </>
  );
}
