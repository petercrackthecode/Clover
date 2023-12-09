import { PromptStack, Prompts, Prompt, Images } from "@/models";
import React from "react";
import { ImageViewer, ImagePlaceholder } from "./imageViewer";

export default function ImagesGroup({
  promptStack,
  prevPrompts,
  images,
}: {
  promptStack: PromptStack;
  prevPrompts: Prompts;
  images: Images;
}) {
  const promptToImages = (pId: string, _prompt: Prompt, _images: Images) => {
    const { prompt, imageIds } = _prompt;
    if (!imageIds || imageIds.length == 0)
      return (
        <div
          className="flex flex-col gap-4"
          key={pId}
          // style={{ border: "3px solid yellow" }}
        >
          <div
            className="w-full grid lg:h-60 md:h-52 sm:h-96 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-4"
            // style={{ border: "3px solid red" }}
          >
            {[0, 1, 2, 3].map((_, idx) => (
              <ImagePlaceholder key={idx} />
            ))}
          </div>
          <p className="w-full text-center">{prompt}</p>
        </div>
      );

    const imgs = imageIds.map((id) => _images[id]);

    return (
      <div className="flex flex-col" key={pId}>
        {imgs.map(({ url, prompt, negativePrompt, isLoading, promptId }) => (
          <ImageViewer
            key={url}
            {...{ url, prompt, negativePrompt }}
            width={520}
            height={520}
          />
        ))}
        <p>{prompt}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {promptStack.map((promptId) =>
        promptToImages(promptId, prevPrompts[promptId], images)
      )}
    </div>
  );
}
