// filepath: src/store.js
import { writable } from "svelte/store";

export const isGameOver = writable(false);
export const currentRoom = writable("");
export const spawnPointX = writable(300);
export const spawnPointY = writable(5689);
export const showEndMessage = writable(false);
export const showLeaderBoards = writable(false);
