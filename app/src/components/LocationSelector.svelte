<script>
    import { ContentSwitcher, Switch, Grid, Row, Column, ComboBox } from "carbon-components-svelte";
    import { FaceSatisfiedFilled, FaceNeutral, EarthEuropeAfrica, Building, Video } from "carbon-icons-svelte/lib/";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher bind:selectedIndex>
    <Switch>
        <div style="display: flex; align-items: center;">
            <EarthEuropeAfrica style="margin-right: 0.5rem;" />Any location
        </div>
    </Switch>
    <Switch>
        <div style="display: flex; align-items: center;">
            <Video style="margin-right: 0.5rem;" />Zoom only
        </div>
    </Switch>
    <Switch>
        <div style="display: flex; align-items: center;">
            <Building style="margin-right: 0.5rem;" />SEC only
        </div>
    </Switch>
</ContentSwitcher>