<script>
    import Profile from './Profile.svelte'
    import Menubar from './Menubar.svelte'
    import { Grid } from 'carbon-components-svelte'
    import Calendar from './Calendar.svelte';
    import { Theme } from "carbon-components-svelte";

</script>

<Profile></Profile>
<Menubar></Menubar>
<Grid>
    <Calendar></Calendar>
</Grid>