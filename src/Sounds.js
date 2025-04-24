import { bgm, sfx } from "./Assets";

class SoundManager {
    constructor() {
        this.bgm = bgm;
        this.sfx = sfx;
        this.muted = { bgm: false, sfx: false };
    }

    play(name, loop = false, type = "sfx") {
        if (this.muted[type]) return;
        
        const sound = type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
        if (sound) {
            sound.currentTime = 0;
            sound.loop = loop;
            sound.play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        } else {
            console.error(`Sound ${name} not found in ${type}.`);
        }
    }

    stop(name, type = "sfx") {
        const sound = type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    setVolume(name, volume, type = "sfx") {
        const sound = type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
        if (sound) {
            console.log(`Setting volume for ${name} to ${volume}`);
            sound.volume = volume;
        }
    }

    mute(type) {
        this.muted[type] = true;
        const sounds = type === "bgm" ? this.bgm : this.sfx;
        Object.values(sounds).forEach(audio => {
            if (audio.audio) audio.audio.muted = true;
        });
    }

    unmute(type) {
        this.muted[type] = false;
        const sounds = type === "bgm" ? this.bgm : this.sfx;
        Object.values(sounds).forEach(audio => {
            if (audio.audio) audio.audio.muted = false;
        });
    }
    
    pauseAll() {
        Object.values(this.sfx).forEach(audio => {
            if (audio.audio && !audio.audio.paused) audio.audio.pause();
        });
    }
    
    resumeAll() {
        // Resume BGM if it was playing
        Object.values(this.bgm).forEach(audio => {
            if (audio.audio && !this.muted.bgm && audio.audio.loop) audio.audio.play();
        });
    }
}

export let soundManager = new SoundManager();

// import { music } from "./Assets";

// class SoundManager {
// 	constructor() {
// 		this.sounds = music;
// 		this.muted = false;
// 	}

// 	// load(name, src, volume = 1.0) {
// 	// 	const audio = new Audio(src);
// 	// 	audio.volume = volume;
// 	// 	this.sounds[name] = audio;
// 	// }

// 	play(name, loop = false) {
// 		if (this.muted) return;
// 		const sound = this.sounds[name].audio;
// 		if (sound) {
// 			sound.currentTime = 0;
// 			sound.loop = loop;
// 			sound.play();
// 		}
// 	}

// 	stop(name) {
// 		const sound = this.sounds[name].audio;
// 		if (sound) {
// 			sound.pause();
// 			sound.currentTime = 0;
// 		}
// 	}

// 	setVolume(name, volume) {
// 		const sound = this.sounds[name].audio;
// 		if (sound) {
// 			console.log("SETTING VOLUME");
// 			sound.volume = volume;
// 		}
// 	}

// 	mute() {
// 		this.muted = true;
// 		Object.values(this.sounds).forEach((audio) => (audio.audio.muted = true));
// 	}

// 	unmute() {
// 		this.muted = false;
// 		Object.values(this.sounds).forEach((audio) => (audio.audio.muted = false));
// 	}
// }

// export let soundManager = new SoundManager();
