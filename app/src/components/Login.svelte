<script>
    import { auth, userDoc } from '../firebase.js';
    import { Button, Grid, Row, Column, TextInput } from "carbon-components-svelte";
    import { goto } from "$app/navigation";

    let displayName;

    async function signInAnonymously() {
        console.log("Signing in...");
        try {
            const userCredential = await auth.signInAnonymously();
            const user = userCredential.user;


            // Update the user's profile with the provided name
            await user.updateProfile({
                displayName: displayName,
            });

            await goto('/main');

            console.log('Signed in anonymously as', user.displayName);
        } catch (error) {
            console.error('Error signing in', error);
        }
	}
</script>

<Grid>
    <Row padding style="padding-top: 20%" >
        <Column/>
        <Column><h1>Welcome</h1></Column>
        <Column/>
    </Row>
    <Row padding>
        <Column/>
        <Column><h4>Sign In</h4></Column>
        <Column/>
    </Row>
    <Row>
        <Column/>
        <Column>
            <TextInput 
                bind:value={displayName}
                id="displayName"
                placeholder="Your Name" 
            />
        </Column>
        <Column/>
    </Row>
    <Row>
        <Column/>
        <Column>
            <TextInput 
                placeholder="Password (optional)" 
                id="password" 
                type="password" 
                name="password" />
        </Column>
        <Column/>
    </Row>
    <Row padding>
        <Column/>
        <Column>
            <Button style="width: 100%" on:click={signInAnonymously}>Sign in</Button>
        </Column>
        <Column/>
    </Row>
</Grid>