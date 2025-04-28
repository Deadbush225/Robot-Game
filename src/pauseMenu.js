import { soundManager } from "./Sounds";

let isPaused = false;
let musicEnabled = true;
let sfxEnabled = true;

export function togglePause(game) {
	if (!game) {
		console.error("Game instance is not provided to togglePause.");
		return false;
	}

	game.isPaused = !game.isPaused;

	if (game.isPaused) {
		game.pause();
	} else {
		game.resume();
	}
	return game.isPaused;
}

export function toggleMusic() {
	musicEnabled = !musicEnabled;

	if (musicEnabled) {
		soundManager.unmute("bgm"); // Unmute background music
		soundManager.setVolume("bgm", 0.4, "bgm"); // Set volume to 30%
	} else {
		soundManager.mute("bgm"); // Mute background music
	}

	// console.log(`Music ${musicEnabled ? "enabled" : "disabled"}`);
	return musicEnabled;
}

export function toggleSFX() {
	sfxEnabled = !sfxEnabled;

	if (sfxEnabled) {
		soundManager.unmute("sfx"); // Unmute sound effects
	} else {
		soundManager.mute("sfx"); // Mute sound effects
	}

	// console.log(`SFX ${sfxEnabled ? "enabled" : "disabled"}`);
	return sfxEnabled;
}
