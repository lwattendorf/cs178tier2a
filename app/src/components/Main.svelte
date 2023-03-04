<script>
    import Profile from './Profile.svelte'
    import Menubar from './Menubar.svelte'
    import { Grid } from 'carbon-components-svelte'
    import Calendar from './Calendar.svelte';
    import { writable } from 'svelte/store';
    import { selectionState } from './types.ts';
	import { Types } from 'carbon-icons-svelte';



</script>

<section>
    <Grid>
        <Profile></Profile>
        <Menubar></Menubar>
    </Grid>
</section>
<Calendar></Calendar>