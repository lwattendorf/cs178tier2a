<script>
    import Profile from './Profile.svelte'
    import Menubar from './Menubar.svelte'
    import ContextMenu from './ContextMenu.svelte'
    import { Grid } from 'carbon-components-svelte'
</script>

<section>
    <Grid>
        <Profile></Profile>
        <Menubar></Menubar>
        <ContextMenu></ContextMenu>
    </Grid>
</section>