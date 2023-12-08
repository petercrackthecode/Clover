"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  MouseEvent,
  useEffect,
  useState,
  useContext,
  ComponentProps,
  useRef,
} from "react";
import React from "react";
import ImageViewer from "@/components/imageViewer";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "@/lib/constants";
// import { SocketContext } from "@/context/socketRef";
// import { Socket } from "socketRef.io-client";

type Image = {
  id: string;
  url: string;
  prompt: string;
  isLoading: boolean;
};

let socket: Socket;
export default function Generate() {
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [image, setImage] = useState<Image>({} as Image);
  const initSocket = async () => {
    if (!socket) socket = io(BACKEND_URL);

    socket.on("connect", () => {
      console.log("connected. Socket id = ", socket.id);
    });

    socket.on("hi", (message) => {
      console.log("message = ", message);
    });

    socket.on("taskFinished", (data) => {
      console.log("data = ", data);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      initSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, []);
  // useEffect(() => {
  //   console.log("setting image");
  //   if (typeof window !== "undefined" && window.localStorage && image.url) {
  //     console.log("within the if statement");
  //     const currentImages = window.localStorage.getItem("images");
  //     const imagesJSON = JSON.parse(currentImages ? currentImages : "[]");
  //     const newImages = imagesJSON.concat(image);
  //     console.log("newImages", newImages);
  //     window.localStorage.setItem("images", JSON.stringify(newImages));
  //   }
  // }, [image]);

  const handleGenerateImage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;

    const data = JSON.stringify({
      prompt,
      negative_prompt: negativePrompt,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/generate",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data,
    };
    setIsGenerating(true);
    await axios(config)
      .then((res) => {
        console.log(res.data);
        setImage({
          id: res.data.id,
          prompt: prompt.trim(),
          isLoading: true,
          url: "",
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
