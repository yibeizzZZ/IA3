// Part 11: a simulated data layer. Read and test.
// In Class 19 this becomes a real request to Firebase. For now it pretends:
// it waits a moment, then hands back the events, or fails.

import { events } from "./events.js";

// Flip these to test the other states. Put them back to false afterwards.
export const SIMULATE_FAILURE = false;
export const SIMULATE_EMPTY = false;

// Returns a Promise: a value that arrives later. await it to get the events.
export function loadEvents() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error("Could not reach the events service."));
      } else if (SIMULATE_EMPTY) {
        resolve([]);
      } else {
        resolve(events);
      }
    }, 700);
  });
}
