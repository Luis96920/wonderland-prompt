<script lang="ts">
  import { pixelArt } from "@dicebear/collection";
  import { createAvatar } from "@dicebear/core";
  import type { ChatMessage } from "../app";

  export let messages: ChatMessage[] = [];
  export let text: string = "";
  export let onSubmit: (message: string) => void;
  export let profileImg: string;

  let promptTextField: HTMLInputElement;

  let promptContainer: HTMLElement;
</script>

<div class="flex flex-col h-[100vh] relative">
  <div>
    <div
      class="p-4 border-b border-b-gray-300 backdrop-blur-lg absolute w-full bg-white bg-opacity-20 flex"
    >
      <img
        src="/img.png"
        height="40px"
        width="40px"
        class="h-[40px] w-[40px]"
        alt="Logo"
      />
      <div>
        <h1 class=" font-bold">Wonderland</h1>
        <p class="text-sm text-gray-700">
          Generative. Imaginative. Collaborative.
        </p>
      </div>
      <div class="ml-auto">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
          src={profileImg}
          class="h-[40px] w-[40px] rounded-md ml-auto bg-gray-300"
          alt="Profile"
          on:click={() => {
            profileImg = createAvatar(pixelArt, {
              seed: crypto.randomUUID(),
            }).toDataUriSync();
          }}
        />
      </div>
    </div>
  </div>
  <div
    class=" flex flex-col mt-auto overflow-scroll"
    bind:this={promptContainer}
  >
    {#each messages as message}
      <div class="flex px-4 py-4">
        <div class="h-[40px] w-[40px] rounded-md bg-gray-300 mr-2">
          <img src={message.profile.avatar} alt={message.profile.name} />
        </div>
        <div class="flex flex-col">
          <div class="text-gray-400 text-xs">{message.profile.name}</div>
          <div>{message.prompt}</div>
        </div>
      </div>
    {/each}
  </div>
  <div class="pb-4 px-4">
    <div class="h-[2px] bg-gray-300 mb-4" />
    <form
      on:submit={() => {
        onSubmit(text);
        promptContainer.scrollTo({
          left: 0,
          top: promptContainer.scrollHeight - promptContainer.clientHeight,
          behavior: "smooth",
        });
        text = "";
        setTimeout(() => {
          promptTextField.focus();
        }, 100);
      }}
    >
      <input
        placeholder="Make him a robot"
        class="w-full rounded-lg p-2 focus:outline-none"
        bind:this={promptTextField}
        bind:value={text}
      />
    </form>
  </div>
</div>
