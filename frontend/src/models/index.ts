export interface Image {
  url: string;
  prompt: string;
  negativePrompt: string;
  isLoading: boolean;
  promptId: string;
}

export interface Images {
  [id: string]: Image;
}

export interface Prompt {
  prompt: string;
  negativePrompt: string;
  imageIds: string[];
}

// a stack of prompts by the order they were added
export type PromptStack = string[];
export interface Prompts {
  [id: string]: Prompt;
}

export type Likes = Set<string>;
