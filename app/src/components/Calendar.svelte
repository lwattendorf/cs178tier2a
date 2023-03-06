<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import Interaction from '@event-calendar/interaction'
    import '@event-calendar/core/index.css';
    import { selectionState } from './types.ts';
    import { Button, Modal } from "carbon-components-svelte";
    import { Redo } from "carbon-icons-svelte/lib/";
    import { Grid, Row, Column } from 'carbon-components-svelte';
    import { db } from '../firebase.js'
    import { nanoid } from 'nanoid';
    import { doc, deleteDoc } from 'firebase/firestore';
    import { goto } from "$app/navigation";
    import { onAuthStateChanged } from 'Firebase/auth';
    import { onMount } from 'svelte';
    import { auth } from '../firebase.js';

    let open = false;
    let cur_event;
    let availableColor = '#298073';
    let ifnecessaryColor = '#9EDA95';
    let hasAdminAccess = false;

    onMount(() => {
        onAuthStateChanged(
            auth,
            (user) => {
                console.log(user.displayName)
                hasAdminAccess = user.displayName == 'laurenwattendorfadmin' || user.displayName == 'tygeriadmin';
            },
            (error) => {
                console.log(error);
            }
        );
    });

    $: myState = $selectionState;

    let ec;
    let plugins = [TimeGrid, Interaction];
    let options = {
        eventDragStart: (info) => {console.log(info.view)},
        eventDragStop: (info) => {console.log(info.view)},
        select: (info) => (handleSelection(info)),
        eventClick: (event) => (handleEventClick(event)),
        view: 'timeGridWeek',
        slotDuration: '00:15',
        editable: true,
        events: [
            // events added here using handleDateTimeClick()
        ],
        selectable: true,
        height: '730px',
        headerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: 'day', dayGridMonth: 'month', 
                     listDay: 'list', listWeek: 'list', listMonth: 'list', 
                     listYear: 'list', resourceTimeGridDay: 'day', 
                     resourceTimeGridWeek: 'week', timeGridDay: 'day', 
                     timeGridWeek: 'week'},
        allDaySlot: false,
        selectBackgroundColor: "green"
    };

    selectionState.subscribe(value => {
        options.selectBackgroundColor = value.available ? availableColor : ifnecessaryColor;
    })

    function handleEventDeletion() {
        if (cur_event != -1) {
            ec.removeEventById(cur_event);
            deleteDoc(doc(db, "events", cur_event));
        }

        cur_event = -1;
        open = false;
    }

    const handleSelection = (time) => {
        ec.addEvent({
            id: nanoid(),
            title: myState.location == 0 ? 'Anywhere': myState.location == 1 ? 'Zoom Only': 'SEC',
            start: time.start,
            end: time.end,
            color: myState.available ? availableColor : ifnecessaryColor,
            eventBackgroundColor: myState.available ? availableColor : ifnecessaryColor
        })
        options.events.push(ec)
    }

    const handleEventClick = (info) => {
        open = true;
        cur_event = info.event.id;
    }

    function handleSaveEvents() {
        if (options.events != [] && options.events[0] != undefined) { 
            let events = options.events[0].getEvents();
            events.forEach((event) => {
                let docRef = db.collection("events").doc(event.id);
                let startTime = convertTimeToIndex(event.start);
                let endTime = convertTimeToIndex(event.end);
                let obj = {
                    available: event.backgroundColor == availableColor, 
                    location: event.title == 'Anywhere' ? 0 : event.title == 'Zoom Only' ? 1 : 2, 
                    startTime: startTime, 
                    endTime: endTime,
                }
                docRef.get()
                    .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        docRef.update(obj)
                    } else {
                        docRef.set(obj)
                    }
                })
            }) 
        }
    }

    function convertTimeToIndex(time) {
        let diffInSecs = (time-ec.getView().currentStart) / 1000;
        let diffInMin = diffInSecs / 60;
        return diffInMin
    }

    async function handleSaveAndView() {
        handleSaveEvents();
        await goto('/results');
    }

    function handleClear() {
        if (options.events != [] && options.events[0] != undefined) { 
            let events = options.events[0].getEvents();
            events.forEach((event) => {
                let docRef = db.collection("events").doc(event.id);
                docRef.get()
                    .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        deleteDoc(doc(db, "events", event.id));
                    }
                })
            })
            options.events = [];
        }
    }

    function TEMP_clearAllEvents() {
        console.log("DATABASE CLEARED!!")
        options.events = [];
        db.collection("events").get().then(res => {
            res.forEach(element => {
            element.ref.delete();
            });
        });
    }

</script>

<Button on:click={handleClear} kind="secondary" size="field">
    <div style="display: flex; align-items: center;">
        <Redo style="margin-right: 0.0rem;" /> Clear
    </div>
</Button>
<Calendar bind:this={ec} {plugins} {options} />
  
<Modal
    bind:open
    modalHeading="Delete event"
    primaryButtonText="Delete"
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => (open = false)}
    on:click:button--primary={() => (handleEventDeletion())}
    on:open
    on:close
    on:submit
  >
</Modal>

<Grid>
    <Row padding>
        <Column>
            <div class="container">
                <div class="buttonContainer">
                    <button hidden={!hasAdminAccess} on:click={TEMP_clearAllEvents}>Clear database</button>        
                </div>                
                <div class="buttonContainer">
                <Button size="field" kind="tertiary" on:click={handleSaveEvents}>Save</Button>        
                </div>
                <div class="buttonContainer">
                    <Button size="field" on:click={handleSaveAndView}>Save and View Results</Button>        
                </div>
            </div>       
        </Column>
   </Row>
</Grid>
<style>
    .container {
        display: flex;
        justify-content: end;
    }
    .buttonContainer {
        padding-left: 16px;
    }
</style>
