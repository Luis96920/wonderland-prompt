<script lang="ts">
  export let messages: string[] = [];
  export let text: string = "";
  export let onSubmit: (message: string) => void;

  let promptTextField: HTMLInputElement;

  let promptContainer: HTMLElement;
</script>

<div class="flex flex-col h-[100vh] relative">
  <div>
    <div
      class="p-4 border-b border-b-gray-300 backdrop-blur-lg absolute w-full bg-white bg-opacity-20"
    >
      <h1>Wonderland</h1>
    </div>
  </div>
  <div
    class=" flex flex-col mt-auto overflow-scroll"
    bind:this={promptContainer}
  >
    {#each messages as message}
      <div>
        <div class="bg-gray-200 rounded-lg px-4 py-4">
          {message}
        </div>
      </div>
    {/each}
  </div>
  <div class="p-4">
    <div class="h-[2px] bg-gray-300 mb-4" />
    <form
      on:submit={() => {
        onSubmit(text);
        promptContainer.scrollTo({
          left: 0,
          top: promptContainer.scrollHeight,
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
