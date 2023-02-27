<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    function remove() {
        dispatch('remove', { id })
    }

    function toggleStatus() {
        let newStatus = !complete;
        dispatch('toggle', {
            id, 
            newStatus
        })
    }

    export let id; // document ID
    export let text;
    export let complete;

</script>

<style>
    * {
        font-size: 18px;
        margin: 4px;
    }
    .row {
        display: flex;
        margin: 4px;
    }
    .row:hover {
        background-color: #DFDFDF;
        border-radius: 2px;
        cursor: pointer;
    }
    .is-complete {
        text-decoration: line-through;
        color: green;
        align-self: center;
    }
    .is-not-complete {
        align-self: center;
    }
    .checkbox {
        margin-left: 8px;
        width: 20px;
    }
    .row .delete-button {
        font-size: 12px;
        padding: 8px;
        margin-left: auto;
    }
</style>

<div class="row" on:click={toggleStatus} on:keyup={console.log('keyup')}>
    <input class="checkbox" type="checkbox" checked={complete} on:click={toggleStatus}>
{#if complete}
    <span class="is-complete">{ text }</span>
{:else}
    <span class="is-not-complete">{ text }</span>
{/if}
    <button class="delete-button" on:click={remove}>Delete</button>
</div>