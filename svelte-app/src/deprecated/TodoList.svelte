<script>
    import TodoItem from './TodoItem.svelte';
    import { db } from '../firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';

    export let uid;

    let text = 'some task';

    const query = db.collection('todos').where('uid', '==', uid).orderBy('created');

    const todos = collectionData(query, { idField: 'id' }).pipe(startWith([]));

    function add() {
        db.collection('todos').add({ uid, text, complete: false, created: Date.now() });
        text = '';
    }

    // functions to be passed to TodoItem instances
    function updateStatus(event) {
        const { id, newStatus } = event.detail;
        db.collection('todos').doc(id).update({ complete: newStatus });
    }

    function removeItem(event) {
        const { id } = event.detail;
        db.collection('todos').doc(id).delete();
    }
</script>

<style>
    h1 {
        margin-bottom: 4px;
        margin-left: 8px;
    }
    input { display: block }
    .column {
        display: flex;
        flex-direction: column;
        width: 40%;
    }
    .row {
        margin: 8px;
        display: flex;
        justify-content: space-between;
    }
    .add-button {
        font-size: 12px;
        padding: 8px;
        background-color: #CFCFCF;
    }
</style>

<h1>To Do List:</h1>
<div class="column">
	{#each $todos as todo}
        <TodoItem {...todo} on:remove={removeItem} on:toggle={updateStatus} />
        
	{/each}
    <div class="row">
        <input bind:value={text}/>
        <button class="add-button" on:click={add}>Add Task</button>
    </div>
</div>
