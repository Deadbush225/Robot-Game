import map from "./assets/map.png";
import barriers_map from "./assets/barriers.png";
import gun from "./assets/gun.png";
import bulletsrc from "./assets/bullet.png";
import healthsrc from "./assets/health.png";
import healthbarsrc from "./assets/health bar.png";
import character from "./assets/robotFighter.png";
import enemySpriteSheet_url from "./assets/enemy.png";

export let assets = {
	map: map,
	barriers: barriers_map,
	gun: gun,
	bullet: bulletsrc,
	heath_base: healthbarsrc,
	healthsrc: healthsrc,
	character: character,
	enemy: enemySpriteSheet_url,
};
let loadedCount = 0;

export function assetLoader(onAssetsLoaded) {
	console.log("TEST");

	console.log(assets);

	Object.keys(assets).forEach((key) => {
		const img = new Image();
		img.src = assets[key];
		img.onload = () => {
			console.log("Loaded: " + key);
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
