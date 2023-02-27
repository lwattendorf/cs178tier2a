<script>
    import { auth } from './firebase'

    async function signInAnonymously() {
        console.log("Signing in...");
        try {
            const userCredential = await auth.signInAnonymously();
            const user = userCredential.user;

            const displayName = document.getElementById('displayName').value;

            // Update the user's profile with the provided name
            await user.updateProfile({
                displayName: displayName,
            });

            console.log('Signed in anonymously as', user.displayName);
        } catch (error) {
            console.error('Error signing in', error);
        }
	}
</script>


<h1>Login</h1>
<input id="displayName" type="name" name="name"/>
<input id="password" type="password" name="password" />

<button on:click={signInAnonymously}>Sign in</button>

<style>

</style>
