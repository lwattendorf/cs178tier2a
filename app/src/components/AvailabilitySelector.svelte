<script>
    import { ContentSwitcher, Switch } from "carbon-components-svelte";
    import { FaceSatisfied, FaceDissatisfied } from "carbon-icons-svelte/lib/";
    import { updateAvailability } from "./types.ts";
    let selectedIndex = 0;

</script>

<ContentSwitcher size="xl" bind:selectedIndex on:click={updateAvailability}>
    <Switch class="available">
        <div style="display: flex; align-items: center;">
            <FaceSatisfied style="margin-right: 0.5rem;" />Available
        </div>
    </Switch>
    <Switch class="ifnecessary">
        <div style="display: flex; align-items: center;">
            <FaceDissatisfied style="margin-right: 0.5rem;" />If necessary
        </div>
    </Switch>
</ContentSwitcher>

<style>
    :global(.bx--content-switcher-btn.available)::after,
    :global(.bx--content-switcher-btn.available.bx--content-switcher--selected) {
        background-color: #298073 !important
    }
    :global(.bx--content-switcher-btn.ifnecessary)::after,
    :global(.bx--content-switcher-btn.ifnecessary.bx--content-switcher--selected) {
        background-color: #619d4b !important
    }
</style>