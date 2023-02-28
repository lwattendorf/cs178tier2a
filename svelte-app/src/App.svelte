<script>
	import { auth } from './firebase';
    import { authState } from 'rxfire/auth';
	import { Button } from "carbon-components-svelte";

	import Login from './Login.svelte';
	import "carbon-components-svelte/css/g100.css";

    let user = authState(auth);

</script>


<section>
{#if $user}
	<Button on:click={ () => auth.signOut() }>Logout</Button>
{:else}
	<Login/>
{/if}
</section>