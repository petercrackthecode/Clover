"use client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { ImageViewer } from "@/components/imageViewer";
import { useMemo, useEffect } from "react";
import axios from "axios";
import { Images, Image } from "@/models";

export default function Home() {
  useEffect(() => {
    async function testServer() {
      const res = await axios.get("http://localhost:5000");
      console.log(res.data);
    }
    testServer();
  }, []);

  const images = useMemo((): Images => {
    if (typeof window !== "undefined" && window.localStorage) {
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
      console.log("uniqueImagesObj", uniqueImagesObj);
      return uniqueImagesObj;
    }
    return {} as Images;
  }, []);
  return (
    <main className="w-full min-h-screen text-white bg-zinc-800 flex flex-col items-center">
      <div className="w-[500px] flex flex-col gap-y-9 p-2 mt-24">
        <h1 className="text-7xl font-semibold text-center">Clover</h1>
        <div className="flex flex-col gap-y-4">
          <div className="p-2 bg-zinc-600 flex flex-row rounded-full">
            <Search className="mr-2 h-5 w-5 flex-none" />
            <input
              className="bg-inherit border-0 outline-none grow"
              placeholder="Search for an image"
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
      </div>
      {Object.keys(images).length > 0 && (
        <div className="flex gap-y-9 m-5 mt-24 w-full px-5">
          <ImagesGalleries images={images} filterImages={() => {}} />
        </div>
      )}
    </main>
  );
}

interface ImagesGalleriesProps {
  images: Images;
  filterImages: () => void;
}

function ImagesGalleries({
  images,
  filterImages,
}: ImagesGalleriesProps): React.JSX.Element {
  return (
    <div className="flex-row justify-center flex flex-wrap gap-5">
      {Object.entries(images).map(([key, { prompt, negativePrompt, url }]) => (
        <ImageViewer key={key} {...{ prompt, negativePrompt, url }} />
      ))}
    </div>
  );
}
