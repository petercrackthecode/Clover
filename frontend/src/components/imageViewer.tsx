/* eslint-disable @next/next/no-img-element */
import React from "react";

type ImageViewerProps = {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
};

export default function ImageViewer({
  url,
  prompt,
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
