<script>
    import { Loading, Button, Grid, Row, Column } from "carbon-components-svelte";
    import { onAuthStateChanged } from 'Firebase/auth';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { auth } from '../firebase.js';
    export let displayName = null;

    onMount(() => {
        onAuthStateChanged(
            auth,
            (user) => {
                displayName = user.displayName;
            },
            (error) => {
                console.log(error);
            }
        );
    });

    async function logout() {
        auth.signOut();
        await goto('/');
    }
</script>

<Grid>
    <Row padding>
        <Column>
            <div class="container">
                {#if displayName!=null}<h4>Welcome, {displayName}</h4>{/if}
                <div class="buttonContainer">
                <Button size="small" kind="tertiary" on:click={logout}>Logout</Button>        
                </div>
            </div>       
        </Column>
   </Row>
</Grid>

<style>
    .container {
        display: flex;
        justify-content: end;
    }
    .buttonContainer {
        padding-left: 16px;
    }
</style>