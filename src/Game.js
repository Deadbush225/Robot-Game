import { assets } from "./Assets";
import { spawnEnemy } from "./enemy";
import { isBlocked, getRandomAllowed } from "./boundary";
import HealthBar from "./HealthBar";
import Character from "./character";
// import Portal from "./portal";
import { GunMachine } from "./Gun";
import { CoinManager } from "./coins";
import { PotionManager } from "./potion";
import Camera from "./Camera";

import { isGameOver } from "./store";
import { get } from "svelte/store";
import { VendingMachine } from "./vendingMachine";

export default class Game {
	constructor(canvas, gl) {
		this.canvas = canvas;
		this.gl = gl;

		// Game state
		this.character = null;
		this.enemies = [];
		this.bullets = [];
		this.guns = [];
		this.enemySpawnInterval = null;
		// this.isGameOver = false;
		// this.gunMachine = new GunMachine();

		// Camera
		// this.camera = {
		// 	scale: 1.5,
		// 	width: 0,
		// 	height: 0,
		// 	width_scale: 0,
		// 	height_scale: 0,
		// };
		this.camera = new Camera(canvas, 1.5);

		// Assets
		this.mapImg = assets.map;
		this.barriersImg = assets.barriers;
		this.gunImg = assets.gun;
		this.bulletImg = assets.bullet;

		// Portals
		// this.portal = new Portal(200, 200);

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
		this.initialize();
	}

	initialize() {
		// Clear any existing enemy spawn interval
		if (this.enemySpawnInterval) {
			clearInterval(this.enemySpawnInterval);
		}

		isGameOver.set(false);
		// Health bar
		this.healthBar = new HealthBar();
		this.gunMachine = new GunMachine();
		this.coinManager = new CoinManager();
		this.potionManager = new PotionManager();
		this.vendingMachine = new VendingMachine(500, 150, this.gunMachine);
		this.character = new Character(this.camera.scale, this.healthBar);
		this.enemies = [];
		this.bullets = [];
		this.healthBar.setHealth(100);

		// this.enemySpawnInterval = setInterval(() => {
		// 	if (this.enemies.length < 20) {
		// 		// Limit the number of enemiesconst

		// 		let enemy = spawnEnemy(this.character.realX, this.character.realY);
		// 		this.enemies.push(enemy);
		// 	}
		// }, 3000); // Spawn an enemy every 3 seconds
		// Summon guns at random positions
		for (let i = 0; i < 20; i++) {
			let coords;
			do {
				coords = getRandomAllowed();
			} while (
				isBlocked(coords.x, coords.y) &&
				isBlocked(coords.x, coords.y + 200) &&
				isBlocked(coords.x - 200, coords.y) &&
				isBlocked(coords.x + 200, coords.y)
			);
			console.log("x: " + coords.x + " y: " + coords.y);

			// this.gunMachine.summonGun(coords.x, coords.y);
			this.coinManager.spawnCoin(coords.x, coords.y);
		}

		for (let i = 0; i < 10; i++) {
			this.potionManager.generatePotion();
		}

		this.resizeCanvas();
		this.setupEventListeners();
		this.startGameLoop();
	}

	createLevel(level) {
		this.level = level;
		this.initialize();

		// setTimeout(() => {
		// Add level-specific logic
		if (level === 1) {
			// Spawn initial enemies or set objectives
			setTimeout(() => {
				this.spawnEnemies(10); // Example: Spawn 5 enemies
				// 	this.portal.activate();
			}, 2000);
		} else if (level === 2) {
			// Different enemies, map, etc.
			this.spawnEnemies(10);
		}
		// }, 5000);
	}

	restartLevel() {
		this.createLevel(this.level); // Restart the current level
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		// const canvasAspectRatio = this.canvas.width / this.canvas.height;

		// this.camera.width = this.canvas.width * this.camera.scale;
		// this.camera.height = this.canvas.height * this.camera.scale;

		// this.camera.width_scale = this.mapImg.width / this.camera.width;
		// this.camera.height_scale = this.mapImg.height / this.camera.height;
		this.camera.resize(this.mapImg.width, this.mapImg.height);
	}

	// worldPosToScreenPos(worldPos) {
	// 	return (
	// 		(worldPos - this.camera.width / 2) *
	// 		(this.canvas.width / this.camera.width)
	// 	);
	// }

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

		let rows = null;
		let burst = () => {
			this.canvas.dispatchEvent(new MouseEvent("mousedown"));
		};
		let burstInterval = null;

		this.canvas.addEventListener("mousedown", () => {
			// Summon bullets for burst fire with spread
			const bulletX = this.character.realX + (this.character.width * 1) / 5;
			const bulletY = this.character.realY + (this.character.height * 2) / 5;

			const gun = this.character.currentGun;

			if (rows == null) {
				rows = gun.rows;
				// console.log("ROWS RESET ");
				// console.log("ROWS: " + rows);
			}

			const bulletSpeed = 700; // px per second
			const spreadAngle = 5 * (Math.PI / 180); // Spread angle in radians (10 degrees)

			const burstCount = gun.spread; // Number of bullets in the burst (must be odd)

			// Calculate the starting angle for the spread
			const startAngle =
				this.character.gunAngle - Math.floor(burstCount / 2) * spreadAngle;

			for (let i = 0; i < burstCount; i++) {
				const angle = startAngle + i * spreadAngle;

				// Calculate the direction of the bullet based on the spread angle
				const bulletDx = Math.cos(angle) * bulletSpeed;
				const bulletDy = Math.sin(angle) * bulletSpeed;

				// Create a new bullet object
				const newBullet = {
					x: bulletX,
					y: bulletY,
					dx: bulletDx,
					dy: bulletDy,
					angle: angle,
					damage: gun.damage,
				};

				this.bullets.push(newBullet);
			}
			// Fire two additional mousedown events

			if (rows > 0) {
				if (!burstInterval) {
					burstInterval = setInterval(burst, 100);
				}
				rows--;
			} else {
				clearInterval(burstInterval);
				burstInterval = null;
				rows = null;
			}
		});
	}

	goalCompleted(func) {}

	startGameLoop() {
		let lastTime = performance.now();

		const gameLoop = () => {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastTime) / 1000;
			lastTime = currentTime;
			// console.log("D: " + deltaTime);

			if (this.character.health <= 0 && !get(isGameOver)) {
				isGameOver.set(true);
				return;
			}

			if (!get(isGameOver)) {
				this.update(deltaTime);
				// this.update();
				this.draw();
				requestAnimationFrame(gameLoop);
			}
		};

		requestAnimationFrame(gameLoop);
	}

	update(deltaTime) {
		if (this.character.state == 3) {
			return;
		}

		this.moveCharacter(deltaTime);

		// const deltaTime = 16; // Approximate time between frames (in ms)
		this.updateBulletsAndEnemies(this.bullets, this.enemies, deltaTime);

		this.bullets.forEach((bullet, index) => {
			bullet.x += bullet.dx * deltaTime;
			bullet.y += bullet.dy * deltaTime;

			// Remove bullets that go out of bounds
			if (isBlocked(bullet.x, bullet.y)) {
				this.bullets.splice(index, 1);
			}
		});

		this.enemies.forEach((enemy) => enemy.update(this.character, deltaTime));

		// this.portal.checkCollision(this.character);
		// this.portal.update(deltaTime);
		// Check if the player collides with a gun
		this.gunMachine.checkPlayerCollision(this.character);
		this.coinManager.update(performance.now(), this.character);

		this.vendingMachine.isOverlapping(this.character);

		this.potionManager.checkCollision(this.character);

		this.potionManager.update(deltaTime);
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
				// const screenX = this.camera.worldToScreen(x - this.character.realX);
				// const screenY = this.camera.worldToScreen(y - this.character.realY);
				const { x: screenX, y: screenY } = this.camera.worldToScreen(
					x,
					y,
					this.character
				);

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
			this.character.currentGun.image,
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
			this.gl.drawImage(this.character.currentGun.bullet, -25, -25, 50, 50);
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

		// Portals
		// this.portal.draw(this.gl, this.camera, this.canvas, this.character);
		this.gunMachine.draw(this.gl, this.camera, this.canvas, this.character);

		this.potionManager.draw(this.gl, this.camera, this.character);

		/* ━━━━━━━━━━━━━━━━━ Draw health bar ━━━━━━━━━━━━━━━━━ */
		this.healthBar.draw(this.gl);

		this.coinManager.draw(this.gl, this.camera, this.character);

		this.vendingMachine.draw(this.gl, this.camera, this.character);
	}

	moveCharacter(deltaTime) {
		const centerX = this.character.realX + this.character.width / 2;
		const bottomY = this.character.realY + this.character.height;
		// const centerX = character.realX;
		// const bottomY = character.realY;

		// Horizontal movement
		if (this.keys.ArrowLeft || this.keys.a) {
			const nextRealX = this.character.realX - this.character.speed * deltaTime;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX - this.character.width, bottomY)) {
				this.character.realX = nextRealX;
				this.character.face = 1;
			}
		}

		if (this.keys.ArrowRight || this.keys.d) {
			const nextRealX = this.character.realX + this.character.speed * deltaTime;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX + this.character.width, bottomY)) {
				this.character.realX = nextRealX;
				this.character.face = 0;
			}
		}

		// Vertical movement
		if (this.keys.ArrowUp || this.keys.w) {
			const nextRealY = this.character.realY - this.character.speed * deltaTime;

			// Check collision at the new center-bottom position
			if (!isBlocked(centerX, nextRealY)) {
				this.character.realY = nextRealY;
			}
		}

		if (this.keys.ArrowDown || this.keys.s) {
			const nextRealY = this.character.realY + this.character.speed * deltaTime;

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
		// console.log(this.enemies);
	}

	checkCollision(bullet, enemy) {
		const dx = bullet.x - enemy.x + enemy.sWidth / 2;
		const dy = bullet.y - enemy.y + enemy.sHeight / 2;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Check if the distance is less than the sum of their radii
		// console.log(`${distance} < ${enemy.enemySize / 2}`);
		return distance < enemy.sHeight / 2;
	}

	updateBulletsAndEnemies(bullets, enemies, deltaTime) {
		for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
			const bullet = bullets[bulletIndex];

			for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
				const enemy = enemies[enemyIndex];

				if (enemy.state === "killed" || enemy.state === "dead") {
					continue;
				}

				// console.log("CHECKING COLLISION");

				if (this.checkCollision(bullet, enemy)) {
					// Handle collision
					enemy.takeDamage(bullet.damage); // Enemy takes damage
					bullets.splice(bulletIndex, 1); // Remove the bullet
					bulletIndex--; // Adjust index due to bullet removal
					if (enemy.health <= 0) {
						enemy.state = "killed"; // Mark enemy as killed
						setTimeout(() => {
							enemies.splice(enemyIndex, 1);
						}, 7000);
					}
					break; // Exit inner loop after collision
				}
			}
		}
	}
}
