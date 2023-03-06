<script>
	import Results from '../../components/Results.svelte';
	import Profile from '../../components/Profile.svelte';
	import MeetingIntervalSelector from '../../components/MeetingIntervalSelector.svelte';
    import { Grid, Row, Column } from "carbon-components-svelte";
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<Profile></Profile>
	<Grid>
		<Row>
			<Column>
				<MeetingIntervalSelector/>
			</Column>
		</Row>
	</Grid>
	<Results></Results>
</section>