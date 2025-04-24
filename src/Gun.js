import { assets } from "./Assets";

let gunDictionary;

export let guns = [];

function initializeGuns() {
	gunDictionary = {
		pistol: {
			damage: 20,
			fireRate: 2,
			range: 300,
			imageSrc: assets.gun,
			bullet: { src: assets.bullet_blue, effect: "" },
			spread: 1,
			rows: 0,
		},
		rifle: {
			damage: 18,
			fireRate: 5,
			range: 500,
			imageSrc: assets.rifle,
			bullet: { src: assets.bullet_rifle1, effect: "freeze" },
			spread: 2,
			rows: 0,
		},
		shotgun: {
			damage: 15,
			fireRate: 1,
			range: 200,
			imageSrc: assets.blaster,
			bullet: { src: assets.bullet_red, effect: "life-steal" },
			spread: 3,
			rows: 0,
		},
		toxic: {
			damage: 10,
			fireRate: 1,
			range: 200,
			imageSrc: assets.toxic,
			bullet: { src: assets.bullet_green, effect: "" },
			spread: 3,
			rows: 1,
		},
	};
}

export class Gun {
	constructor(name) {
		if (!gunDictionary) {
			initializeGuns();
		}

		this.name = name; // Name of the gun

		const gunProps = gunDictionary[name];
		console.log(gunProps);
		this.damage = gunProps.damage; // Damage per shot
		this.fireRate = gunProps.fireRate; // Shots per second
		this.range = gunProps.range; // Range of the gun
		this.image = gunProps.imageSrc; // Source image for the gun
		this.bullet = gunProps.bullet;
		this.spread = gunProps.spread;
		this.rows = gunProps.rows;
		this.size = 50 * 1.2;
	}

	// Draw the gun on the ground
	draw(gl, x, y) {
		gl.drawImage(
			this.image,
			x - this.size / 2,
			y - this.size / 2,
			this.size,
			this.size
		);
	}
}

export class GunMachine {
	constructor() {
		// Internal dictionary of gun properties

		this.spawnedGuns = []; // List of guns currently spawned in the world
	}

	// Randomly summon a gun at a specific position
	summonGun(x, y) {
		const gunNames = Object.keys(gunDictionary);
		const randomGunName = gunNames[Math.floor(Math.random() * gunNames.length)];

		const newGun = new Gun(randomGunName);

		this.spawnedGuns.push({ gun: newGun, x, y }); // Add the gun to the spawned list
	}

	// Draw all spawned guns
	draw(gl, camera, canvas, character) {
		this.spawnedGuns.forEach(({ gun, x, y }) => {
			const screenX =
				(x - (character.realX - camera.width / 2)) *
				(canvas.width / camera.width);
			const screenY =
				(y - (character.realY - camera.height / 2)) *
				(canvas.height / camera.height);
			gun.draw(gl, screenX, screenY);
		});
	}

	// Check if the player stepped on a gun
	checkPlayerCollision(player) {
		for (let i = 0; i < this.spawnedGuns.length; i++) {
			const { gun, x, y } = this.spawnedGuns[i];
			const distance = Math.sqrt(
				Math.pow(player.realX - x, 2) + Math.pow(player.realY - y, 2)
			);

			if (distance < 50) {
				// Store the current gun reference
				const currentGun = player.currentGun;

				// Update player's gun
				player.currentGun = gun;

				// Replace the picked up gun with the dropped gun
				if (currentGun) {
					this.spawnedGuns[i] = {
						gun: currentGun,
						x: player.realX + 60,
						y: player.realY + 60,
					};
				} else {
					// If player had no gun, remove the picked up gun
					this.spawnedGuns.splice(i, 1);
				}

				// Break since we only want to pick up one gun at a time
				break;
			}
		}
	}
}
