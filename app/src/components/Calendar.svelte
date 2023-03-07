<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import Interaction from '@event-calendar/interaction'
    import '@event-calendar/core/index.css';
    import { selectionState, setAvailability, updateLocation } from './types.ts';
    import { Button, Modal } from "carbon-components-svelte";
    import { Redo } from "carbon-icons-svelte/lib/";
    import { db } from '../firebase.js'
    import { nanoid } from 'nanoid';
    import { doc, deleteDoc } from 'firebase/firestore';
    import { goto } from "$app/navigation";
    import { onAuthStateChanged } from 'Firebase/auth';
    import { onMount } from 'svelte';
    import { auth } from '../firebase.js';
    import { availableColor, ifnecessaryColor } from './types';
    import { timeZoneState, updateTimeZone, covertShortStrToText, covertShortToDiff } from "./types.ts";

    // Init global variables for event selection, deletion, duplication
    let open = false;
    let cur_event;
    // Global variables for log in and user name
    let hasAdminAccess = false;
    let displayName;

    // Subscription to Store for preferences and timezone
    // CONCEPT: Menubar
    $: myState = $selectionState;
    $: timeZone = $timeZoneState;

    let startTime = 0;

    // Timer
    function startTimer() {
        startTime = Date.now();
    }

    function stopTimer() {
        let totalTime = (Date.now() - startTime) / 1000;
        console.log("Finished in " + totalTime + " sec");

        // save totalTime to firestore
        if (!hasAdminAccess) {
            let timerCollectionRef = db.collection('timer');
            timerCollectionRef.add({
                user: displayName,
                time: totalTime
            })
            .catch((error) => {
                console.error("Error adding document to timer db: ", error);
            });
        }
    }

    // CONCEPT: Profile (Auth / Login)
    onMount(() => {
        onAuthStateChanged( auth, (user) => {
            displayName = user.displayName;
            hasAdminAccess = user.displayName == 'laurenwattendorfadmin' || user.displayName == 'tygeriadmin';
        }, (error) => {
            console.log(error);
        });
        startTimer();
    });

    // CONCEPT: Calendar, Timeslots, Events
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
        height: '500px',
        headerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: 'day', dayGridMonth: 'month', 
                     listDay: 'list', listWeek: 'list', listMonth: 'list', 
                     listYear: 'list', resourceTimeGridDay: 'day', 
                     resourceTimeGridWeek: 'week', timeGridDay: 'day', 
                     timeGridWeek: 'week'},
        allDaySlot: false,
        selectBackgroundColor: availableColor,
        dayHeaderFormat: {weekday: 'long'}
    };

    selectionState.subscribe(value => {
        options.selectBackgroundColor = value.available ? availableColor : ifnecessaryColor;
    })

    // Handle modal induced deletion
    function handleEventDeletion() {
        if (cur_event != -1) {
            ec.removeEventById(cur_event);
            deleteDoc(doc(db, "events", cur_event));
        }
        cur_event = -1;
        open = false;
    }

    // Handle modal induced duplication
    function handleEventDuplication () {
        let new_event = ec.getEventById(cur_event)
        ec.addEvent({
            id: nanoid(),
            title: new_event.title,
            start: new_event.start,
            end: new_event.end,
            color: myState.available ? availableColor : ifnecessaryColor,
            eventBackgroundColor: myState.available ? availableColor : ifnecessaryColor
        })
        cur_event = -1;
        open = false
    }

    // Handle creation of new event across timeslots
    // CONCEPT: Timeslots, Events
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

    // Open modal from event click
    const handleEventClick = (info) => {
        cur_event = info.event.id;
        open = true;
    }

    // Save events to DB
    function handleSaveEvents() {
        if (options.events != [] && options.events[0] != undefined) { 
            let events = options.events[0].getEvents();
            events.forEach((event) => {
                let tzDiff = (covertShortToDiff(timeZone) + 5) * 60; // calculates the diff to EST
                let collectionRef = db.collection("events");
                let docRef = collectionRef.doc(event.id);
                let startTime = convertTimeToIndex(event.start) + tzDiff;
                let endTime = convertTimeToIndex(event.end) + tzDiff;
                if (startTime >= 0 && endTime <= 10080) { // must be within the week in EST
                    let obj = {
                        available: event.backgroundColor == availableColor, 
                        location: event.title == 'Anywhere' ? 0 : event.title == 'Zoom Only' ? 1 : 2, 
                        startTime: startTime, 
                        endTime: endTime,
                    }
                    docRef.get().then((docSnapshot) => {
                        console.log('events');
                        if (docSnapshot.exists) {
                            docRef.update(obj)
                        } else {
                            collectionRef.add({...obj, id: event.id})
                        }
                    })
                } 
            }) 
        }
    }

    // CONCEPT: Profile (Auth / Login), Event
    async function handleSaveAndExit() {
        handleSaveEvents();
        updateTimeZone('-05:00'); // always display final times in EST
        stopTimer();
        setAvailability(false); // reset availability store to false
        updateLocation(0); // reset availability store to false
        await auth.signOut();
        await goto('/');
    }

    function convertTimeToIndex(time) {
        let diffInSecs = (time-ec.getView().currentStart) / 1000;
        let diffInMin = diffInSecs / 60;
        return diffInMin
    }

    // Render results page upon Save and View
    async function handleSaveAndView() {
        handleSaveEvents();
        updateTimeZone('-05:00'); // always display final times in EST
        stopTimer();
        setAvailability(false); // reset availability store to false
        updateLocation(0); // reset availability store to false
        await goto('/results');
    }

    // Clear calendar in DB
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

    // Reset DB
    function clearAllEvents() {
        console.log("FIRESTORE DATABASE CLEARED!")
        options.events = [];
        db.collection("events").get().then(res => {
            res.forEach(element => {
                element.ref.delete();
            });
        });
        db.collection("timer").get().then(res => {
            res.forEach(element => {
                element.ref.delete();
            });
        });
    }

</script>

<div class="header-container">
    <div class="left-container">
        <Button on:click={handleClear} style="padding-right: 16px; margin-right: 16px;" kind="secondary" size="field">
            <Redo style="margin-right: 0.5rem;"/> Clear
        </Button>
    </div>
    <h6>{covertShortStrToText(timeZone)}</h6>
</div>

<Calendar bind:this={ec} {plugins} {options} />
  
<Modal
    bind:open
    modalHeading="Delete event"
    primaryButtonText="Delete"
    secondaryButtons={[{ text: "Cancel" }, { text: "Duplicate" }]}
    on:click:button--secondary={() => (open = false)}
    on:click:button--primary={() => (handleEventDeletion())}
    on:click:button--secondary={({ detail }) => {
        if (detail.text === "Cancel") open = false;
        if (detail.text === "Duplicate") handleEventDuplication();
    }}
    on:open
    on:close
    on:submit
  >
</Modal>

<div class="footer-container">
    <div class="buttonContainer">
        <button hidden={!hasAdminAccess} on:click={clearAllEvents}>Clear database</button>        
    </div>                
    <div class="buttonContainer">
    <Button size="field" kind="tertiary" on:click={handleSaveAndView}>Save and View Results</Button>        
    </div>
    <div class="buttonContainer">
        <Button size="field" on:click={handleSaveAndExit}>Save and Exit</Button>        
    </div>
</div>      

<style>
    :global(.header-container) {
        display: flex;
        justify-content: space-between;
    }
    :global(.left-container) {
        display: flex;
    }
    .footer-container {
        display: flex;
        justify-content: end;
        padding-top: 16px;
    }
    .buttonContainer {
        padding-left: 16px;
    }
    :global(h6) {
        justify-self: end;
        align-self: end;
    }
</style>
