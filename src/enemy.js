const enemyFrameData = {
	idle: [
		{ x: 0, y: 0, width: 64, height: 64 },
		{ x: 64, y: 0, width: 64, height: 64 },
	],
	running: [
		{ x: 0, y: 64, width: 64, height: 64 },
		{ x: 64, y: 64, width: 64, height: 64 },
		{ x: 128, y: 64, width: 64, height: 64 },
	],
	attacking: [
		{ x: 0, y: 128, width: 64, height: 64 },
		{ x: 64, y: 128, width: 64, height: 64 },
		{ x: 128, y: 128, width: 64, height: 64 },
		{ x: 192, y: 128, width: 64, height: 64 },
		{ x: 256, y: 128, width: 64, height: 64 },
	],
	damaged: [{ x: 0, y: 192, width: 64, height: 64 }],
	killed: [
		{ x: 0, y: 256, width: 64, height: 64 },
		{ x: 64, y: 256, width: 64, height: 64 },
		{ x: 128, y: 256, width: 64, height: 64 },
		{ x: 192, y: 256, width: 64, height: 64 },
		{ x: 256, y: 256, width: 64, height: 64 },
		{ x: 320, y: 256, width: 64, height: 64 },
	],
	dead: [{ x: 320, y: 256, width: 64, height: 64 }],
};

import { assets } from "./Assets";
import { isBlocked, getAllowedCoordinates, getRandomAllowed } from "./boundary";

export default class Enemy {
	constructor(x, y, speed, health, damage) {
		const enemySpriteSheet = assets.enemy;
		this.x = x; // Enemy's world X position
		this.y = y; // Enemy's world Y position
		this.speed = 0.6; // Movement speed
		this.health = health; // Enemy's health
		this.damage = damage; // Damage dealt to the character
		this.state = "idle"; // Current state: idle, running, attacking, damaged, killed, dead
		this.spriteSheet = enemySpriteSheet; // The sprite sheet image
		this.frameData = enemyFrameData; // Frame data for each state
		this.currentFrame = 0; // Current animation frame
		this.frameTimer = 0; // Timer to control animation speed
		this.frameInterval = 100; // Time (ms) between frames

		this.enemySize = 200;
		this.face = 0;
		this.damageTimer = 0;
	}

	update(character, deltaTime) {
		if (this.state == "dead") {
			this.currentFrame = 0;
			return;
		}
		this.updateState();
		// Calculate distance to the character
		const dx = character.realX - this.x;
		const dy = character.realY - this.y;
		if (dx > 0) this.face = 0;
		else this.face = 1;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (this.health <= 0) {
			if (
				this.state === "killed" &&
				this.currentFrame === this.frameData["killed"].length - 1
			) {
				this.state = "dead"; // Transition to "dead" state
			} else if (this.state !== "dead") {
				this.state = "killed"; // Set state to "killed"
			}
		} else if (distance < 50) {
			// Attack the character if close enough
			this.state = "attacking";
			character.takeDamage(this.damage);
		} else if (distance < 1500) {
			// Move toward the character if within the spawning radius
			this.state = "running";
			const angle = Math.atan2(dy, dx);
			const nextX = this.x + Math.cos(angle) * this.speed * deltaTime;
			const nextY = this.y + Math.sin(angle) * this.speed * deltaTime;

			// Check if the next position is blocked
			if (!isBlocked(nextX - 100, nextY)) {
				this.x = nextX;
				this.y = nextY;
			} else {
				// If blocked, try to find an alternative direction
				// const allowedCoords = getAllowedCoordinates(this.x, this.y);
				// if (allowedCoords.length > 0) {
				//     const { x: altX, y: altY } = getRandomAllowed(allowedCoords);
				//     this.x = altX;
				//     this.y = altY;
				// } else {
				// If no alternative path, stay idle
				this.state = "idle";
				// }
			}
		} else {
			// Idle if too far from the character
			// console.log("ENEMY IS IDLE");
			this.state = "idle";
		}

		// Update animation frame
		if (this.frameData[this.state]) {
			this.frameTimer += deltaTime;
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				this.currentFrame++;

				// Handle animation transitions
				if (this.currentFrame >= this.frameData[this.state].length) {
					if (this.state === "killed") {
						this.state = "dead"; // Transition to "dead" state
					} else {
						this.currentFrame = 0; // Loop the animation
					}
				}
			}
		} else {
			console.error(`Invalid state: ${this.state}`);
			this.currentFrame = 0; // Reset to the first frame
		}
	}

	draw(gl, camera, canvas, character) {
		// Convert world coordinates to screen coordinates
		const screenX =
			(this.x - this.enemySize / 2 - (character.realX - camera.width / 2)) *
			(canvas.width / camera.width);
		const screenY =
			(this.y - this.enemySize - (character.realY - camera.height / 2)) *
			(canvas.height / camera.height);

		// Get the current frame data
		const frame = this.frameData[this.state][this.currentFrame];
		if (!frame) {
			// console.log("FRAME IS UNDEFINED");
			// console.log(`[${this.state}][${this.currentFrame}]`);
			return;
		}
		// console.log(`DRAWING: ${this.state}`);
		let doFlip = this.face === 1;
		if (doFlip) {
			gl.save();
			gl.scale(-1, 1);
		}

		// +512 if damaged

		// Draw the current frame from the sprite sheet
		gl.drawImage(
			this.spriteSheet,
			(this.isTakingdamage ? 512 : 0) + frame.x, // Source X (frame's position in the sprite sheet)
			frame.y + 1, // Source Y (frame's position in the sprite sheet)
			frame.width, // Frame width
			frame.height, // Frame height
			doFlip ? -screenX - this.enemySize : screenX, // Destination X (centered on the enemy)
			screenY, // Destination Y (centered on the enemy)
			this.enemySize, // Destination width
			this.enemySize // Destination height
		);

		if (doFlip) {
			gl.restore();
		}

		// Draw a circle at the enemy's position for debugging purposes
		// gl.beginPath();
		// gl.arc(screenX, screenY, 10, 0, Math.PI * 2);
		// gl.fillStyle = "red";
		// gl.fill();
		// gl.closePath();
	}

	takeDamage(amount) {
		if (!this.isTakingdamage) {
			this.health -= amount;
			if (this.health > 0) {
				this.isTakingdamage = true; // Change state to damaged
				this.damageTimer = Date.now();
			} else {
				this.state = "killed"; // Change state to killed
			}
		}
	}

	updateState() {
		if (this.isTakingdamage && Date.now() - this.damageTimer > 500) {
			this.isTakingdamage = false;
		}
	}
}

export function spawnEnemy(spawn_origin_x, spawn_origin_y) {
	let spawnX, spawnY, coords;
	// console.log(coords);
	// const radius = 1000;

	do {
		coords = getRandomAllowed();
	} while (
		isBlocked(coords.x, coords.y) &&
		isBlocked(coords.x, coords.y + 200) &&
		isBlocked(coords.x - 200, coords.y) &&
		isBlocked(coords.x + 200, coords.y)
	); // Ensure the spawn point is not blocked

	// console.log(`${spawnX} x ${spawnY}`);
	// return { x: spawnX, y: spawnY };

	const enemy = new Enemy(
		// spawnX,
		coords.x,
		coords.y,
		// 300,
		// spawnY,
		// 300,
		1.5, // Speed
		100, // Health
		10 // Damage
	);

	return enemy;
}
