"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { MouseEvent, useEffect, useState, ComponentProps } from "react";
import React from "react";
import ImageViewer from "@/components/imageViewer";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

type Image = {
  id: string;
  url: string;
  prompt: string;
};

export default function Generate() {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [image, setImage] = useState<Image>({} as Image);

  useEffect(() => {
    console.log("setting image");
    if (typeof window !== "undefined" && window.localStorage && image.url) {
      console.log("within the if statement");
      const currentImages = window.localStorage.getItem("images");
      const imagesJSON = JSON.parse(currentImages ? currentImages : "[]");
      const newImages = imagesJSON.concat(image);
      console.log("newImages", newImages);
      window.localStorage.setItem("images", JSON.stringify(newImages));
    }
  }, [image]);

  const handleGenerateImage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;

    const data = JSON.stringify({
      input: {
        prompt,
        num_inference_steps: 25,
        refiner_inference_steps: 50,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        strength: 0.4,
        seed: null,
        num_images: 1,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.runpod.ai/v2/sdxl/runsync",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "MA50JX0SJNG8GNAQQ7K79VHGY8TI2KP3URLYQXX7",
      },
      data,
    };
    setIsGenerating(true);
    await axios(config)
      .then((res) => {
        console.log(res.data);
        setImage({
          id: res.data.id,
          url: res.data.output.images[0],
          prompt: prompt.trim(),
        });
      })
      .catch((error) => console.log(error));
    setIsGenerating(false);
  };

  return (
    <main className="w-full min-h-screen text-white bg-zinc-800 flex flex-col items-center px-96">
      <div className="flex flex-col gap-y-9 p-2 mt-24 w-full">
        <div className="flex flex-col">
          <label htmlFor="prompt">Describe your image</label>
          <Textarea
            id="prompt"
            name="prompt"
            placeholder="A cute mouse pilot wearing aviator goggles, unreal engine render, 8k"
            className="block mt-2 mb-4 bg-zinc-600 w-full resize-none border-0 focus:ring-0 outline-none placeholder:text-gray-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="w-full text-right">
            <Button
              className="rounded-full px-10 w-[150px] bg-indigo-700 hover:bg-indigo-600 border-[0.5px] border-slate-600"
              onClick={handleGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <p>Number of images</p>
          <div className="flex flex-row gap-x-4">
            <p>0</p>
            <SliderWrapper />
            <p>4</p>
          </div>
        </div>
        {image.url && <ImageViewer {...image} width={1024} height={1024} />}
      </div>
    </main>
  );
}

type SliderProps = ComponentProps<typeof Slider>;

export function SliderWrapper({ className, ...props }: SliderProps) {
  const [value, setValue] = useState<number>(1);
  return (
    <Slider
      defaultValue={[1]}
      max={4}
      step={1}
      className={cn("w-[100%]", className)}
      {...props}
    />
  );
}
