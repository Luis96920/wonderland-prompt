<script lang="ts">
  import Chat from "../lib/chat.svelte";
  import { io } from "../lib/realtime";
  import { onMount } from "svelte";
  import type { ChatMessage } from "../app";
  import { createAvatar } from "@dicebear/core";
  import { pixelArt } from "@dicebear/collection";
  import { generateUsername } from "unique-username-generator";
  import { slide } from "svelte/transition";
  let loading = false;
  let textfield = "";
  let img: string | undefined | null;
  let username = generateUsername();
  let userId: string;
  let scrollToBottom: () => void;
  let message: string | undefined;
  let profileImage = createAvatar(pixelArt, {
    seed: Math.random().toString(36).substring(2, 15),
  }).toDataUriSync();
  function download(dataurl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }
  // define local storage
  let localStorage: Storage;

  onMount(() => {
    // Access localStorage within onMount
    localStorage = window.localStorage;

    // Check if there's a saved username and profileImage and userId in localStorage
    if (
      localStorage.getItem("username") &&
      localStorage.getItem("profileImage") &&
      localStorage.getItem("userId")
    ) {
      // If they exist, retrieve them from localStorage
      username = localStorage.getItem("username")!;
      profileImage = localStorage.getItem("profileImage")!;
      userId = localStorage.getItem("userId")!;
    } else {
      // If not, generate a new username, profileImage, and userId
      username = generateUsername();
      profileImage = createAvatar(pixelArt, {
        seed: Math.random().toString(36).substring(2, 15),
      }).toDataUriSync();
      userId = Math.random().toString(36).substring(2, 9);

      // Save the generated username, profileImage, and userId to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("profileImage", profileImage);
      localStorage.setItem("userId", userId);
    }
  });

  let messages: ChatMessage[] = [];

  onMount(() => {
    io.on("message", (m: string) => {
      console.log("RECIEVED MESSAGE");
      console.log(message);
      message = m;
      setTimeout(() => {
        message = undefined;
      }, 5000);
    });
    io.on("connect", () => {
      console.log("Connected");
      setTimeout(() => {}, 500);
    });
    io.on("loading", (l: boolean) => {
      console.log("RECIEVED LOADING");
      loading = l;
    });
    io.on("ai_image", (image: string) => {
      console.log("RECIEVED AI IMAGE");
      img = image;
    });
    io.on("chat_messages", (nMessages: ChatMessage[]) => {
      console.log("RECIEVED CHAT MESSAGES");
      messages = nMessages;
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    });
    io.on("chat_message", (message: ChatMessage) => {
      // Listen to the message event
      console.log("RECIEVED CHAT MESSAGE");
      messages = [message, ...messages];
      messages = messages.slice(0, 100);
      console.log("Message: ", message);
    });
    io.on("name", (name) => {
      // Another listener for the name:
      username = name; // Update the name so it can be displayed
    });
  });

  function sendMessage(message: string) {
    if (!message) return;

    textfield = "";
    console.log("SENDING CHAT MESSAGE");

    // Record the timestamp when the user submits the message
    const timestamp = new Date();

    io.emit("chat_message", {
      prompt: message,
      profile: {
        name: username,
        avatar: profileImage,
      },
      timestamp: timestamp.toISOString(),
    } as ChatMessage);

    // Save the last time the user sent a message to localStorage
    localStorage.setItem("lastMessageTime", timestamp.toISOString());
  }
</script>

<div class="sm:grid-cols-[7fr_3fr] grid h-[100vh]">
  <div class="bg-black relative">
    {#if img}
      <img src={img} class="w-full h-[100vh] object-contain" alt="generated" />
      <button
        class="bg-white absolute bottom-4 right-4 p-4 rounded-sm"
        on:click={() => {
          if (img) {
            download(img, "generated.png");
          }
        }}
      >
        Download
      </button>
    {/if}
  </div>
  <div class="bg-gray-200 h-full">
    <Chat
      onSubmit={sendMessage}
      bind:messages
      bind:profileImg={profileImage}
      {scrollToBottom}
      {loading}
    />
  </div>

  <!-- 
  
    </div>
  </div> -->
</div>
{#if message}
  <div
    class="absolute bottom-4 bg-black text-white p-4 rounded-sm"
    transition:slide
  >
    <p>{message}</p>
  </div>
{/if}
