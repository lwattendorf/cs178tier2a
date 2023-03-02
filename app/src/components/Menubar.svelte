<script>
    import { Grid, Row, Column } from "carbon-components-svelte";
	import AvailabilitySelector from "./AvailabilitySelector.svelte";
    import LocationSelector from './LocationSelector.svelte';
</script>
  
<Grid>
    <Row>
        <Column>
            <AvailabilitySelector></AvailabilitySelector>
        </Column>
        <Column>
            <LocationSelector></LocationSelector>
        </Column>
        </Row>
  </Grid>