<script>
    import { Button, ContentSwitcher, Switch, Grid, Row, Column, ComboBox } from "carbon-components-svelte";
    import { FaceSatisfiedFilled, FaceNeutral, EarthEuropeAfrica, Building, Video, Redo } from "carbon-icons-svelte/lib/";
  
    function clear() {
        // options.events = [];
    }

</script>

    <Button on:click={clear} kind="secondary" size="small">
        <div style="display: flex; align-items: center;">
            <Redo style="margin-right: 0.0rem;" />Clear
        </div>
    </Button>