/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Image as ImageIcon } from "lucide-react";
// import Image from "@/models";

export type ImageViewerProps = {
  url: string;
  prompt: string;
  negativePrompt: string;
};

export function ImageViewer({
  url,
  prompt,
  negativePrompt,
}: ImageViewerProps): React.JSX.Element {
  return (
    <div className="text-center cursor-pointer">
      <img src={url} alt={prompt} className="rounded-lg" />
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
