<script>
    import Profile from './Profile.svelte'
    import Menubar from './Menubar.svelte'
    import { Grid } from 'carbon-components-svelte'
    import Calendar from './Calendar.svelte';
</script>

<section>
    <Grid>
        <Profile></Profile>
        <Menubar></Menubar>
    </Grid>
</section>
<Calendar></Calendar>