import { assets } from "./Assets";
// idle and running uses the same frames
let robotGirlFrameData, iceCubeFrameData, heaterFrameData, fridgeFrameData;
function load() {
	robotGirlFrameData = {
		width: 64,
		height: 75,
		frameData: {
			idle: [
				{ x: 0, y: 30, width: 64, height: 75 },
				{ x: 64, y: 30, width: 64, height: 75 },
				{ x: 128, y: 30, width: 64, height: 75 },
				{ x: 192, y: 30, width: 64, height: 75 },
				{ x: 256, y: 30, width: 64, height: 75 },
				{ x: 320, y: 30, width: 64, height: 75 },
				{ x: 384, y: 30, width: 64, height: 75 },
				{ x: 448, y: 30, width: 64, height: 75 },
			],
			running: [
				{ x: 0, y: 30, width: 64, height: 75 },
				{ x: 64, y: 30, width: 64, height: 75 },
				{ x: 128, y: 30, width: 64, height: 75 },
				{ x: 192, y: 30, width: 64, height: 75 },
				{ x: 256, y: 30, width: 64, height: 75 },
				{ x: 320, y: 30, width: 64, height: 75 },
				{ x: 384, y: 30, width: 64, height: 75 },
				{ x: 448, y: 30, width: 64, height: 75 },
			],
			attacking: [
				{ x: 0, y: 159, width: 64, height: 75 },
				{ x: 64, y: 159, width: 64, height: 75 },
				{ x: 128, y: 159, width: 64, height: 75 },
				{ x: 192, y: 159, width: 64, height: 75 },
				{ x: 256, y: 159, width: 64, height: 75 },
				{ x: 320, y: 159, width: 64, height: 75 },
				{ x: 384, y: 159, width: 64, height: 75 },
				{ x: 448, y: 159, width: 64, height: 75 },
			],
			// damaged: [{ x: 0, y: 192, width: 64, height: 64 }],
			killed: [
				{ x: 0, y: 287, width: 64, height: 128 },
				{ x: 64, y: 287, width: 64, height: 128 },
				{ x: 128, y: 287, width: 64, height: 128 },
				{ x: 192, y: 287, width: 64, height: 128 },
				{ x: 256, y: 287, width: 64, height: 128 },
				{ x: 320, y: 287, width: 64, height: 128 },
			],
			dead: [{ x: 320, y: 287, width: 64, height: 128 }],
		},
		src: assets.enemy,
	};

	iceCubeFrameData = {
		width: 128,
		height: 128,
		frameData: {
			idle: [
				{ x: 0, y: 0, width: 128, height: 128 },
				{ x: 128, y: 0, width: 128, height: 128 },
				{ x: 256, y: 0, width: 128, height: 128 },
				{ x: 384, y: 0, width: 128, height: 128 },
				{ x: 512, y: 0, width: 128, height: 128 },
				{ x: 640, y: 0, width: 128, height: 128 },
				{ x: 768, y: 0, width: 128, height: 128 },
				{ x: 896, y: 0, width: 128, height: 128 },
				{ x: 1024, y: 0, width: 128, height: 128 },
				{ x: 1152, y: 0, width: 128, height: 128 },
			],
			running: [
				{ x: 0, y: 0, width: 128, height: 128 },
				{ x: 128, y: 0, width: 128, height: 128 },
				{ x: 256, y: 0, width: 128, height: 128 },
				{ x: 384, y: 0, width: 128, height: 128 },
				{ x: 512, y: 0, width: 128, height: 128 },
				{ x: 640, y: 0, width: 128, height: 128 },
				{ x: 768, y: 0, width: 128, height: 128 },
				{ x: 896, y: 0, width: 128, height: 128 },
				{ x: 1024, y: 0, width: 128, height: 128 },
				{ x: 1152, y: 0, width: 128, height: 128 },
			],
			attacking: [
				{ x: 0, y: 0, width: 128, height: 128 },
				{ x: 128, y: 0, width: 128, height: 128 },
				{ x: 256, y: 0, width: 128, height: 128 },
				{ x: 384, y: 0, width: 128, height: 128 },
				{ x: 512, y: 0, width: 128, height: 128 },
				{ x: 640, y: 0, width: 128, height: 128 },
				{ x: 768, y: 0, width: 128, height: 128 },
				{ x: 896, y: 0, width: 128, height: 128 },
				{ x: 1024, y: 0, width: 128, height: 128 },
				{ x: 1152, y: 0, width: 128, height: 128 },
				{ x: 1280, y: 0, width: 128, height: 128 },
				{ x: 1408, y: 0, width: 128, height: 128 },
				{ x: 1536, y: 0, width: 128, height: 128 },
				{ x: 1664, y: 0, width: 128, height: 128 },
			],
			// damaged: [{ x: 0, y: 192, width: 64, height: 64 }],
			killed: [
				{ x: 0, y: 0, width: 128, height: 128 },
				{ x: 128, y: 0, width: 128, height: 128 },
				{ x: 256, y: 0, width: 128, height: 128 },
				{ x: 384, y: 0, width: 128, height: 128 },
				{ x: 512, y: 0, width: 128, height: 128 },
				{ x: 640, y: 0, width: 128, height: 128 },
				{ x: 768, y: 0, width: 128, height: 128 },
				{ x: 896, y: 0, width: 128, height: 128 },
				{ x: 1024, y: 0, width: 128, height: 128 },
			],
			dead: [{ x: 1024, y: 0, width: 128, height: 128 }],
		},
		src: assets.ice_cube,
	};

	heaterFrameData = {
		width: 97,
		height: 97,
		frameData: {
			idle: [
				{ x: 22, y: 10, width: 97, height: 97 },
				{ x: 150, y: 10, width: 97, height: 97 },
				{ x: 278, y: 10, width: 97, height: 97 },
				{ x: 406, y: 10, width: 97, height: 97 },
			],
			running: [
				{ x: 22, y: 138, width: 97, height: 97 },
				{ x: 150, y: 138, width: 97, height: 97 },
				{ x: 278, y: 138, width: 97, height: 97 },
				{ x: 406, y: 138, width: 97, height: 97 },
			],
			attacking: [
				{ x: 22, y: 266, width: 97, height: 97 },
				{ x: 150, y: 266, width: 97, height: 97 },
				{ x: 278, y: 266, width: 97, height: 97 },
				{ x: 406, y: 266, width: 97, height: 97 },
				{ x: 534, y: 266, width: 97, height: 97 },
				{ x: 662, y: 266, width: 97, height: 97 },
				{ x: 790, y: 266, width: 97, height: 97 },
				{ x: 918, y: 266, width: 97, height: 97 },
			],
			// damaged: [{ x: 0, y: 192, width: 64, height: 64 }],
			killed: [
				{ x: 22, y: 394, width: 97, height: 97 },
				{ x: 150, y: 394, width: 97, height: 97 },
				{ x: 278, y: 394, width: 97, height: 97 },
			],
			dead: [{ x: 278, y: 394, width: 97, height: 97 }],
		},
		src: assets.toaster,
	};

	fridgeFrameData = {
		width: 64,
		height: 64,
		frameData: {
			idle: [
				{ x: 0, y: 0, width: 64, height: 64 },
				{ x: 64, y: 0, width: 64, height: 64 },
				{ x: 128, y: 0, width: 64, height: 64 },
				{ x: 192, y: 0, width: 64, height: 64 },
				{ x: 256, y: 0, width: 64, height: 64 },
				{ x: 320, y: 0, width: 64, height: 64 },
				{ x: 384, y: 0, width: 64, height: 64 },
				{ x: 448, y: 0, width: 64, height: 64 },
			],
			running: [
				{ x: 0, y: 128, width: 64, height: 64 },
				{ x: 64, y: 128, width: 64, height: 64 },
				{ x: 128, y: 128, width: 64, height: 64 },
			],
			attacking: [
				{ x: 0, y: 64, width: 64, height: 64 },
				{ x: 64, y: 64, width: 64, height: 64 },
				{ x: 128, y: 64, width: 64, height: 64 },
				{ x: 192, y: 64, width: 64, height: 64 },
				{ x: 256, y: 64, width: 64, height: 64 },
				{ x: 320, y: 64, width: 64, height: 64 },
				{ x: 384, y: 64, width: 64, height: 64 },
				{ x: 448, y: 64, width: 64, height: 64 },
				{ x: 512, y: 64, width: 64, height: 64 },
				{ x: 576, y: 64, width: 64, height: 64 },
				{ x: 640, y: 64, width: 64, height: 64 },
				{ x: 704, y: 64, width: 64, height: 64 },
			],
			// damaged: [{ x: 0, y: 192, width: 64, height: 64 }],
			killed: [
				{ x: 0, y: 192, width: 64, height: 64 },
				{ x: 64, y: 192, width: 64, height: 64 },
				{ x: 128, y: 192, width: 64, height: 64 },
				{ x: 192, y: 192, width: 64, height: 64 },
				{ x: 256, y: 192, width: 64, height: 64 },
				{ x: 320, y: 192, width: 64, height: 64 },
			],
			dead: [{ x: 320, y: 192, width: 64, height: 64 }],
		},
		src: assets.ref,
	};
}

import {
	isBlocked,
	getAllowedCoordinates,
	getRandomAllowed,
	getRandomAllowedRoom,
} from "./boundary";

class BaseEnemy {
	constructor(x, y, speed, health, damage, frameData) {
		load();
		this.x = x; // Enemy's world X position
		this.y = y; // Enemy's world Y position
		this.speed = speed; // Movement speed
		this.maxHealth = health;
		this.health = health; // Enemy's health
		this.damage = damage; // Damage dealt to the character
		this.state = "idle"; // Current state: idle, running, attacking, killed, dead
		this.currentFrame = 0; // Current animation frame
		this.frameTimer = 0; // Timer to control animation speed
		this.frameInterval = 100; // Time (ms) between frames
		this.froze = false;

		// this.enemySize = 200;
		this.face = 0;
		this.damageTimer = 0;

		this.spriteSheet = frameData.src; // The sprite sheet image
		this.frameData = frameData; // Frame data for each state
		this.sWidth = this.frameData.width * 1.4;
		this.sHeight = this.frameData.height * 1.4;
		this.isBoss = false;

		this.type = "";
	}

	updateState() {
		if (this.isTakingdamage && Date.now() - this.damageTimer > 100) {
			this.isTakingdamage = false;
		}
	}

	takeDamage(amount) {
		// if (!this.isTakingdamage) {
		this.health -= amount;
		console.log("TAKING DAMAGE!");
		if (this.health > 0) {
			this.isTakingdamage = true; // Change state to damaged
			this.damageTimer = Date.now();
		} else {
			this.state = "killed"; // Change state to killed
		}
		// }
	}

	draw(gl, camera, canvas, character) {
		// Convert world coordinates to screen coordinates
		const screenX =
			(this.x - this.sWidth / 2 - (character.realX - camera.width / 2)) *
			(canvas.width / camera.width);
		const screenY =
			(this.y - this.sHeight - (character.realY - camera.height / 2)) *
			(canvas.height / camera.height);

		// Get the current frame data
		const frame = this.frameData.frameData[this.state][this.currentFrame];
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

		// Draw the current frame from the sprite sheet
		let offset = 0;
		if (this.froze) {
			offset += this.spriteSheet.width * 2;
		} else if (this.isTakingdamage) {
			offset += this.spriteSheet.width;
		}

		gl.drawImage(
			this.spriteSheet,
			offset + frame.x, // Source X (frame's position in the sprite sheet)
			frame.y + 1, // Source Y (frame's position in the sprite sheet)
			frame.width, // Frame width
			frame.height, // Frame height
			doFlip ? -screenX - this.sWidth : screenX, // Destination X (centered on the enemy)
			screenY, // Destination Y (centered on the enemy)
			frame.width * 1.4, // Destination width
			frame.height * 1.4 // Destination height
		);

		if (doFlip) {
			gl.restore();
		}

		/* ━━━━━━━━━━━━━━━━━━━━ Health Bar ━━━━━━━━━━━━━━━━━ */
		const barWidth = 50 * (this.isBoss ? 3 : 1); // Total width of the health bar
		const barHeight = 5; // Height of the health bar
		const healthPercentage = Math.max(this.health / this.maxHealth, 0); // Ensure health is not negative

		// Calculate the width of the filled portion of the health bar
		const filledWidth = barWidth * healthPercentage;

		// Position the health bar slightly above the enemy
		const barX = screenX + this.sWidth / 2 - barWidth / 2;
		const barY = screenY - 30; // 30 pixels above the enemy

		// Draw the background of the health bar (empty portion)
		gl.fillStyle = "red"; // Background color (empty health)
		gl.fillRect(barX, barY, barWidth, barHeight);

		// Draw the filled portion of the health bar
		gl.fillStyle = "green"; // Foreground color (current health)
		gl.fillRect(barX, barY, filledWidth, barHeight);

		// Draw a circle at the enemy's position for debugging purposes
		gl.beginPath();
		gl.arc(screenX, screenY, 10, 0, Math.PI * 2);
		gl.fillStyle = "red";
		gl.fill();
		gl.closePath();

		// Draw a rectangle offset from the enemy's position

		// const rectX = screenX + this.sWidth / 2 - rectWidth / 2;
		// const rectY = screenY + this.sHeight / 2;
		// Draw a hollow circle 50px from the center of the enemy
		gl.beginPath();
		gl.arc(
			screenX + this.sWidth / 2,
			screenY + this.sHeight / 2,
			50,
			0,
			Math.PI * 2
		);
		gl.strokeStyle = "rgba(0,0,0,0.5)";
		gl.lineWidth = 2;
		gl.stroke();
		gl.closePath();
	}
}

export default class MeleeEnemy extends BaseEnemy {
	constructor(x, y, speed, health, damage, options = {}) {
		let frameData;
		console.log(options);
		switch (options.skinVersion) {
			case 1:
				frameData = fridgeFrameData;
				break;
			case 2:
				frameData = heaterFrameData;
				break;
		}
		super(
			x,
			y,
			speed,
			health,
			damage,
			frameData
			// spriteSheet: options.spriteSheet || assets.enemy,
			// sWidth: options.sWidth || 64 * 1.4,
			// sHeight: options.sHeight || 75 * 1.4,
		);
	}

	update(character, deltaTime) {
		if (this.state == "dead") {
			this.currentFrame = 0;
			return;
		}
		this.updateState();
		// Calculate distance to the character
		const dx = character.realX + character.width - this.x;
		const dy = character.realY + character.width - this.y;
		if (dx > 0) this.face = 0;
		else this.face = 1;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (this.health <= 0) {
			if (
				this.state === "killed" &&
				this.currentFrame === this.frameData.frameData["killed"].length - 1
			) {
				this.state = "dead"; // Transition to "dead" state
			} else if (this.state !== "dead") {
				this.state = "killed"; // Set state to "killed"
			}
		} else if (distance < 10) {
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
			if (!isBlocked(nextX, nextY)) {
				this.x = nextX;
				this.y = nextY;
			} else if (!isBlocked(nextX, this.y)) {
				this.x = nextX;
			} else if (!isBlocked(this.x, nextY)) {
				this.y = nextY;
			} else {
				// If both axes are blocked, stay idle
				this.state = "idle";
			}
		} else {
			// Idle if too far from the character
			// console.log("ENEMY IS IDLE");
			this.state = "idle";
		}

		// Update animation frame
		if (this.frameData.frameData[this.state]) {
			this.frameTimer += 16;
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				this.currentFrame++;

				// Handle animation transitions
				if (this.currentFrame >= this.frameData.frameData[this.state].length) {
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
}

// ──────────────── Ranged Enemy ────────────────
export class RangedEnemy extends BaseEnemy {
	constructor(x, y, speed, health, damage, options = {}) {
		let frameData;
		switch (options.skinVersion) {
			case 1:
				frameData = robotGirlFrameData;
				break;
			case 2:
				frameData = iceCubeFrameData;
				break;
		}

		super(
			x,
			y,
			speed,
			health,
			damage,
			frameData
			// spriteSheet: options.spriteSheet || assets.enemy,
			// sWidth: options.sWidth || 64 * 1.4,
			// sHeight: options.sHeight || 75 * 1.4,
		);
		this.shootCooldown = options.shootCooldown || 1000;
		this.lastShot = 0;
		this.projectiles = [];
		this.range = options.range || 600;
		this.homing = options.homing || false;
	}

	update(character, deltaTime) {
		// Update projectiles
		this.projectiles.forEach((proj, index) => {
			if (this.homing) {
				const dx = character.realX - proj.x;
				const dy = character.realY - proj.y;
				const angle = Math.atan2(dy, dx);
				proj.dx = Math.cos(angle) * proj.speed;
				proj.dy = Math.sin(angle) * proj.speed;
			}
			proj.x += proj.dx * deltaTime;
			proj.y += proj.dy * deltaTime;

			if (isBlocked(proj.x, proj.y)) {
				this.projectiles.splice(index, 1);
			}

			const projRadius = 10;
			const charRadius = character.radius || 30; // Adjust as needed
			const dist = Math.hypot(
				proj.x - character.realX,
				proj.y - character.realY
			);
			if (dist < projRadius + charRadius) {
				character.takeDamage(this.damage);
				this.projectiles.splice(index, 1);
			}
		});

		if (this.state == "dead") {
			this.currentFrame = 0;
			return;
		}
		this.updateState();
		// Calculate distance to the character
		const dx = character.realX - this.x;
		const dy = character.realY - this.y;
		this.face = dx > 0 ? 0 : 1;

		const distance = Math.sqrt(dx * dx + dy * dy);

		if (this.health <= 0) {
			if (
				this.state === "killed" &&
				this.currentFrame === this.frameData.frameData["killed"].length - 1
			) {
				this.state = "dead"; // Transition to "dead" state
			} else if (this.state !== "dead") {
				this.state = "killed"; // Set state to "killed"
			}
		} else if (distance < this.range) {
			this.state = "attacking";
			const now = Date.now();
			if (now - this.lastShot > this.shootCooldown) {
				this.shootAt(character);
				this.lastShot = now;
			}
		} else if (distance < 1500) {
			this.state = "running";
			const angle = Math.atan2(dy, dx);
			const nextX = this.x + Math.cos(angle) * this.speed * deltaTime;
			const nextY = this.y + Math.sin(angle) * this.speed * deltaTime;
			// Check if the next position is blocked
			if (!isBlocked(nextX, nextY)) {
				this.x = nextX;
				this.y = nextY;
			} else if (!isBlocked(nextX, this.y)) {
				this.x = nextX;
			} else if (!isBlocked(this.x, nextY)) {
				this.y = nextY;
			} else {
				// If both axes are blocked, stay idle
				this.state = "idle";
			}
		} else {
			this.state = "idle";
		}

		// Animation frame update (same as MeleeEnemy)
		if (this.frameData.frameData[this.state]) {
			this.frameTimer += 16;
			if (this.frameTimer > this.frameInterval) {
				this.frameTimer = 0;
				this.currentFrame++;
				if (this.currentFrame >= this.frameData.frameData[this.state].length) {
					if (this.state === "killed") {
						this.state = "dead";
					} else {
						this.currentFrame = 0;
					}
				}
			}
		} else {
			this.currentFrame = 0;
		}
	}

	shootAt(character) {
		const dx = character.realX - this.x;
		const dy = character.realY - this.y;
		const angle = Math.atan2(dy, dx);
		const speed = 200;
		this.projectiles.push({
			x: this.x,
			y: this.y,
			dx: Math.cos(angle) * speed,
			dy: Math.sin(angle) * speed,
			angle,
			speed,
		});
	}

	draw(gl, camera, canvas, character) {
		super.draw(gl, camera, canvas, character);
		// Draw projectiles
		this.projectiles.forEach((proj) => {
			const screenX =
				(proj.x - (character.realX - camera.width / 2)) *
				(canvas.width / camera.width);
			const screenY =
				(proj.y - (character.realY - camera.height / 2)) *
				(canvas.height / camera.height);
			gl.save();
			gl.translate(screenX, screenY);
			gl.rotate(proj.angle);
			gl.drawImage(
				assets.bullet_red,
				-16, // Center the image horizontally (assuming 32x32 image)
				-16, // Center the image vertically
				32,
				32
			);
			gl.restore();
		});
	}
}

export class BossRangedEnemy extends RangedEnemy {
	constructor(x, y, speed = 100, health = 700, damage = 20, options = {}) {
		super(
			x,
			y,
			speed,
			health,
			damage,
			// options.speed || 100,
			// options.health || 500,
			// options.damage || 20,
			// {
			// 	...options,
			// }
			options
		);

		this.multiShot = 8;
		this.isBoss = true;
	}

	shootAt(character) {
		// Shoot in all directions
		// First bullet aimed directly at the character
		const dx = character.realX - this.x;
		const dy = character.realY - this.y;
		const baseAngle = Math.atan2(dy, dx);
		const speed = 250;
		this.projectiles.push({
			x: this.x,
			y: this.y - this.sHeight / 2,
			dx: Math.cos(baseAngle) * speed,
			dy: Math.sin(baseAngle) * speed,
			angle: baseAngle,
			speed,
		});
		// Remaining bullets spread evenly around the circle, starting from baseAngle
		for (let i = 1; i < this.multiShot; i++) {
			const angle = baseAngle + (i * 2 * Math.PI) / this.multiShot;
			this.projectiles.push({
				x: this.x,
				y: this.y - this.sHeight / 2,
				dx: Math.cos(angle) * speed,
				dy: Math.sin(angle) * speed,
				angle,
				speed,
			});
		}
	}
}

export function spawnEnemy(spawn_origin_x, spawn_origin_y, type, skinVersion) {
	// implement summon only to the room coordinates

	let spawnX, spawnY, coords;
	// console.log(coords);
	// const radius = 1000;

	do {
		// coords = getRandomAllowed();
		coords = getRandomAllowedRoom();
	} while (
		isBlocked(coords.x, coords.y) &&
		isBlocked(coords.x, coords.y + 200) &&
		isBlocked(coords.x - 200, coords.y) &&
		isBlocked(coords.x + 200, coords.y)
	); // Ensure the spawn point is not blocked

	console.log(`${coords.x} x ${coords.y}`);
	// return { x: spawnX, y: spawnY };

	let enemy;

	if (type == "bossRange") {
		enemy = new BossRangedEnemy(
			// spawnX,
			coords.x,
			coords.y,
			100,
			700,
			20,
			// spawnY,
			// 300,
			// 200, // Speed
			// 100, // Health
			// 10 // Damage
			{ skinVersion }
		);
		enemy.type = type;
	}
	if (type == "range") {
		enemy = new RangedEnemy(
			// spawnX,
			coords.x,
			coords.y,
			// 300,
			// spawnY,
			// 300,
			100, // Speed
			100, // Health
			20, // Damage
			{ skinVersion }
		);
		enemy.type = type;
	}
	if (type == "melee") {
		enemy = new MeleeEnemy(
			// spawnX,
			coords.x,
			coords.y,
			// 300,
			// spawnY,
			// 300,
			100, // Speed
			100, // Health
			20, // Damage
			{ skinVersion: skinVersion }
		);
		enemy.type = type;
	}

	// console.log(enemy);

	return enemy;
}
