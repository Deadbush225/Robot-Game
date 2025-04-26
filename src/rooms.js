import { clearAllTempBlockedRects, rooms as roomsData } from "./boundary";
import Door from "./Door";
import { spawnEnemy } from "./enemy";
import { currentRoom } from "./store";

export class RoomManager {
	constructor() {
		// Deep clone roomsData to avoid mutating the original import
		clearAllTempBlockedRects();
		this.rooms = {};
		let idx = 0;
		for (const key in roomsData) {
			if (roomsData.hasOwnProperty(key)) {
				const room = { ...roomsData[key] };
				room.id = idx++;
				room.door = new Door(
					room.doorPosition.x,
					room.doorPosition.y,
					room.doorPosition.orientation
				);
				room.pendingSpawn = { melee: 0, range: 0, bossRange: 0 };
				room.spawnedCount = { melee: 0, range: 0, bossRange: 0 };

				this.rooms[key] = room;
			}
		}
	}

	update(game, bullets, enemies, character, deltaTime) {
		for (const key in this.rooms) {
			this.rooms[key].door.update();
		}

		for (const key in this.rooms) {
			const room = this.rooms[key];
			if (room.cleared) continue;

			if (
				// we can try to keep the number of the number of enemies and decrement it when an enemy dies to be efficient
				room.enemies.filter((val) => val.state !== "dead").length === 0 &&
				room.enemiesSpawned
			) {
				console.log("ROOM CLEARED: ");
				room.door.openDoor();
				room.cleared = true;
				return;
			}

			if (this.isCharacterInRoom(room, game)) {
				currentRoom.set(key);
				if (room.enemies.length === 0) {
					room.enemies = this.spawnEnemies(room, game);
					console.log(room.enemies);
					game.enemies.push(...room.enemies);
					room.enemiesSpawned = true;
				}
				console.log("Entered Room");
				this.replenishEnemies(room, game);
			}
		}
		this.updateBulletsAndEnemies(bullets, enemies, character, game);
	}

	isCharacterInRoom(room, game) {
		const { realX: x, realY: y } = game.character;
		const { x: rx, y: ry, width, height } = room;
		return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
	}

	spawnEnemies(room, game) {
		const types = ["melee", "range", "bossRange"];

		const newEnemies = [];

		for (const type of types) {
			if (!room.summons[type]) {
				continue;
			}
			const { total, max } = room.summons[type];
			let toSpawn = Math.min(max, total - room.spawnedCount[type]);
			for (let i = 0; i < toSpawn; i++) {
				const enemy = spawnEnemy(
					room.x + Math.random() * room.width,
					room.y + Math.random() * room.height,
					type,
					room.skinVersion
				);

				newEnemies.push(enemy);
				room.spawnedCount[type]++;
			}
		}

		return newEnemies;
	}

	replenishEnemies(room, game) {
		const types = ["melee", "range", "bossRange"];

		// if (!room.enemies) room.enemies = [];

		for (const type of types) {
			// let type = "melee";
			if (!room.summons[type]) continue;

			const { total, max } = room.summons[type];

			let aliveCount =
				game.enemies.filter(
					(e) => e.type == type && e.state !== "dead" && e.state !== "killed"
				).length + room.pendingSpawn[type];

			// console.log(
			// 	aliveCount,
			// 	" < ",
			// 	max,
			// 	" && ",
			// 	room.spawnedCount[type],
			// 	" < ",
			// 	total
			// );
			// Only schedule one spawn per frame if needed
			if (aliveCount < max && room.spawnedCount[type] < total) {
				room.spawnedCount[type]++; // Reserve the spawn immediately
				room.pendingSpawn[type]++;
				// console.log("ROOM: ", room.skinVersion);

				setTimeout(() => {
					const enemy = spawnEnemy(
						room.x + Math.random() * room.width,
						room.y + Math.random() * room.height,
						type,
						room.skinVersion
					);
					game.enemies.push(enemy);
					room.pendingSpawn[type]--;
				}, 1000);
			}
		}
	}

	checkEnemies(room, game) {
		game.enemies = game.enemies.filter((e) => !e.isDead?.());
		if (game.enemies.length === 0) {
			room.cleared = true;
			room.door.openDoor();
		}
	}

	draw(gl, camera, character) {
		for (const key in this.rooms) {
			this.rooms[key].door.draw(gl, camera, character);
		}
	}

	checkCollision(bullet, enemy) {
		const offset = enemy.sHeight / 2;
		const dx = bullet.x - enemy.x + offset;
		const dy = bullet.y - enemy.y + offset;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Check if the distance is less than the sum of their radii
		// console.log(`${distance} < ${enemy.enemySize / 2}`);
		return distance < enemy.sHeight;
	}

	updateBulletsAndEnemies(bullets, enemies, character, game) {
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

						game.enemyDefeated(enemy); // to update the score
						// character.gameStats.enemiesDefeated++;

						const enemyToRemove = enemy;
						setTimeout(() => {
							const idx = enemies.indexOf(enemyToRemove);
							if (idx !== -1) {
								enemies.splice(idx, 1);
							}
						}, 3000);
					}

					if (bullet.effect == "life-steal") {
						character.heal(bullet.damage * 0.25);
					} else if (bullet.effect == "freeze") {
						if (enemy.froze) {
							return;
						}
						console.log("FREEZING:");
						let origSpeed = enemy.speed;
						enemy.speed = 0;
						enemy.froze = true;

						setTimeout(() => {
							enemy.speed = origSpeed;
							enemy.froze = false;
						}, 1000);
					}
					break; // Exit inner loop after collision
				}
			}
		}
	}
}
// ...existing code...
