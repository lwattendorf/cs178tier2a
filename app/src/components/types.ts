import { writable } from 'svelte/store';
export let availableColor = '#298073';
export let ifnecessaryColor = '#619d4b';
export let lastRankColor = '#F1A208';

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

export const timeZoneState = writable<string>('-05:00');

export function updateTimeZone(timeZone: string) {
    timeZoneState.update(() => timeZone);
}

export function covertShortStrToText(timeZone) {
    return timeZones.find(o => o.shortStr === timeZone).text;
}

export function covertShortToDiff(timeZone) {
    return timeZones.find(o => o.shortStr === timeZone).diff;
}

export let timeZones = [
    {shortStr: "-12:00", text: "Eniwetok, Kwajalein", diff: -12},
    {shortStr: "-11:00", text: "Midway Island, Samoa", diff: -11},
    {shortStr: "-10:00", text: "Hawaii", diff: -10},
    {shortStr: "-09:50", text: "Taiohae", diff: -9.5},
    {shortStr: "-09:00", text: "Alaska", diff: -9},
    {shortStr: "-08:00", text: "Pacific Time (US & Canada)", diff: -8},
    {shortStr: "-07:00", text: "Mountain Time (US & Canada)", diff: -7},
    {shortStr: "-06:00", text: "Central Time (US & Canada), Mexico City", diff: -6},
    {shortStr: "-05:00", text: "Eastern Time (US & Canada), Bogota, Lima", diff: -5},
    {shortStr: "-04:50", text: "Caracas", diff: -4.5},
    {shortStr: "-04:00", text: "Atlantic Time (Canada), Caracas, La Paz", diff: -4},
    {shortStr: "-03:50", text: "Newfoundland", diff: -3.5},
    {shortStr: "-03:00", text: "Brazil, Buenos Aires, Georgetown", diff: -3},
    {shortStr: "-02:00", text: "Mid-Atlantic", diff: -2},
    {shortStr: "-01:00", text: "Azores, Cape Verde Islands", diff: -1},
    {shortStr: "+00:00", text: "(GMT) Western Europe Time, London, Lisbon, Casablanca", diff: 0},
    {shortStr: "+01:00", text: "Brussels, Copenhagen, Madrid, Paris", diff: 1},
    {shortStr: "+02:00", text: "Kaliningrad, South Africa", diff: 2},
    {shortStr: "+03:00", text: "Baghdad, Riyadh, Moscow, St. Petersburg", diff: 3},
    {shortStr: "+03:50", text: "Tehran", diff: 3.5},
    {shortStr: "+04:00", text: "Abu Dhabi, Muscat, Baku, Tbilisi", diff: 4},
    {shortStr: "+04:50", text: "Kabul", diff: 4.5},
    {shortStr: "+05:00", text: "Ekaterinburg, Islamabad, Karachi, Tashkent", diff: 5},
    {shortStr: "+05:50", text: "Bombay, Calcutta, Madras, New Delhi", diff: 5.5},
    {shortStr: "+05:75", text: "Kathmandu, Pokhara", diff: 5.75},
    {shortStr: "+06:00", text: "Almaty, Dhaka, Colombo", diff: 6},
    {shortStr: "+06:50", text: "Yangon, Mandalay", diff: 6.5},
    {shortStr: "+07:00", text: "Bangkok, Hanoi, Jakarta", diff: 7},
    {shortStr: "+08:00", text: "Beijing, Perth, Singapore, Hong Kong", diff: 8},
    {shortStr: "+08:75", text: "Eucla", diff: 8.75},
    {shortStr: "+09:00", text: "Tokyo, Seoul, Osaka, Sapporo, Yakutsk", diff: 9},
    {shortStr: "+09:50", text: "Adelaide, Darwin", diff: 9.5},
    {shortStr: "+10:00", text: "Eastern Australia, Guam, Vladivostok", diff: 10},
    {shortStr: "+10:50", text: "Lord Howe Island", diff: 10.5},
    {shortStr: "+11:00", text: "Magadan, Solomon Islands, New Caledonia", diff: 11},
    {shortStr: "+11:50", text: "Norfolk Island", diff: 11.5},
    {shortStr: "+12:00", text: "Auckland, Wellington, Fiji, Kamchatka", diff: 12},
    {shortStr: "+12:75", text: "Chatham Islands", diff: 12.75},
    {shortStr: "+13:00", text: "Apia, Nukualofa", diff: 13},
    {shortStr: "+14:00", text: "Line Islands, Tokelau", diff: 14}];
