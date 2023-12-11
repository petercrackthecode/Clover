"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import classNames from "classnames";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ImageViewerProps = {
  imageId: string;
  url: string;
  prompt: string;
  negativePrompt: string;
  liked: boolean;
  toggleImageLike: (imageId: string) => void;
  customClasses?: string;
};

export function ImageViewer({
  imageId,
  url,
  prompt,
  negativePrompt,
  liked,
  toggleImageLike,
  customClasses,
}: ImageViewerProps): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={classNames(
            "relative text-center overflow-y-hidden cursor-pointer object-contain",
            customClasses
          )}
        >
          <div className="absolute inset-0 p-2 flex flex-row justify-end items-star opacity-0 hover:opacity-100">
            <div
              className="flex flex-row justify-center items-center p-2 bg-black bg-opacity-40 hover:bg-opacity-100 h-10 w-10 sm:h-8 sm:w-8 rounded-lg"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                console.log("liked");
                toggleImageLike(imageId);
              }}
              // style={{ border: "3px solid red" }}
            >
              <FaHeart color={liked ? "red" : "white"} />
            </div>
          </div>
          <img src={url} alt={prompt} className="h-full object-fill" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-screen max-h-[90%] overflow-y-auto grid grid-cols-1 md:grid-cols-2 bg-zinc-700 text-white">
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col justify-evenly items-start rounded-lg bg-zinc-600 gap-3 px-5 py-2">
            <p className="break-all">{prompt}</p>
            <Button>Copy Prompt</Button>
          </div>
          <div className="flex flex-col px-5 justify-center items-start gap-1">
            <label className="text-gray-400">Model</label>
            <p>Stable Diffusion v1</p>
          </div>
          <div className="flex flex-col px-5 justify-center items-start gap-1">
            <label className="text-gray-400">Dimensions</label>
            <p>512 x 512</p>
          </div>
          <div className="flex flex-col px-5 justify-center items-start gap-1">
            <label className="text-gray-400">Negative prompt</label>
            <p>{negativePrompt}</p>
          </div>
        </div>
        <div>
          <img src={url} alt={prompt} className="h-full object-fill" />
        </div>
      </DialogContent>
    </Dialog>
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
