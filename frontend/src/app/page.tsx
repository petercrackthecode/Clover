"use client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { ImageViewer } from "@/components/imageViewer";
import { useMemo, useEffect, useState } from "react";
import GridPicker from "@/components/gridPicker";
import { Image, Images, Likes } from "@/models";

export default function Home() {
  const [gridCol, setGridCol] = useState<number>(
    typeof window !== "undefined" && localStorage.getItem("gridCol")
      ? parseInt(localStorage.getItem("gridCol")!)
      : 6
  );
  const [query, setQuery] = useState<string>("");
  const [likedImageIds, setLikedImageIds] = useState<Likes>(
    typeof window !== "undefined" && localStorage.getItem("likes")
      ? new Set(JSON.parse(localStorage.getItem("likes")!))
      : new Set()
  );

  function getGridCol() {
    const gridColStr = window.localStorage.getItem("gridCol");
    const gridColVal = gridColStr ? parseInt(gridColStr) : 6;
    setGridCol(gridColVal);
  }

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

  useEffect(() => {
    getGridCol();
    getLikesImageIds();
  }, []);

  useEffect(
    function saveGridColToDB() {
      window.localStorage.setItem("gridCol", gridCol.toString());
    },
    [gridCol]
  );

  useEffect(
    function saveLikesToDB() {
      window.localStorage.setItem(
        "likes",
        JSON.stringify(Array.from(likedImageIds))
      );
    },
    [likedImageIds]
  );

  const images = useMemo((): Images => {
    const currentImages = window.localStorage.getItem("images");
    const imagesObj = JSON.parse(
      currentImages ? currentImages : "{}"
    ) as Images;
    const uniqueImagesUrl = new Set<string>();
    const uniqueImagesObj = {} as Images;
    Object.entries(imagesObj).forEach(([key, image]) => {
      if (!uniqueImagesUrl.has(image.url)) {
        uniqueImagesUrl.add(image.url);
        uniqueImagesObj[key] = image;
      }
    });
    return uniqueImagesObj;
  }, []);
  return (
    <main className="w-full overflow-x-hidden min-h-screen text-white bg-zinc-800 flex flex-col items-center">
      <section className="w-11/12 md:w-[500px] flex flex-col gap-y-9 p-2 mt-24">
        <h1 className="text-7xl font-semibold text-center">Clover</h1>
        <div className="flex flex-col gap-y-4">
          <div className="p-2 bg-zinc-600 flex flex-row rounded-full">
            <Search className="mr-2 h-5 w-5 flex-none" />
            <input
              className="bg-inherit border-0 outline-none grow"
              placeholder="Search for an image"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-center gap-x-2">
            <Button className="bg-indigo-700 hover:bg-indigo-600 rounded-full px-10 w-[150px]">
              Search
            </Button>
            <Link href="/generate" passHref>
              <Button className="rounded-full px-10 w-[150px] bg-transparent border-[0.5px] border-slate-600">
                Generate
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="flex flex-row justify-center w-full gap-x-2 mt-24">
        <GridPicker
          value={gridCol}
          onValueChange={(value: number[]) => setGridCol(value[0])}
        />
      </section>
      {Object.keys(images).length > 0 && (
        <section className="flex gap-y-9 m-5 mt-24 w-full px-5">
          <ImagesGalleries
            images={images}
            col={gridCol}
            likedImageIds={likedImageIds}
            filterImages={(image: Image) => {
              return (
                image.prompt.includes(query) ||
                image.negativePrompt.includes(query)
              );
            }}
            toggleImageLike={toggleImageLike}
          />
        </section>
      )}
    </main>
  );
}

interface ImagesGalleriesProps {
  images: Images;
  filterImages: (image: Image) => boolean;
  toggleImageLike: (imageId: string) => void;
  col: number;
  likedImageIds: Likes;
}

export function ImagesGalleries({
  images,
  col,
  likedImageIds,
  filterImages,
  toggleImageLike,
}: ImagesGalleriesProps): React.JSX.Element {
  const filteredImages = useMemo(() => {
    let _filteredImages = {} as Images;
    Object.entries(images).map(([key, image]) => {
      if (filterImages(image)) {
        _filteredImages[key] = image;
      }
    });

    return _filteredImages;
  }, [images, filterImages]);

  return (
    <div
      className="grid w-full gap-1"
      style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}
    >
      {Object.entries(filteredImages).map(
        ([key, { prompt, negativePrompt, url }]) => (
          <ImageViewer
            key={key}
            {...{
              prompt,
              negativePrompt,
              url,
              toggleImageLike,
              imageId: key,
              liked: likedImageIds.has(key),
            }}
          />
        )
      )}
    </div>
  );
}
