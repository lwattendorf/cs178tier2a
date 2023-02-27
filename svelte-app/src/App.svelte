<script>
	import { auth } from './firebase';
    import { authState } from 'rxfire/auth';

	import Login from './Login.svelte';

    let user = authState(auth);

</script>


<section>
{#if $user}
	<button on:click={ () => auth.signOut() }>Logout</button>
{:else}
	<Login/>
{/if}
</section>