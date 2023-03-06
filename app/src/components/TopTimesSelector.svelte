<script>
    import { ContentSwitcher, Switch } from "carbon-components-svelte";
	import { updateTopTimes } from "./types.ts";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher size="xl" bind:selectedIndex on:click={() => updateTopTimes(selectedIndex)}>
    <Switch text="Top 3 Times"/>
    <Switch text="Top 5 Times" />
    <Switch text="Top 10 Times" />
</ContentSwitcher>