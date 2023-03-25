<script lang="ts">
  import Chat from "../lib/chat.svelte";
  import { io } from "../lib/realtime";
  import { onMount } from "svelte";

  let textfield = "";
  let username = "";

  let messages: string[] = [];

  onMount(() => {
    io.on("connect", () => {
      console.log("Connected")
      setTimeout(() => {

      }, 500);


    });
    io.on("chat_messages", (nMessages: string[])=>{
      console.log("RECIEVED CHAT MESSAGES")
      messages = nMessages;
    })
    io.on("chat_message", (message: string) => {
      // Listen to the message event
      console.log("RECIEVED CHAT MESSAGE")
      messages = [...messages, message];
      console.log("Message: ", message)
    });
    io.on("name", (name) => {
      // Another listener for the name:
      username = name; // Update the name so it can be displayed
    });
  });

  function sendMessage(message: string) {
   
    if (!message) return;

    textfield = "";
    console.log("SENDING CHAT MESSAGE")
    io.emit("chat_message", message); // Send the message
  }
</script>

<div class="sm:grid-cols-[7fr_3fr] grid h-[100vh]">
  <div class="bg-black" />
  <div class="bg-gray-200 h-full" >
    <Chat onSubmit={sendMessage} bind:messages />
    </div>
<!-- 
  
    </div>
  </div> -->
</div>
