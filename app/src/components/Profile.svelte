<script>
    import { Button, Grid, Row, Column } from "carbon-components-svelte";
    import { onAuthStateChanged } from 'Firebase/auth';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { auth } from '../firebase.js';
    import { setAvailability } from './types.ts';
    let displayName = null;

    onMount(() => {
        onAuthStateChanged(
            auth,
            (user) => {
                displayName = user ? user.displayName : '';
            },
            (error) => {
                console.log(error);
            }
        );
    });

    async function logout() {
        setAvailability(true); // reset availability store to true
        auth.signOut();
        await goto('/');
    }
</script>

<Grid>
    <Row padding>
        <Column>
            <div class="header-container">
                <div class="left-container">
                    <h4 style="align-self: end">Please enter your availability:</h4>
                </div>
                <div class="container">
                    {#if displayName!=null}<h4>Welcome, {displayName}</h4>{/if}
                    <div class="buttonContainer">
                    <Button size="field" kind="tertiary" on:click={logout}>Logout</Button>        
                    </div>
                </div>
            </div>
        </Column>
   </Row>
</Grid>

<style>
    :global(h4) {
        align-self: center;
        font-size: 18px;
    }
    .container {
        display: flex;
        justify-content: end;
    }
    .buttonContainer {
        padding-left: 16px;
    }
</style>