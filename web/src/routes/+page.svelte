<script lang='ts'>
  import Chat from "../lib/chat.svelte";

  export let messages: string[] = [];
  export let text: string = '';
  export let onSubmit = (message: string) => {
    messages = [...messages, message];
    text = '';
  
  };
</script>

<div class="sm:grid-cols-[7fr_3fr] grid h-[100vh]">
  <div class="bg-black" />
  <div class="bg-gray-200 h-full"> <Chat bind:onSubmit bind:text bind:messages/>
  </div>
</div>
