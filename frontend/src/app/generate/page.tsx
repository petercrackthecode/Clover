"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { MouseEvent, useEffect, useState, ComponentProps } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "@/lib/constants";
import { Images, Image, Prompts, Prompt } from "@/models";
import ImagesGroup from "@/components/imagesGroup";

let socket: Socket;
export default function Generate() {
  const [prompt, setPrompt] = useState<string>("");
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [prevPrompts, setPrevPrompts] = useState<Prompts>({} as Prompts);
  const [images, setImages] = useState<Images>({} as Images);

  const initSocket = async () => {
    if (!socket) socket = io(BACKEND_URL);
    console.log("socket = ", socket);
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
    console.log("hi");
    if (typeof window !== undefined) {
      console.log("initializing socket");
      initSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, []);

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
    setIsSendingRequest(true);
    await axios(config)
      .then((res) => {
        console.log(res.data);
        // setPrevPrompts
      })
      .catch((error) => console.log(error));
    setIsSendingRequest(false);
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
            className="block mt-2 mb-2 bg-zinc-600 w-full resize-none border-0 focus:ring-0 outline-none placeholder:text-gray-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <label htmlFor="negativePrompt">Negative prompt</label>
          <input
            name="negativePrompt"
            id="negativePrompt"
            className="block w-full mt-2 mb-4 rounded-md border-0 p-1.5 bg-zinc-600 focus:ring-0 outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder="text, blurry"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
          <div className="w-full text-right">
            <Button
              className="rounded-full px-10 w-[150px] bg-indigo-700 hover:bg-indigo-600 border-[0.5px] border-slate-600"
              onClick={handleGenerateImage}
              disabled={isSendingRequest}
            >
              {isSendingRequest ? (
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
        <ImagesGroup />
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
