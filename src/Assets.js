import map from "./assets/map.png";
// import map from "./assets/boundary-map.png";
import barriers_map from "./assets/barriers.png";
// import bulletsrc from "./assets/bullet.png";
import healthsrc from "./assets/health.png";
import healthbarsrc from "./assets/health bar.png";
import character from "./assets/tv man (1).png";
// import character from "./assets/robotFighter.png";
import enemySpriteSheet_url from "./assets/droidhead.png";
import portalSrc from "./assets/portal.png";
import gun_src from "./assets/guns/gun.png";
import rifle_src from "./assets/guns/rifle.png";
import toxic_src from "./assets/guns/toxic.png";
import blaster_src from "./assets/guns/blaster.png";
import coin_src from "./assets/coin.png";
import vending_src from "./assets/vending-machine.png";
import bullet_blue_src from "./assets/bullets/blue.png";
import bullet_red_src from "./assets/bullets/red.png";
import bullet_rifle1_src from "./assets/bullets/rifle.png";
import bullet_rifle2_src from "./assets/bullets/rifle2.png";
import bullet_green_src from "./assets/bullets/green.png";
import potion_src from "./assets/potion.png";

import horizontal_door_src from "./assets/Door Horizontal.png";
import vertical_door_src from "./assets/Door Vertical.png";

import plasmaShoot_src from "./assets/sounds/enemyShoot.mp3";
import bgm_src from "./assets/sounds/bgm.mp3";
import ui_select_src from "./assets/sounds/ui-select.mp3";

export let assets = {
	map: map,
	barriers: barriers_map,
	gun: gun_src,
	rifle: rifle_src,
	toxic: toxic_src,
	blaster: blaster_src,
	// bullet: bulletsrc,
	heath_base: healthbarsrc,
	healthsrc: healthsrc,
	character: character,
	enemy: enemySpriteSheet_url,
	portal: portalSrc,
	coin: coin_src,
	vending: vending_src,
	bullet_blue: bullet_blue_src,
	bullet_red: bullet_red_src,
	bullet_rifle1: bullet_rifle1_src,
	bullet_rifle2: bullet_rifle2_src,
	bullet_green: bullet_green_src,
	potion: potion_src,
	hDoor: horizontal_door_src,
	vDoor: vertical_door_src,
};

export let music = {
	plasmaShoot: { src: plasmaShoot_src, audio: null, volume: 0.7 },
	bgm: { src: bgm_src, audio: null, volume: 0.3 },
	ui_select: { src: ui_select_src, audio: null, volume: 0.7 },
};

let loadedCount = 0;
let totalAssets = Object.keys(assets).length + Object.keys(music).length;

function updateCount(onAssetsLoaded) {
	// console.log("Loaded: " + key);
	loadedCount++;
	if (loadedCount === totalAssets) {
		// this.loading = false; // All assets are loaded
		onAssetsLoaded(); // Callback to notify that loading is complete
		console.log("Assets Loaded");
		console.log(assets);
	}
}

export function assetLoader(onAssetsLoaded) {
	console.log(assets);

	Object.keys(assets).forEach((key) => {
		const img = new Image();
		img.src = assets[key];
		img.onload = () => {
			updateCount(onAssetsLoaded);
		};
		assets[key] = img;
	});

	Object.keys(music).forEach((key) => {
		const audio = new Audio(music[key].src);
		audio.volume = music[key].volume;
		// audio.volume = 1;
		// audio.volume = 0.03;
		audio.oncanplaythrough = () => {
			updateCount(onAssetsLoaded);
		};
		music[key].audio = audio;
	});
}
