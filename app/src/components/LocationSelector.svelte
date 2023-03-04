<script>
    import { ContentSwitcher, Switch, Grid, Row, Column, ComboBox } from "carbon-components-svelte";
    import { FaceSatisfiedFilled, FaceNeutral, EarthEuropeAfrica, Building, Video } from "carbon-icons-svelte/lib/";
    import { updateLocation } from "./types.ts";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher bind:selectedIndex on:click={() => updateLocation(selectedIndex)}>
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