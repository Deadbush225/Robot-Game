import { music } from "./Assets";

class SoundManager {
	constructor() {
		this.sounds = music;
		this.muted = false;
	}

	// load(name, src, volume = 1.0) {
	// 	const audio = new Audio(src);
	// 	audio.volume = volume;
	// 	this.sounds[name] = audio;
	// }

	play(name, loop = false) {
		if (this.muted) return;
		const sound = this.sounds[name].audio;
		if (sound) {
			sound.currentTime = 0;
			sound.loop = loop;
			sound.play();
		}
	}

	stop(name) {
		const sound = this.sounds[name].audio;
		if (sound) {
			sound.pause();
			sound.currentTime = 0;
		}
	}

	setVolume(name, volume) {
		const sound = this.sounds[name].audio;
		if (sound) {
			console.log("SETTING VOLUME");
			sound.volume = volume;
		}
	}

	mute() {
		this.muted = true;
		Object.values(this.sounds).forEach((audio) => (audio.audio.muted = true));
	}

	unmute() {
		this.muted = false;
		Object.values(this.sounds).forEach((audio) => (audio.audio.muted = false));
	}
}

export let soundManager = new SoundManager();
