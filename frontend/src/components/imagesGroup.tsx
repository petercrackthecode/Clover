"use client";
import { PromptStack, Prompts, Prompt, Likes } from "@/models";
import React, { useCallback } from "react";
import { ImageViewer, ImagePlaceholder, ImageViewerProps } from "./imageViewer";

export default function ImagesGroup({
  promptStack,
  prevPrompts,
  likedImageIds,
  toggleImageLike,
}: {
  promptStack: PromptStack;
  prevPrompts: Prompts;
  likedImageIds: Likes;
  toggleImageLike: (imageId: string) => void;
}) {
  const getImageById = useCallback(
    (imageId: string): ImageViewerProps => {
      const images = JSON.parse(localStorage.getItem("images") || "{}");
      const image = images[imageId];

      return {
        prompt: image.prompt,
        negativePrompt: image.negativePrompt,
        url: image.url,
        imageId,
        liked: likedImageIds.has(imageId),
        toggleImageLike,
      };
    },
    [likedImageIds, toggleImageLike]
  );

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
          <div className="w-full flex flex-row justify-center">
            <p className="block w-fit text-left break-all">{prompt}</p>
          </div>
        </div>
      );

    return (
      <div className="flex flex-col w-full gap-4" key={pId}>
        <div className="w-full relative grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-4">
          {imageIds.map((imageId: string) => (
            // convert the imageId into real image Url through localStorage.getItem('images')
            <ImageViewer
              key={imageId}
              {...getImageById(imageId)}
              customClasses="lg:h-72 md:h-52 sm:h-64 max-h-full m-auto"
            />
          ))}
        </div>
        <div className="w-full flex flex-row justify-center">
          <p className="block w-fit text-left break-all">{prompt}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-10">
      {promptStack
        .toReversed()
        .map((promptId) => promptToImages(promptId, prevPrompts[promptId]))}
    </div>
  );
}
