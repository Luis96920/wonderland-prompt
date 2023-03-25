<script lang="ts">
  import Chat from "../lib/chat.svelte";
  import { io } from "../lib/realtime";
  import { onMount } from "svelte";
  import type { ChatMessage } from "../app";
  import { createAvatar } from "@dicebear/core";
  import { pixelArt } from "@dicebear/collection";
  import { generateUsername } from "unique-username-generator";
  let loading = false;
  let textfield = "";
  let img: string | undefined;
  let username = generateUsername();
  let scrollToBottom: () => void;
  let profileImage = createAvatar(pixelArt, {
    seed: crypto.randomUUID(),
  }).toDataUriSync();

  // define local storage
  let localStorage: Storage;

  onMount(() => {
    // Access localStorage within onMount
    localStorage = window.localStorage;

    // Check if there's a saved username and profileImage in localStorage
    if (
      localStorage.getItem("username") &&
      localStorage.getItem("profileImage")
    ) {
      // If they exist, retrieve them from localStorage
      username = localStorage.getItem("username")!;
      profileImage = localStorage.getItem("profileImage")!;
    } else {
      // If not, generate a new username and profileImage
      username = generateUsername();
      profileImage = createAvatar(pixelArt, {
        seed: crypto.randomUUID(),
      }).toDataUriSync();

      // Save the generated username and profileImage to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("profileImage", profileImage);
    }
  });

  let messages: ChatMessage[] = [];

  onMount(() => {
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
  <div class="bg-black">
    {#if img}
      <img src={img} class="w-full h-[100vh]" alt="generated" />
    {/if}
  </div>
  <div class="bg-gray-200 h-full">
    <Chat onSubmit={sendMessage} bind:messages bind:profileImg={profileImage} {scrollToBottom} {loading}/>
  </div>
  <!-- 
  
    </div>
  </div> -->
</div>
