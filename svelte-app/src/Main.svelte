<script>
    import { auth } from './firebase';
    import { Grid, Row, Column, Loading } from "carbon-components-svelte";
    
    import Profile from './Profile.svelte';
    import { readable } from 'svelte/store'
    import { onAuthStateChanged } from 'firebase/auth'
</script>

<!-- {#if $user === undefined}
    <Loading/>
{:else}
    {#if $user} -->
    <Grid>
        <Profile $user.displayName/>
    </Grid>
    <!-- {:else}
    <h1>No Access.</h1>
    {/if}
{/if} -->
