"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { MouseEvent, useEffect, useState, useCallback, useMemo } from "react";
import React from "react";
import { Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "@/lib/constants";
import lodash from "lodash";
import {
  Images,
  Image,
  ImageResponse,
  Prompts,
  Prompt,
  PromptStack,
  Likes,
} from "@/models";
import ImagesGroup from "@/components/imagesGroup";
import { v4 as uuidv4 } from "uuid";

let socket: Socket;

export default function Generate() {
  const [prompt, setPrompt] = useState<string>("");
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [prevPrompts, setPrevPrompts] = useState<Prompts>({} as Prompts);
  const [promptStack, setPromptStack] = useState<PromptStack>(
    [] as PromptStack
  );
  const [likedImageIds, setLikedImageIds] = useState<Likes>(
    typeof window !== "undefined" && localStorage.getItem("likes")
      ? new Set(JSON.parse(localStorage.getItem("likes")!))
      : new Set()
  );

  const saveImgsToLocalStorage = useCallback(
    ({
      input,
      id,
      output,
    }: {
      input: { prompt: string; negative_prompt: string };
      id: string;
      output: ImageResponse[];
    }) => {
      const { prompt, negative_prompt } = input;
      const promptId = id;
      let updatedImages: Images = lodash.cloneDeep(
        JSON.parse(localStorage.getItem("images") || "{}")
      );

      setPrevPrompts((prevPrompts) => {
        let updatedPrompts = lodash.cloneDeep(prevPrompts);
        let promptWithId = lodash.cloneDeep(updatedPrompts[promptId]);

        if (
          !promptWithId ||
          promptWithId.prompt != prompt ||
          promptWithId.negativePrompt != negative_prompt ||
          promptWithId.imageIds.length !== 0
        )
          return prevPrompts;
        // console.log("promptWithId = ", promptWithId);
        // console.log("prompt = ", prompt);
        // console.log("promptId = ", promptId);
        // console.log("updating prevPrompts");
        for (const img of output) {
          // image already exists
          if (!img || !img.image) continue;
          let _img: Image = {
            url: img.image,
            prompt,
            negativePrompt: negative_prompt,
            promptId,
          };
          const imageId = uuidv4();
          updatedImages[imageId] = _img;
          updatedPrompts[promptId].imageIds.push(imageId);
        }
        localStorage.setItem("prompts", JSON.stringify(updatedPrompts));
        localStorage.setItem("images", JSON.stringify(updatedImages));
        return updatedPrompts;
      });
    },
    []
  );

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

  const initSocket = useCallback(async () => {
    if (!socket) socket = io(BACKEND_URL);
    socket.on("connect", () => {
      console.log("connected. Socket id = ", socket.id);
    });

    socket.on("hi", (message) => {
      console.log("message = ", message);
    });

    socket.on("taskFinished", (res) => {
      console.log("res = ", res);
      if (!res.ok) {
        // display a toast signaling the user that the image generation failed
        return;
      }
      const { data } = res;
      saveImgsToLocalStorage(data);
    });
  }, [saveImgsToLocalStorage]);

  const getPrompts = useCallback(() => {
    const prompts = localStorage.getItem("prompts");
    const _promptStack = localStorage.getItem("promptStack");

    if (prompts) {
      setPrevPrompts(JSON.parse(prompts));
    }
    if (_promptStack) {
      setPromptStack(JSON.parse(_promptStack));
    }
  }, []);

  // useEffect(() => {
  //   console.log("within useEffect, prevPrompts = ", prevPrompts);
  // }, [prevPrompts]);

  useEffect(
    function saveLikesToDB() {
      console.log("I'm being called");
      window.localStorage.setItem(
        "likes",
        JSON.stringify(Array.from(likedImageIds))
      );
    },
    [likedImageIds]
  );

  useEffect(() => {
    if (typeof window !== undefined && window.localStorage) {
      getPrompts();
    }
  }, [getPrompts]);

  useEffect(() => {
    if (typeof window !== undefined && window.localStorage) {
      initSocket();
      getLikesImageIds();
    }
  }, []);

  const handleGenerateImage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (prompt.trim() === "") return;
    const currentPrompt = prompt.trim(),
      currentNegativePrompt = negativePrompt.trim();
    const data = JSON.stringify({
      prompt: currentPrompt,
      negative_prompt: currentNegativePrompt,
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
        // need a better error handling here
        // check for ok === false
        const {
          data: { id },
        }: { data: { id: string } } = res.data;
        const newPrompt: Prompt = {
          prompt: currentPrompt,
          negativePrompt: currentNegativePrompt,
          imageIds: [],
        };
        const newPrompts = { ...prevPrompts, [id]: newPrompt };
        const newPromptStack = [...promptStack, id];
        localStorage.setItem("prompts", JSON.stringify(newPrompts));
        setPrevPrompts(newPrompts);
        setPromptStack(newPromptStack);
        localStorage.setItem("promptStack", JSON.stringify(newPromptStack));
      })
      .catch((error) => console.log(error));
    setIsSendingRequest(false);
  };

  return (
    <main className="w-full min-h-screen text-white bg-zinc-800 flex flex-col items-center">
      <section className="flex flex-col gap-y-9 pt-2 mb-5 mt-24 w-full xl:px-96 lg:px-60 md:px-20 sm:px-10">
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
      </section>
      <section className="w-full px-10">
        <ImagesGroup
          {...{
            promptStack,
            prevPrompts,
            likedImageIds,
            toggleImageLike,
          }}
        />
      </section>
    </main>
  );
}
