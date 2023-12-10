/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import classNames from "classnames";
// import Image from "@/models";

export type ImageViewerProps = {
  url: string;
  prompt: string;
  negativePrompt: string;
  customClasses?: string;
};

export function ImageViewer({
  url,
  prompt,
  negativePrompt,
  customClasses,
}: ImageViewerProps): React.JSX.Element {
  return (
    <div
      className={classNames(
        "text-center overflow-y-hidden cursor-pointer object-contain",
        customClasses
      )}
    >
      <img src={url} alt={prompt} className="h-full object-fill" />
    </div>
  );
}

export function ImagePlaceholder() {
  return (
    <div
      className="max-h-full flex justify-center items-center"
      // style={{ border: "3px solid orange" }}
    >
      <ImageIcon
        className="p-0 w-3/4 h-auto md:w-2/3 sm:w-1/2"
        // style={{ border: "3px solid pink" }}
      />
    </div>
  );
}
