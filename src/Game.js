import { spawnEnemy } from "./enemy";
import { isBlocked } from "./boundary";
import HealthBar from "./HealthBar";
import Character from "./character";

import { isGameOver } from "./store";
import { get } from "svelte/store";

import { assets } from "./Assets";

export default class Game {
	constructor(canvas, gl) {
		this.canvas = canvas;
		this.gl = gl;

		// Game state
		this.character = null;
		this.enemies = [];
		this.bullets = [];
		// this.isGameOver = false;

		// Camera
		this.camera = {
			scale: 1.5,
			width: 0,
			height: 0,
			width_scale: 0,
			height_scale: 0,
		};

		// Assets
		this.mapImg = assets.map;
		this.barriersImg = assets.barriers;
		this.gunImg = assets.gun;
		this.bulletImg = assets.bullet;

		// Health bar
		this.healthBar = new HealthBar();

		// Movement
		this.keys = {
			ArrowUp: false,
			ArrowDown: false,
			ArrowLeft: false,
			ArrowRight: false,
			w: false,
			a: false,
			s: false,
			d: false,
		};
	}

	initialize() {
		isGameOver.set(false);
		this.character = new Character(this.camera.scale, this.healthBar);
		this.enemies = [];
		this.bullets = [];
		this.healthBar.setHealth(100);

		setInterval(() => {
			if (this.enemies.length < 20) {
				// Limit the number of enemiesconst

				let enemy = spawnEnemy(this.character.realX, this.character.realY);
				this.enemies.push(enemy);
			}
		}, 3000); // Spawn an enemy every 3 seconds

		this.resizeCanvas();
		this.setupEventListeners();
		this.startGameLoop();
	}

	createLevel(level) {
		this.level = level;
		this.initialize();

		// Add level-specific logic
		if (level === 1) {
			// Spawn initial enemies or set objectives
			this.spawnEnemies(5); // Example: Spawn 5 enemies
		} else if (level === 2) {
			// Different enemies, map, etc.
			this.spawnEnemies(10);
		}
	}

	restartLevel() {
		this.createLevel(this.level); // Restart the current level
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		const canvasAspectRatio = this.canvas.width / this.canvas.height;

		this.camera.width = this.canvas.width * this.camera.scale;
		this.camera.height = this.canvas.height * this.camera.scale;

		this.camera.width_scale = this.mapImg.width / this.camera.width;
		this.camera.height_scale = this.mapImg.height / this.camera.height;
	}

	worldPosToScreenPos(worldPos) {
		return (
			(worldPos - this.camera.width / 2) *
			(this.canvas.width / this.camera.width)
		);
	}

	setupEventListeners() {
		window.addEventListener("resize", () => this.resizeCanvas());

		document.addEventListener("keydown", (e) => {
			if (this.keys.hasOwnProperty(e.key)) {
				this.keys[e.key] = true;
			}
		});

		document.addEventListener("keyup", (e) => {
			if (this.keys.hasOwnProperty(e.key)) {
				this.keys[e.key] = false;
			}
		});

		this.canvas.addEventListener("mousemove", (event) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			const centerX = this.canvas.width / 2;
			const centerY = this.canvas.height / 2;

			const dx = mouseX - centerX;
			const dy = mouseY - centerY;

			this.character.gunAngle = Math.atan2(dy, dx);
		});

		this.canvas.addEventListener("mousedown", () => {
			// Summon a bullet at the gun's location
			const bulletX = this.character.realX + (this.character.width * 1) / 5;
			const bulletY = this.character.realY + (this.character.height * 2) / 5;

			// Calculate the direction of the bullet based on the gun's angle
			const bulletSpeed = 20;
			const bulletDx = Math.cos(this.character.gunAngle) * bulletSpeed;
			const bulletDy = Math.sin(this.character.gunAngle) * bulletSpeed;

			// Create a new bullet object
			const newBullet = {
				x: bulletX,
				y: bulletY,
				dx: bulletDx,
				dy: bulletDy,
				angle: this.character.gunAngle,
			};

			this.bullets.push(newBullet);
		});
	}

	startGameLoop() {
		const gameLoop = () => {
			if (this.character.health <= 0 && !get(isGameOver)) {
				isGameOver.set(true);
			}

			if (!get(isGameOver)) {
				this.update();
				this.draw();
				requestAnimationFrame(gameLoop);
			}
		};

		requestAnimationFrame(gameLoop);
	}

	update() {
		if (this.character.state == 3) {
			return;
		}

		this.moveCharacter();

		const deltaTime = 16; // Approximate time between frames (in ms)
		this.updateBulletsAndEnemies(this.bullets, this.enemies, deltaTime);

		this.bullets.forEach((bullet, index) => {
			bullet.x += bullet.dx;
			bullet.y += bullet.dy;

			// Remove bullets that go out of bounds
			if (isBlocked(bullet.x, bullet.y)) {
				this.bullets.splice(index, 1);
			}
		});

		this.enemies.forEach((enemy) => enemy.update(this.character, 16));
	}

	draw() {
		this.gl.clearRect(0, 0, this.canvas.width, this.canvas.height);
		/* ━━━━━━━━━━━━━━━ Set the fill color ━━━━━━━━━━━━━━━━━━━ */
		this.gl.fillStyle = "#849198";
		this.gl.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fill the entire canvas

		/* ━━━━━━━━━━━━━━━━━━━ Draw the map ━━━━━━━━━━━━━━━━━━━━━ */
		this.gl.drawImage(
			this.mapImg,
			// boundaryImg,
			this.character.realX - this.camera.width / 2, // Source X (character centered horizontally)
			this.character.realY - this.camera.height / 2, // Source Y (character centered vertically)
			this.camera.width, // Source width
			this.camera.height, // Source height
			0, // Destination X
			0, // Destination Y
			this.canvas.width, // Destination width (stretch to fit canvas)
			this.canvas.height // Destination height (stretch to fit canvas)
		);

		/* ━━━━━━━━━━━━━━━━━━━━━ Dotted Grid ━━━━━━━━━━━━━━━━━━━━ */
		const gridGap = 100; // Gap between dots in pixels
		const dotRadius = 2; // Radius of each dot

		const endX = this.character.realX + this.camera.width / 2;
		const endY = this.character.realY + this.camera.height / 2;

		// Loop through the visible portion of the world to draw the grid CLUTCHED BY COPILOT
		for (let x = 0; x <= endX; x += gridGap) {
			for (let y = 0; y <= endY; y += gridGap) {
				// Convert world coordinates to screen coordinates
				const screenX = this.worldPosToScreenPos(x - this.character.realX);
				const screenY = this.worldPosToScreenPos(y - this.character.realY);

				// Draw the dot
				this.gl.fillStyle = isBlocked(x, y)
					? "rgba(255, 255, 255, 0.5)"
					: "rgba(255, 0, 255, 0)"; // Semi-transparent white
				this.gl.beginPath();
				this.gl.arc(screenX, screenY, dotRadius, 0, Math.PI * 2); // Draw a small circle
				this.gl.fill();
			}
		}

		// Draw enemies
		this.enemies.forEach((enemy) =>
			enemy.draw(this.gl, this.camera, this.canvas, this.character)
		);

		/* ━━━━━━━━━━━━━━━━ Draw the character ━━━━━━━━━━━━━━━━━━ */
		this.character.draw(
			this.gl,
			this.canvas.width / 2 - this.character.width / 2, // Center X position on the canvas
			this.canvas.height / 2 - this.character.height / 2 // Center Y position on the canvas
		);

		/* ━━━━━━━━━━━━━━━━━━━━ Draw the gun ━━━━━━━━━━━━━━━━━━━━ */
		this.gl.save();

		// Translate to the character's position
		this.gl.translate(
			this.canvas.width / 2 + (this.character.width * 1) / 5,
			this.canvas.height / 2 + (this.character.height * 2) / 5
		);

		// Rotate the canvas to the gun's angle
		if (this.character.face === 1) {
			this.gl.rotate(this.character.gunAngle + (135 * Math.PI) / 180);
		} else {
			this.gl.rotate(this.character.gunAngle + (45 * Math.PI) / 180);
		}

		const time = Date.now() / 150; // Adjust the speed of the up and down motion
		const amplitude = 3; // Adjust the amplitude of the motion
		const shakeX = 0; // No horizontal movement
		const shakeY = Math.sin(time) * amplitude; // Periodic up and down motion

		if (this.character.face === 1) {
			this.gl.scale(-1, 1); // Flip horizontally
		}

		this.gl.drawImage(
			this.gunImg,
			(-this.gunImg.width * this.camera.scale * 1.2) / 2 + shakeX,
			(-this.gunImg.height * this.camera.scale * 1.2) / 2 + shakeY,
			this.gunImg.width * this.camera.scale * 1.2,
			this.gunImg.height * this.camera.scale * 1.2
		);

		if (this.character.face === 1) {
			this.gl.scale(-1, 1); // Reset the horizontal flip
		}

		this.gl.restore();

		/* ━━━━━━━━━━━━━━━━━━━━ Draw bullets ━━━━━━━━━━━━━━━━━━━━ */
		this.bullets.forEach((bullet) => {
			this.gl.save();
			const screenX =
				(bullet.x - (this.character.realX - this.camera.width / 2)) *
				(this.canvas.width / this.camera.width);
			const screenY =
				(bullet.y - (this.character.realY - this.camera.height / 2)) *
				(this.canvas.height / this.camera.height);
			this.gl.translate(screenX, screenY);
			this.gl.rotate(bullet.angle);
			this.gl.drawImage(this.bulletImg, -25, -25, 50, 50);
			this.gl.restore();
		});

		/* ━━━━━ Draw barriers or other elements if needed ━━━━ */
		this.gl.drawImage(
			this.barriersImg,
			this.character.realX - this.camera.width / 2, // Source X (character centered horizontally)
			this.character.realY - this.camera.height / 2, // Source Y (character centered vertically)
			this.camera.width, // Source width
			this.camera.height, // Source height
			0, // Destination X
			0, // Destination Y
			this.canvas.width, // Destination width (stretch to fit canvas)
			this.canvas.height // Destination height (stretch to fit canvas)
		);

		/* ━━━━━━━━━━━━━━━━━ Draw health bar ━━━━━━━━━━━━━━━━━ */
		this.healthBar.draw(this.gl);
	}

	moveCharacter() {
		const centerX = this.character.realX + this.character.width / 2;
		const bottomY = this.character.realY + this.character.height;
		// const centerX = character.realX;
		// const bottomY = character.realY;

		// Horizontal movement
		if (this.keys.ArrowLeft || this.keys.a) {
			const nextRealX = this.character.realX - this.character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX - this.character.width, bottomY)) {
				this.character.realX = nextRealX;
				this.character.face = 1;
			}
		}

		if (this.keys.ArrowRight || this.keys.d) {
			const nextRealX = this.character.realX + this.character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX + this.character.width, bottomY)) {
				this.character.realX = nextRealX;
				this.character.face = 0;
			}
		}

		// Vertical movement
		if (this.keys.ArrowUp || this.keys.w) {
			const nextRealY = this.character.realY - this.character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(centerX, nextRealY)) {
				this.character.realY = nextRealY;
			}
		}

		if (this.keys.ArrowDown || this.keys.s) {
			const nextRealY = this.character.realY + this.character.speed;

			// Check collision at the new center-bottom position\
			if (!isBlocked(centerX, nextRealY + this.character.height * 1.5)) {
				this.character.realY = nextRealY;
			}
		}

		// Update grid position based on real position
		// character.gridX = Math.round(character.realX / 50);
		// character.gridY = Math.round(character.realY / 50);
		// console.log(`Position: ${character.realX} x ${character.realY}`);

		if (
			this.keys.ArrowLeft ||
			this.keys.ArrowRight ||
			this.keys.ArrowUp ||
			this.keys.ArrowDown ||
			this.keys.a ||
			this.keys.d ||
			this.keys.w ||
			this.keys.s
		) {
			this.character.state = 1;
		} else if (this.character.state != 2) {
			this.character.state = 0;
		}
	}

	spawnEnemies(count) {
		for (let i = 0; i < count; i++) {
			const enemy = spawnEnemy(this.character.realX, this.character.realY);
			this.enemies.push(enemy);
		}
	}

	checkCollision(bullet, enemy) {
		const dx = bullet.x - enemy.x;
		const dy = bullet.y - enemy.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Check if the distance is less than the sum of their radii
		// console.log(`${distance} < ${enemy.enemySize / 2}`);
		return distance < enemy.enemySize / 2;
	}

	updateBulletsAndEnemies(bullets, enemies, deltaTime) {
		for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
			const bullet = bullets[bulletIndex];

			for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
				const enemy = enemies[enemyIndex];

				if (enemy.state === "killed" || enemy.state === "dead") {
					continue;
				}

				if (this.checkCollision(bullet, enemy)) {
					// Handle collision
					enemy.takeDamage(100); // Enemy takes damage
					bullets.splice(bulletIndex, 1); // Remove the bullet
					bulletIndex--; // Adjust index due to bullet removal
					if (enemy.health <= 0) {
						enemy.state = "killed"; // Mark enemy as killed
					}
					break; // Exit inner loop after collision
				}
			}
		}
	}
}
