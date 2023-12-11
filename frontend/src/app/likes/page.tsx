"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Likes, Image, Images } from "@/models";
import lodash from "lodash";
import { ImagesGalleries } from "../page";

export default function Likes() {
  const [likedImageIds, setLikedImageIds] = useState<Likes>(
    typeof window !== "undefined" && localStorage.getItem("likes")
      ? new Set(JSON.parse(localStorage.getItem("likes")!))
      : new Set()
  );

  useEffect(() => {
    getLikesImageIds();
  }, []);

  function getLikesImageIds() {
    const likesStr = window.localStorage.getItem("likes");
    const likesObj = new Set(JSON.parse(likesStr ? likesStr : "[]")) as Likes;
    setLikedImageIds(likesObj);
  }

  function toggleImageLike(imageId: string) {
    setLikedImageIds((likedImageIds) => {
      const newLikedImageIds = new Set(likedImageIds);
      if (likedImageIds.has(imageId)) {
        newLikedImageIds.delete(imageId);
      } else {
        newLikedImageIds.add(imageId);
      }
      return newLikedImageIds;
    });
  }

  const uniqueLikedImgs = useMemo(() => {
    const currentImages = window.localStorage.getItem("images");
    const imagesObj = lodash.cloneDeep(
      JSON.parse(currentImages ? currentImages : "{}")
    ) as Images;
    const uniqueLikedImagesUrl = new Set<string>();
    const uniqueLikedImagesObj = {} as Images;
    Object.entries(imagesObj).forEach(([key, image]) => {
      if (likedImageIds.has(key) && !uniqueLikedImagesUrl.has(image.url)) {
        uniqueLikedImagesUrl.add(image.url);
        uniqueLikedImagesObj[key] = image;
      }
    });

    return uniqueLikedImagesObj;
  }, [likedImageIds]);

  return (
    <main className="w-full overflow-x-hidden min-h-screen text-white bg-zinc-800 flex flex-col items-center">
      <section className="w-11/12 md:w-[500px] flex flex-col gap-y-9 p-2 mt-24">
        <h1 className="text-7xl font-semibold text-center">Likes</h1>
      </section>
      {Object.keys(uniqueLikedImgs).length > 0 && (
        <section className="flex gap-y-9 m-5 mt-24 w-full px-5">
          <ImagesGalleries
            images={uniqueLikedImgs}
            col={6}
            filterImages={(image: Image) => true}
            likedImageIds={likedImageIds}
            toggleImageLike={toggleImageLike}
          />
        </section>
      )}
    </main>
  );
}
