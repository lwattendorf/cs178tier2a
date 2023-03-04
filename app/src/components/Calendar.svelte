<script>
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import Interaction from '@event-calendar/interaction'
    import '@event-calendar/core/index.css';
	import { get_current_component } from 'svelte/internal';
    import { selectionState } from './types.ts';
    import { Button, Modal } from "carbon-components-svelte";


    let idCount = 0;

    let open = false;
    let delete_event = false;
    let cur_event;

    $: myState = $selectionState;

    let ec;
    // let color = myState.available ? 'green' : 'yellowgreen';
    let plugins = [TimeGrid, Interaction];
    let options = {
        eventDragStart: (info) => {console.log(info.view)},
        eventDragStop: (info) => {console.log(info.view)},
        select: (info) => (handleSelection(info)),
        eventClick: (event) => (handleEventClick(event)),
        // dateClick: ({date: dateTime}) => {handleDateTimeClick(dateTime)},
        view: 'timeGridWeek',
        slotDuration: '00:15',
        editable: true,
        events: [
            // events added here using handleDateTimeClick()
        ],
        selectable: true,
        height: '600px',
        headerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: 'day', dayGridMonth: 'month', 
                     listDay: 'list', listWeek: 'list', listMonth: 'list', 
                     listYear: 'list', resourceTimeGridDay: 'day', 
                     resourceTimeGridWeek: 'week', timeGridDay: 'day', 
                     timeGridWeek: 'week'},
        allDaySlot: false,
        selectBackgroundColor: "green"
    };

    function clear() {
        options.events = [];
    }

    function handleEventDeletion() {
        if (cur_event != -1) {
            ec.removeEventById(cur_event);
        }
        cur_event = -1;
        open = false;
    }

    const handleSelection = (time) => {
        options.selectBackgroundColor = myState.available ? 'yellowgreen' : 'green';
        ec.addEvent({
            id: idCount,
            title: myState.location == 0 ? 'Anywhere': myState.location == 1 ? 'Zoom Only': 'SEC',
            start: time.start,
            end: time.end,
            color: myState.available ? 'green' : 'yellowgreen',
            eventBackgroundColor: myState.available ? 'green' : 'yellowgreen'
        })
        idCount += 1
        options.events.push(ec)
        console.log("Event Added")
    }
    const handleEventClick = (info) => {
        options.selectBackgroundColor = myState.available ? 'green' : 'yellowgreen';
        console.log("event click!")
        open = true;
        cur_event = info.event.id;
    }

    function handleClose() {
        open = false;
        cur_event = -1;
    }
    
    import {
      ContextMenu,
      ContextMenuDivider,
      ContextMenuRadioGroup,
      ContextMenuOption,
    } from "carbon-components-svelte";
  
    let target;
    let selectedAvail = "0";
    let selectedLoc = "0";

</script>

<button on:click={clear}>Clear</button>
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

