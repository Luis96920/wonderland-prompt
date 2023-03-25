<script lang="ts">
  import Chat from "../lib/chat.svelte";
  import { io } from "../lib/realtime";
  import { onMount } from "svelte";
  import type { ChatMessage } from "../app";
  import { createAvatar } from "@dicebear/core";
  import { pixelArt } from "@dicebear/collection";
  import { generateUsername } from "unique-username-generator";

  let textfield = "";
  let username = generateUsername();
  let profileImage = createAvatar(pixelArt, {
    seed: crypto.randomUUID(),
  }).toDataUriSync();

  let messages: ChatMessage[] = [];

  onMount(() => {
    io.on("connect", () => {
      console.log("Connected");
      setTimeout(() => {}, 500);
    });
    io.on("chat_messages", (nMessages: ChatMessage[]) => {
      console.log("RECIEVED CHAT MESSAGES");
      messages = nMessages;
    });
    io.on("chat_message", (message: ChatMessage) => {
      // Listen to the message event
      console.log("RECIEVED CHAT MESSAGE");
      messages = [...messages, message];
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

    io.emit("chat_message", {
      prompt: message,
      profile: {
        name: username,
        avatar: profileImage,
      },
    } as ChatMessage);
  }
</script>

<div class="sm:grid-cols-[7fr_3fr] grid h-[100vh]">
  <div class="bg-black" />
  <div class="bg-gray-200 h-full">
    <Chat onSubmit={sendMessage} bind:messages bind:profileImg={profileImage}/>
  </div>
  <!-- 
  
    </div>
  </div> -->
</div>
