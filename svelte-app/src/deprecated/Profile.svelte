<script>
    import { auth } from '../firebase';
    export let displayName;
</script>

<style>
    * {
        margin-left: 8px;
    }
</style>

<h3>Hi {displayName}.</h3>
<p>Welcome to your to do list. Time to get to work!</p>
<button on:click={ () => auth.signOut() }>Logout</button>