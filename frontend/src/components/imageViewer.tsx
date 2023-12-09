/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Image as ImageIcon } from "lucide-react";
// import Image from "@/models";

type ImageViewerProps = {
  url: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
};

export function ImageViewer({
  url,
  prompt,
  negativePrompt,
  width,
  height,
}: ImageViewerProps): React.JSX.Element {
  return (
    <div className="text-center">
      <img
        src={url}
        alt={prompt}
        width={width}
        height={height}
        className="rounded-lg"
      />
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
