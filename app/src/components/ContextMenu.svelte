<script>
    import {
      ContextMenu,
      ContextMenuDivider,
      ContextMenuRadioGroup,
      ContextMenuOption,
    } from "carbon-components-svelte";
  
    let target;
    let selectedAvail = "0";
    let selectedLoc = "0";

    function reconfigure() {
        console.log("Changed availability/location selection...")
        console.log("Availability: " + selectedAvail);
        console.log("Location: " + selectedLoc);
    }
  </script>
  
  <ContextMenu id={"contextmenu"} {target} on:open={console.log("opened context menu")} on:close={()=>reconfigure()}>
    <ContextMenuRadioGroup bind:selectedId={selectedAvail} labelText="Style options">
        <ContextMenuOption indented id="0" labelText="Available" selected />
        <ContextMenuOption id="1" labelText="If necessary" />
    </ContextMenuRadioGroup>
    <ContextMenuDivider />
    <ContextMenuRadioGroup bind:selectedId={selectedLoc} labelText="Style options">
      <ContextMenuOption id="0" labelText="Any Location" selected />
      <ContextMenuOption id="1" labelText="Zoom Only" />
      <ContextMenuOption id="2" labelText="SEC Only" />
    </ContextMenuRadioGroup>
    <ContextMenuDivider />
    <ContextMenuOption indented kind="danger" labelText="Delete" />
  </ContextMenu>
  
  <div>
    <p bind:this={target}>Right click this element</p>
  </div>
  
  <style>
    div {
        padding: 16px;
        position: absolute;
        width: calc(100% - var(--cds-spacing-05));
        height: calc(100% - var(--cds-spacing-06));
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--cds-text-02);
    }
  
    p {
        outline: 1px solid var(--cds-interactive-01);
    }
  </style>