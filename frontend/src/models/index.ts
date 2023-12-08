export interface Image {
  url: string;
  prompt: string;
  isLoading: boolean;
  promptId: string;
}

export interface Images {
  [id: string]: Image;
}

export interface Prompt {
  id: string;
  prompt: string;
  negativePrompt: string;
  imageIds: string[];
}

export interface Prompts {
  [id: string]: Prompt;
}

export type Likes = Set<string>;
