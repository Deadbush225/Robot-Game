import map from "./assets/map.png";
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
};
let loadedCount = 0;

export function assetLoader(onAssetsLoaded) {
	console.log(assets);

	Object.keys(assets).forEach((key) => {
		const img = new Image();
		img.src = assets[key];
		img.onload = () => {
			// console.log("Loaded: " + key);
			loadedCount++;
			if (loadedCount === Object.keys(assets).length) {
				// this.loading = false; // All assets are loaded
				onAssetsLoaded(); // Callback to notify that loading is complete
				console.log("Assets Loaded");
				console.log(assets);
			}
		};
		assets[key] = img;
	});
}
