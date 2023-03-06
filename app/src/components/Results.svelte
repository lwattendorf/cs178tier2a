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
            ifnecessaryColor } from './types.ts';
    import { Button, Row, Column } from "carbon-components-svelte";
    import { goto } from "$app/navigation";
    import { auth } from '../firebase.js';
    import { onMount } from 'svelte';

    $: meetingLength = $meetingIntervalState;
    $: timeZone = $timeZoneState;
    $: topTimes = $topTimesState;
    $: numEvents = topTimes == 0 ? 3 : topTimes == 1 ? 5 : 10;
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
        height: '730px',
        headerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: 'day', dayGridMonth: 'month', 
                     listDay: 'list', listWeek: 'list', listMonth: 'list', 
                     listYear: 'list', resourceTimeGridDay: 'day', 
                     resourceTimeGridWeek: 'week', timeGridDay: 'day', 
                     timeGridWeek: 'week'},
        allDaySlot: false,
        selectBackgroundColor: availableColor
    };

    onMount(() => {
        exportInputTimer();
    });

    meetingIntervalState.subscribe(() => {
        options.events = [];
        populateEvents();
    })

    topTimesState.subscribe(() => {
        options.events = [];
        populateEvents();
    })

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

        colorScale = chroma.scale([availableColor,ifnecessaryColor]).mode('lch').colors(numEvents);

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

    function eventTitle(event) {
        let rankString = rankToString(event.rank) + " choice";
        let numAvailableString = event.numAvailable + " available";
        let locationString = event.zoomOptionNeeded ? 'Needs Zoom Option': "Any Location";
        return rankString + "\n" + numAvailableString + "\n" + locationString;
    }

    function convertIndexToTime(index) {
        return new Date(index * 15 * 60 * 1000 + ec.getView().currentStart.getTime());
    }

    function findOverlaps(v) {
        var timeArray = new Array(672).fill(0);
        var zoomArray = new Array(672).fill(false);
        var interval = meetingLength == 0 ? 60 : meetingLength == 1 ? 30 : 15;
        var intervalIndex = interval / 15;
        v.forEach(event => {
            let startTimeIndex = event.start == 0 ? 0 : event.start/15;
            let endTimeIndex =  event.end/15;
            while (startTimeIndex < endTimeIndex) {
                if (startTimeIndex + intervalIndex < endTimeIndex) {
                    timeArray[startTimeIndex] += event.available;
                    zoomArray[startTimeIndex] = zoomArray[startTimeIndex] || event.zoom === true;
                }
                startTimeIndex += 1;
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
        return sortableArray.slice(0, numEvents);
    }

    async function logout() {
        auth.signOut();
        await goto('/');
    }

    function rankToString(i) {
        return i == 1 ? '1st' : i == 2 ? '2nd' : i == 3 ? '3rd' : i + "th";
    }

    async function exportInputTimer() {
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
            <div class="buttonContainer">
                <Button size="field" kind="tertiary" href={objUrl}>Export Input Timing Data</Button>            
            </div>
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