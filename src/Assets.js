import map from "./assets/map.png";
// import map from "./assets/boundary-map.png";
import barriers_map from "./assets/barriers.png";
// import bulletsrc from "./assets/bullet.png";
import healthsrc from "./assets/health.png";
import healthbarsrc from "./assets/health bar.png";
// import character from "./assets/robotFighter.png";
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

import tv_man from "./assets/characters/tv man (1).png";
import eve from "./assets/characters/eve-ghost-robot.png";
import gundam from "./assets/characters/gundam-avatar.png";

import enemySpriteSheet_url from "./assets/enemies/droidhead.png";
import enemyToaster_url from "./assets/enemies/toaster.png";
import enemyIceCube_url from "./assets/enemies/ice-cube.png";
import enemyRef_url from "./assets/enemies/refrigerator-tilesheet.png";

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

	character: tv_man,
	eve: eve,
	gundam: gundam,

	enemy: enemySpriteSheet_url,
	toaster: enemyToaster_url,
	ice_cube: enemyIceCube_url,
	ref: enemyRef_url,

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

// separated bgm and sfx para madaling ma-toggle
export let bgm = {
	bgm: { src: bgm_src, audio: null, volume: 0.3 },
};
export let sfx = {
	plasmaShoot: { src: plasmaShoot_src, audio: null, volume: 0.7 },
	ui_select: { src: ui_select_src, audio: null, volume: 0.7 },
};

let loadedCount = 0;
let totalAssets =
	Object.keys(assets).length +
	Object.keys(bgm).length +
	Object.keys(sfx).length;

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
	// Load images
	Object.keys(assets).forEach((key) => {
		const img = new Image();
		img.src = assets[key];
		img.onload = () => {
			updateCount(onAssetsLoaded);
		};
		assets[key] = img;
	});

	// Load BGM
	Object.keys(bgm).forEach((key) => {
		const audio = new Audio(bgm[key].src);
		audio.volume = bgm[key].volume;
		audio.oncanplaythrough = () => {
			updateCount(onAssetsLoaded);
		};
		bgm[key].audio = audio;
	});

	// Load SFX
	Object.keys(sfx).forEach((key) => {
		const audio = new Audio(sfx[key].src);
		audio.volume = sfx[key].volume;
		audio.oncanplaythrough = () => {
			updateCount(onAssetsLoaded);
		};
		sfx[key].audio = audio;
	});
}
