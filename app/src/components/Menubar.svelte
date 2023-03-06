<script>
    import { Grid, Row, Column } from "carbon-components-svelte";
	import AvailabilitySelector from "./AvailabilitySelector.svelte";
    import LocationSelector from './LocationSelector.svelte';
	import MeetingIntervalSelector from "./MeetingIntervalSelector.svelte";
	import TopTimesSelector from "./TopTimesSelector.svelte";
    
    export let isResultsPage = false;
</script>
  
<Grid>
    <Row>
        {#if isResultsPage}
        <Column>
            <TopTimesSelector></TopTimesSelector>
        </Column>
        <Column>
            <MeetingIntervalSelector></MeetingIntervalSelector>
        </Column>
        {:else}
        <Column>
            <AvailabilitySelector></AvailabilitySelector>
        </Column>
        <Column>
            <LocationSelector></LocationSelector>
        </Column>
        {/if}
    </Row>
</Grid>