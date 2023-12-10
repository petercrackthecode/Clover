"use client";
import * as Slider from "@radix-ui/react-slider";
import React from "react";

interface GridPickerProps {
  value: number;
  onValueChange: (value: number[]) => void;
}

export default function GridPicker({ value, onValueChange }: GridPickerProps) {
  return (
    <div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-[200px] h-5"
        value={[value]}
        max={12}
        min={1}
        step={1}
        onValueChange={(value) => onValueChange(value)}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-gray-400 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-gray-400 shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA5"
          aria-label="Volume"
        />
      </Slider.Root>
    </div>
  );
}
