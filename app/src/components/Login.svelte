<script>
    import { auth } from '../firebase.js';
    import { Button, Grid, Row, Column, TextInput, Select, SelectItem } from "carbon-components-svelte";
    import { goto } from "$app/navigation";

    let displayName;
    let selectedTimeZone;
    let invalidDisplayName = false;

    async function signInAnonymously() {

        console.log(displayName);
        if (displayName === "") {
            invalidDisplayName = true;
        }
        else {
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
	}
</script>

<Grid>
    <Row padding style="padding-top: 20%" >
        <Column sm={{ span: 2, offset: 1 }}><h1>Welcome</h1></Column>
    </Row>
    <Row padding>
        <Column sm={{ span: 2, offset: 1 }}><h4>Sign In</h4></Column>
    </Row>
    <Row>
        <Column sm={{ span: 2, offset: 1 }}>
            <TextInput 
                bind:value={displayName}
                id="displayName"
                placeholder="Your Name" 
                invalid={invalidDisplayName}
                invalidText="Please input your name."
                on:change={() => {if (displayName !== "") { invalidDisplayName = false}}}
            />
        </Column>
    </Row>
    <Row>
        <Column sm={{ span: 2, offset: 1 }}>
        <Select name="timezone_offset" selected="-05:00" bind:selectedTimeZone>
            <SelectItem value="-12:00" text="(GMT -12:00) Eniwetok, Kwajalein" />
            <SelectItem value="-11:00" text="(GMT -11:00) Midway Island, Samoa" />
            <SelectItem value="-10:00" text="(GMT -10:00) Hawaii" />
            <SelectItem value="-09:50" text="(GMT -9:30) Taiohae" />
            <SelectItem value="-09:00" text="(GMT -9:00) Alaska" />
            <SelectItem value="-08:00" text="(GMT -8:00) Pacific Time (US &amp; Canada)" />
            <SelectItem value="-07:00" text="(GMT -7:00) Mountain Time (US &amp; Canada)" />
            <SelectItem value="-06:00" text="(GMT -6:00) Central Time (US &amp; Canada), Mexico City" />
            <SelectItem value="-05:00" text="(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima" />
            <SelectItem value="-04:50" text="(GMT -4:30) Caracas" />
            <SelectItem value="-04:00" text="(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz" />
            <SelectItem value="-03:50" text="(GMT -3:30) Newfoundland" />
            <SelectItem value="-03:00" text="(GMT -3:00) Brazil, Buenos Aires, Georgetown" />
            <SelectItem value="-02:00" text="(GMT -2:00) Mid-Atlantic" />
            <SelectItem value="-01:00" text="(GMT -1:00) Azores, Cape Verde Islands" />
            <SelectItem value="+00:00" text="(GMT) Western Europe Time, London, Lisbon, Casablanca" />
            <SelectItem value="+01:00" text="(GMT +1:00) Brussels, Copenhagen, Madrid, Paris" />
            <SelectItem value="+02:00" text="(GMT +2:00) Kaliningrad, South Africa" />
            <SelectItem value="+03:00" text="(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg" />
            <SelectItem value="+03:50" text="(GMT +3:30) Tehran" />
            <SelectItem value="+04:00" text="(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi" />
            <SelectItem value="+04:50" text="(GMT +4:30) Kabul" />
            <SelectItem value="+05:00" text="(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" />
            <SelectItem value="+05:50" text="(GMT +5:30) Bombay, Calcutta, Madras, New Delhi" />
            <SelectItem value="+05:75" text="(GMT +5:45) Kathmandu, Pokhara" />
            <SelectItem value="+06:00" text="(GMT +6:00) Almaty, Dhaka, Colombo" />
            <SelectItem value="+06:50" text="(GMT +6:30) Yangon, Mandalay" />
            <SelectItem value="+07:00" text="(GMT +7:00) Bangkok, Hanoi, Jakarta" />
            <SelectItem value="+08:00" text="(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" />
            <SelectItem value="+08:75" text="(GMT +8:45) Eucla" />
            <SelectItem value="+09:00" text="(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" />
            <SelectItem value="+09:50" text="(GMT +9:30) Adelaide, Darwin" />
            <SelectItem value="+10:00" text="(GMT +10:00) Eastern Australia, Guam, Vladivostok" />
            <SelectItem value="+10:50" text="(GMT +10:30) Lord Howe Island" />
            <SelectItem value="+11:00" text="(GMT +11:00) Magadan, Solomon Islands, New Caledonia" />
            <SelectItem value="+11:50" text="(GMT +11:30) Norfolk Island" />
            <SelectItem value="+12:00" text="(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" />
            <SelectItem value="+12:75" text="(GMT +12:45) Chatham Islands" />
            <SelectItem value="+13:00" text="(GMT +13:00) Apia, Nukualofa" />
            <SelectItem value="+14:00" text="(GMT +14:00) Line Islands, Tokelau" />
        </Select>
        </Column>
    </Row>
    <Row>
        <Column sm={{ span: 2, offset: 1 }}>
            <TextInput 
                placeholder="Password (optional)" 
                id="password" 
                type="password" 
                name="password" />
        </Column>
    </Row>
    <Row padding>
        <Column sm={{ span: 2, offset: 1 }}>
            <Button style="width: 100%" on:click={signInAnonymously}>Sign in</Button>
        </Column>
    </Row>
</Grid>

<style>
    :global(.bx--row) {
        padding-bottom: 1rem;
    }
    :global(.bx--select) {
        margin-top: -0.5rem;
    }
</style>