import { getRandomAllowed } from "./boundary";
import { assets } from "./Assets";
import { soundManager } from "./Sounds";

export class PotionManager {
	constructor() {
		this.potions = []; // Array to store potions
		this.potionWidth = 22;
		this.potionHeight = 37;
		this.frameCount = 8; // Total frames in the animation
		this.frameDuration = 150; // Duration of each frame in milliseconds
	}

	// Generate a potion at a random allowed position
	generatePotion() {
		const { x, y } = getRandomAllowed(); // Get a random allowed position
		this.potions.push({
			x,
			y,
			frameIndex: 0, // Start at the first frame
			frameTimer: 0, // Timer for animation
		});
	}

	summonPotion(x, y) {
		this.potions.push({ x, y, frameIndex: 0, frameTimer: 0 });
	}

	// Update potion animation
	update(deltaTime) {
		this.potions.forEach((potion) => {
			potion.frameTimer += deltaTime * 1000;
			if (potion.frameTimer >= this.frameDuration) {
				potion.frameTimer = 0;
				potion.frameIndex = (potion.frameIndex + 1) % this.frameCount; // Loop through frames
			}
		});
	}

	// Check if the player collects a potion
	checkCollision(player) {
		for (let i = this.potions.length - 1; i >= 0; i--) {
			const potion = this.potions[i];
			const distance = Math.sqrt(
				Math.pow(player.realX - (potion.x + (this.potionWidth * 1.2) / 2), 2) +
					Math.pow(player.realY - (potion.y + (this.potionHeight * 1.2) / 2), 2)
			);

			if (distance < 80) {
				// Player collects the potion
				soundManager.play("collectPotions");
				this.potions.splice(i, 1); // Remove the potion from the array

				if (player.healthBar.health + 20 > player.healthBar.originalHealth) {
					// Add to inventory if healing would exceed max health
					player.potions++;
				} else {
					player.heal(20); // Heal the player
				}
			}
		}
	}

	// Draw potions on the map
	draw(gl, camera, character) {
		this.potions.forEach((potion) => {
			const { x: screenX, y: screenY } = camera.worldToScreen(
				potion.x,
				potion.y,
				character
			);

			gl.drawImage(
				assets.potion, // Potion sprite
				potion.frameIndex * this.potionWidth, // X position in the sprite sheet
				0,
				this.potionWidth,
				this.potionHeight,
				screenX,
				screenY,
				this.potionWidth * 1.2,
				this.potionHeight * 1.2
			);
		});

		// Draw potion at fixed location (20, 150), always using frame 0
		// gl.drawImage(
		// 	assets.potion,
		// 	0, // frameIndex * potionWidth (frame 0)
		// 	0,
		// 	this.potionWidth,
		// 	this.potionHeight,
		// 	20,
		// 	100,
		// 	this.potionWidth / 2,
		// 	this.potionHeight / 2
		// );

		gl.font = "30px Monogram";
		gl.fillStyle = "#fff";
		gl.strokeStyle = "#000";
		gl.lineWidth = 4;
		gl.strokeText(`Stored Potions: ${character.potions}`, 20, 100);
		gl.fillText(`Stored Potions: ${character.potions}`, 20, 100);
	}
}
