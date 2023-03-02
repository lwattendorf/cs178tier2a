
<script>
    import { ContentSwitcher, Switch, Grid, Row, Column, ComboBox } from "carbon-components-svelte";
    import { FaceSatisfiedFilled, FaceNeutral, EarthEuropeAfrica, Building, Video } from "carbon-icons-svelte/lib/";
  
    let selectedIndex = 0;
</script>

<ContentSwitcher bind:selectedIndex>
    <Switch>
        <div style="display: flex; align-items: center;">
            <FaceSatisfiedFilled style="margin-right: 0.5rem;" />Available
        </div>
    </Switch>
    <Switch>
        <div style="display: flex; align-items: center;">
            <FaceNeutral style="margin-right: 0.5rem;" />If necessary
        </div>
    </Switch>
</ContentSwitcher>