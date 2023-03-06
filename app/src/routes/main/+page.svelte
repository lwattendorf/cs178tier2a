<script>
    import Profile from '../../components/Profile.svelte'
    import Menubar from '../../components/Menubar.svelte'
    import { Grid } from 'carbon-components-svelte';
    import Calendar from '../../components/Calendar.svelte';
</script>

<svelte:head>
	<title>schedUlater</title>
</svelte:head>

<section>
	<Profile></Profile>
	<Menubar></Menubar>
	<Grid>
		<Calendar></Calendar>
	</Grid>
</section>