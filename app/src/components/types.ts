import { writable } from 'svelte/store';

export interface SelectionState {
    available: boolean;
    location: number;
}

export const selectionState = writable<SelectionState>({available: true, location: 0});
export function updateAvailability() {
    selectionState.update(n => ({available: !n.available, location: n.location}));
    console.log("Updated Availability");
}
export function updateLocation(loc) {
    selectionState.update(n => ({available: n.available, location: loc}));
}