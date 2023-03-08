<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import '@event-calendar/core/index.css';
    import { db } from '../firebase.js';
    import { collection, getDocs } from "firebase/firestore";
    import chroma from "chroma-js"
    import { meetingIntervalState, 
            topTimesState, 
            timeZoneState, 
            covertShortStrToText, 
            availableColor, 
            lastRankColor } from './types.ts';
    import { Button, Row, Column } from "carbon-components-svelte";
    import { goto } from "$app/navigation";
    import { auth } from '../firebase.js';
    import { onMount } from 'svelte';

    // CONCEPT: Calendar
    // Set up results calendar as non-interactive
    let colorScale = [];
    let objUrl;
    let ec;
    let plugins = [TimeGrid];
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
        selectable: false,
        height: '500px',
        headerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: 'day', dayGridMonth: 'month', 
                     listDay: 'list', listWeek: 'list', listMonth: 'list', 
                     listYear: 'list', resourceTimeGridDay: 'day', 
                     resourceTimeGridWeek: 'week', timeGridDay: 'day', 
                     timeGridWeek: 'week'},
        allDaySlot: false,
        selectBackgroundColor: availableColor
    };

    // Generate URL for downloading timing data 
    // Note: Timing download button is disabled for publicly hosted app
    onMount(() => {
        createExportCSVUrl();
    });

    // Subscribe to global stores for selected menu bar state
    $: meetingLength = $meetingIntervalState;
    $: timeZone = $timeZoneState;
    $: topTimes = $topTimesState;
    $: numEvents = topTimes == 0 ? 3 : topTimes == 1 ? 5 : 10;

    meetingIntervalState.subscribe(() => {
        options.events = [];
        populateEvents();
    })

    topTimesState.subscribe(() => {
        options.events = [];
        populateEvents();
    })

    // Gets inputted availability from firestore and generates the top n (topTimes)
    // events to be displayed on the calendar
    async function populateEvents() {
        let events = [];

        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach(doc => {
            let docData = doc.data()
            if (docData.location != 2) {
                events.push({
                    start: docData.startTime,
                    end: docData.endTime,
                    zoom: docData.locaiton == 1,
                    available: docData.available ? 1 : 0.5,
                })   
            }
        });

        let newEvents = findOverlaps(events);

        colorScale = chroma.scale([availableColor,lastRankColor]).mode('lch').colors(numEvents);
        newEvents.forEach(event => {
            ec.removeEventById(event.startTime);
            ec.addEvent({
                id: event.startTime,
                title: eventTitle(event),
                start: event.startTime,
                end: event.endTime,
                color: colorScale[event.rank-1]
            });
        })
        options.events.push(ec)
    }

    // helper function for naming individual events
    function eventTitle(event) {
        let rankString = rankToString(event.rank) + " choice";
        let numAvailableString = event.numAvailable + " available";
        let locationString = event.zoomOptionNeeded ? 'Needs Zoom Option': "Any Location";
        return rankString + "\n" + numAvailableString + "\n" + locationString;
    }

    // helper function for displaying rank of events
    function rankToString(i) {
        return i == 1 ? '1st' : i == 2 ? '2nd' : i == 3 ? '3rd' : i + "th";
    }

    // helper function for converting "index" (how start and end times are encoded in the firestore)
    // to UTC time to be displayed on calendar
    function convertIndexToTime(index) {
        return new Date(index * 15 * 60 * 1000 + ec.getView().currentStart.getTime());
    }


    // helper function to calculate the events with the maximum number of people available
    function findOverlaps(v) {
        // indexing convention used to encode time blocks of the week into indices 0->672
        // (7 days per week * 24 hours / day * 4 fifteen minute blocks / hr = 672)
        var timeArray = new Array(672).fill(0);
        var zoomArray = new Array(672).fill(false);
        var interval = meetingLength == 0 ? 60 : meetingLength == 1 ? 30 : 15;
        var intervalIndex = interval / 15;

        // increments timeArray[i] if someone is available for time i
        v.forEach(event => {
            let startTimeIndex = event.start == 0 ? 0 : event.start/15;
            let endTimeIndex =  event.end/15;
            while (startTimeIndex < endTimeIndex) {
                if (startTimeIndex + intervalIndex < endTimeIndex) {
                    timeArray[startTimeIndex] += event.available;
                    zoomArray[startTimeIndex] = zoomArray[startTimeIndex] || event.zoom === true;
                }
                startTimeIndex += meetingLength == 0 ? 4 : meetingLength == 1 ? 2 : 1;
            }
        })

        let sortableArray = [];
        for (let interval = 0; interval < timeArray.length; interval++) {
            if (timeArray[interval] > 0) {
                sortableArray.push({
                    startTime: convertIndexToTime(interval),
                    endTime: convertIndexToTime(interval + intervalIndex),
                    numAvailable: timeArray[interval],
                    zoomOptionNeeded: zoomArray[interval],
                })
            }
        }

        // add rankings to top events, i.e. if there are several events with 
        // n people available, all will have the same rank ("xth choice")
        sortableArray.sort((a,b) => b.numAvailable - a.numAvailable);
        let maxAvailable = sortableArray[0].numAvailable;
        let rank = 1;
        for (let i = 0; i < sortableArray.length; i++) {
            if (sortableArray[i].numAvailable != maxAvailable) {
                rank += 1;
                maxAvailable = sortableArray[i].numAvailable;
            }
            sortableArray[i] = {
                ...sortableArray[i],
                rank: rank,
            }
        }

        // returns only the top numEvents to be displayed on the calendar
        return sortableArray.slice(0, numEvents);
    }

    // Generate URL for downloading timing data 
    // Note: Timing download button is disabled for publicly hosted app
    async function createExportCSVUrl() {
        const querySnapshot = await getDocs(collection(db, "timer"));
        let timerArray = [];
        querySnapshot.forEach((doc, i)=> {
            timerArray.push({ "user": doc.data().user, "time (sec)": doc.data().time})   
        });
        const titleKeys = Object.keys(timerArray[0])
        const cleanedData = []
        cleanedData.push(titleKeys)
        timerArray.forEach(item => {
            cleanedData.push(Object.values(item))  
        })
        let csvContent = '';
        cleanedData.forEach(row => {
            csvContent += row.join(',') + '\n'
        })
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
        objUrl = URL.createObjectURL(blob)
    }
    
    // CONCEPT: Profile (auth/login)
    // logout and return to login screen when user clicks "done"
    async function logout() {
        auth.signOut();
        await goto('/');
    }
</script>

<div class="header-container">
    <div class="left-container">
    </div>
    <h6>{covertShortStrToText(timeZone)}</h6>
</div>

<Calendar bind:this={ec} {plugins} {options} />

<Row padding>
    <Column>
    <div class="container key">
        {#each colorScale as color}
        <div class="colorScale" style="background-color: {color}; padding: 12px; color: white">
            {rankToString(colorScale.indexOf(color)+1)} 
        </div>
        {/each}
    </div>
    </Column>
    <Column/>
    <Column>
        <div class="container">
            <!-- FOR IN-CLASS COMPETITION ONLY:
            <div class="buttonContainer">
                <Button size="field" kind="tertiary" href={objUrl}>Export Timing Data</Button>            
            </div> -->
            <div class="buttonContainer">
            <Button kind="danger" size="field" on:click={logout}>Done</Button>              
            </div>
        </div>  
    </Column>
</Row>

<style>
    .container {
        display: flex;
        justify-content: end;
    }
    .key {
        justify-content: start;
    }
    .buttonContainer {
        padding-left: 16px;
    }
</style>