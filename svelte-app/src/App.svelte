<script>
	import { auth } from './firebase';
    import { authState } from 'rxfire/auth';

	import Main from "./Main.svelte";
	import Login from './Login.svelte';
	import "carbon-components-svelte/css/g100.css";

    let user = authState(auth);

</script>


<section>
{#if $user}
	<Main/>
{:else}
	<Login/>
{/if}
</section>