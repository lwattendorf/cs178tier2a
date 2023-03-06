<script>
	import Results from '../../components/Results.svelte';
	import Profile from '../../components/Profile.svelte';
	import Menubar from '../../components/Menubar.svelte';
	import { Grid } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>schedUlater</title>
</svelte:head>

<section>
	<Profile></Profile>
	<Menubar isResultsPage={true}></Menubar>
	<Grid>
		<Results></Results>
	</Grid>
</section>