// filepath: src/store.js
import { writable } from "svelte/store";

export const isGameOver = writable(false);
export const currentRoom = writable("");
