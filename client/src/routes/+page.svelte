<script lang="ts">
    import { ArrowRightIcon } from "@lucide/svelte";
    import { goto } from "$app/navigation";

    let roomName = $state("");

    const gotoRoom = () => {
        if (roomName.trim() === "") return;
        goto(`/room/${roomName}`);
    };
</script>

<div class="mx-auto w-full max-w-xl space-y-4">
    <input class="input" type="text" placeholder="Room name" bind:value={roomName} />
    <button class="btn preset-filled-primary-500" onclick={gotoRoom}>
        <span>Go to Room</span>
        <ArrowRightIcon size={18} />
    </button>
</div>
