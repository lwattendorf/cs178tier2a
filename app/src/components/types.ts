import { writable } from 'svelte/store';
export let availableColor = '#298073';
export let ifnecessaryColor = '#F1A208';

interface SelectionState {
    available: boolean;
    location: number;
}

export const selectionState = writable<SelectionState>({available: true, location: 0});

export function updateAvailability() {
    selectionState.update(n => ({available: !n.available, location: n.location}));
}

export function updateLocation(loc: number) {
    selectionState.update(n => ({available: n.available, location: loc}));
}

export const meetingIntervalState = writable<number>(0);

export function updateMeetingInterval(newInterval: number) {
    meetingIntervalState.update(() => newInterval);
}

export const topTimesState = writable<number>(0);

export function updateTopTimes(newNum: number) {
    topTimesState.update(() => newNum);
}
