<script>
    import { ContentSwitcher, Switch } from "carbon-components-svelte";
    import { updateMeetingInterval } from "./types.ts";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher size="xl" bind:selectedIndex on:click={() => updateMeetingInterval(selectedIndex)}>
    <Switch text="1 Hour Meeting"/>
    <Switch text="30 Minute Meeting" />
    <Switch text="15 Minute Meeting" />
</ContentSwitcher>