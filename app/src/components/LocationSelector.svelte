<script>
    import { ContentSwitcher, Switch } from "carbon-components-svelte";
    import { EarthEuropeAfrica, Building, Video } from "carbon-icons-svelte/lib/";
    import { updateLocation } from "./types.ts";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher size="xl" bind:selectedIndex on:click={() => updateLocation(selectedIndex)}>
    <Switch class="any">
        <div style="display: flex; align-items: center;">
            <EarthEuropeAfrica style="margin-right: 0.5rem;" />Any location
        </div>
    </Switch>
    <Switch class="zoom">
        <div style="display: flex; align-items: center;">
            <Video style="margin-right: 0.5rem;" />Zoom only
        </div>
    </Switch>
    <Switch class="sec">
        <div style="display: flex; align-items: center;">
            <Building style="margin-right: 0.5rem;" />SEC only
        </div>
    </Switch>
</ContentSwitcher>