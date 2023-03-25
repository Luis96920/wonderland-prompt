// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export { };

export interface ChatMessage {
  prompt: string;
  profile: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}
