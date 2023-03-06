<script>
    import { Grid, Row, Column } from "carbon-components-svelte";
	import AvailabilitySelector from "./AvailabilitySelector.svelte";
    import LocationSelector from './LocationSelector.svelte';
    
    export let updateAvailability;
</script>
  
<Grid>
    <Row>
        <Column>
            <AvailabilitySelector updateAvailability={updateAvailability}></AvailabilitySelector>
        </Column>
        <Column>
            <LocationSelector></LocationSelector>
        </Column>
        </Row>
</Grid>