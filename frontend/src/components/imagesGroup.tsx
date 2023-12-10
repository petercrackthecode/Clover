import { PromptStack, Prompts, Prompt, Images } from "@/models";
import React, { useCallback } from "react";
import { ImageViewer, ImagePlaceholder, ImageViewerProps } from "./imageViewer";

export default function ImagesGroup({
  promptStack,
  prevPrompts,
}: {
  promptStack: PromptStack;
  prevPrompts: Prompts;
}) {
  const getImageById = useCallback((imageId: string): ImageViewerProps => {
    const images = JSON.parse(localStorage.getItem("images") || "{}");
    const image = images[imageId];

    return {
      prompt: image.prompt,
      negativePrompt: image.negativePrompt,
      url: image.url,
    };
  }, []);

  const promptToImages = (pId: string, _prompt: Prompt) => {
    const { prompt, imageIds } = _prompt;
    if (!imageIds || imageIds.length == 0)
      return (
        <div
          className="flex flex-col gap-4"
          key={pId}
          // style={{ border: "3px solid yellow" }}
        >
          <div
            className="w-full grid lg:h-60 md:h-52 sm:h-96 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-2 gap-4"
            // style={{ border: "3px solid red" }}
          >
            {[0, 1, 2, 3].map((_: Number, idx: any) => (
              <ImagePlaceholder key={idx} />
            ))}
          </div>
          <p className="w-full text-center">{prompt}</p>
        </div>
      );

    return (
      <div className="flex flex-col w-full" key={pId}>
        <div
          className="w-full grid lg:h-60 md:h-52 sm:h-96 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-2 gap-4"
          // style={{ border: "3px solid red" }}
        >
          {imageIds.map((imageId: string) => (
            // convert the imageId into real image Url through localStorage.getItem('images')
            <ImageViewer key={imageId} {...getImageById(imageId)} />
          ))}
        </div>
        <p className="w-full text-center">{prompt}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {promptStack
        .toReversed()
        .map((promptId) => promptToImages(promptId, prevPrompts[promptId]))}
    </div>
  );
}
