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

{#if displayName!=null}
<Grid>
    <Row padding>
        <Column>
            <div class="container">
                <h4>Welcome, {displayName}</h4>
                <div class="buttonContainer">
                <Button size="small" kind="tertiary" on:click={logout}>Logout</Button>        
                </div>
            </div>       
        </Column>
   </Row>
</Grid>
{:else}
<Loading></Loading>
{/if}

<style>
    .container {
        display: flex;
        justify-content: end;
    }
    .buttonContainer {
        padding-left: 16px;
    }
</style>