<script>
    import { ContentSwitcher, Switch, Grid, Row, Column, ComboBox } from "carbon-components-svelte";
    import { FaceSatisfiedFilled, FaceNeutral, EarthEuropeAfrica, Building, Video } from "carbon-icons-svelte/lib/";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher bind:selectedIndex>
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

<style>
    :global(.bx--content-switcher-btn.any)::after,
    :global(.bx--content-switcher-btn.bx--content-switcher--selected.any) {
        background-color: darkslateblue !important
    }
    :global(.bx--content-switcher-btn.zoom)::after,
    :global(.bx--content-switcher-btn.bx--content-switcher--selected.zoom){
        background-color: purple !important
    }
    :global(.bx--content-switcher-btn.sec)::after, 
    :global(.bx--content-switcher-btn.bx--content-switcher--selected.sec) {
        background-color: blueviolet !important
    }
</style>