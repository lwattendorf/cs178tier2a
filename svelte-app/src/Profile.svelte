<script>
    import { Button, Grid, Row, Column } from "carbon-components-svelte";
    import { auth } from './firebase';

    let displayName;
</script>

<Grid>
    <Row padding>
        <Column><h4>Welcome, {displayName}</h4></Column>
    </Row>
    <Row>
        <Column>
            <Button kind="tertiary" on:click={ () => auth.signOut() }>Logout</Button>
        </Column>
    </Row>
</Grid>