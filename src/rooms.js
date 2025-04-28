import { clearAllTempBlockedRects, rooms as roomsData } from "./boundary";
import Door from "./Door";
import { spawnEnemy } from "./enemy";
import { currentRoom, showEndMessage, spawnPointX, spawnPointY } from "./store";

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
				if (room.doorPosition)
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
			if (this.rooms[key].door) this.rooms[key].door.update();
		}

		for (const key in this.rooms) {
			const room = this.rooms[key];
			if (room.cleared) continue;

			if (room.enemies && room.door) {
				const types = ["melee", "range", "bossRange"];
				const allSpawned = types.every((type) => {
					if (!room.summons[type]) {
						return true;
					}
					return (
						room.spawnedCount[type] - room.pendingSpawn[type] >=
						room.summons[type].total
					);
				});
				const allDead =
					game.enemies.length > 0 &&
					game.enemies.every(
						(val) => val.state === "dead" || val.state === "killed"
					);

				if (allSpawned && allDead && room.enemiesSpawned) {
					room.door.openDoor();
					room.cleared = true;
					return;
				}
			}

			if (this.isCharacterInRoom(room, game)) {
				if (room.spawnPoint) {
					spawnPointX.set(room.spawnPoint.x);
					spawnPointY.set(room.spawnPoint.y);
					return;
				}

				if (room.displayEnd) {
					showEndMessage.set(true);
					game.character.realX = 300;
					game.character.realY = 5989;
					return;
				}

				currentRoom.set(key);
				if (room.enemies.length === 0) {
					room.enemies = this.spawnEnemies(room, game);

					game.enemies.push(...room.enemies);
					room.enemiesSpawned = true;
				}

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

			// Only schedule one spawn per frame if needed
			if (aliveCount < max && room.spawnedCount[type] < total) {
				room.spawnedCount[type]++; // Reserve the spawn immediately
				room.pendingSpawn[type]++;

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
			if (this.rooms[key].door)
				this.rooms[key].door.draw(gl, camera, character);
		}
	}

	checkCollision(bullet, enemy) {
		const offset = enemy.sHeight / 2;
		const dx = bullet.x - enemy.x + offset;
		const dy = bullet.y - enemy.y + offset;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Check if the distance is less than the sum of their radii
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
						character.heal(bullet.damage * 0.09);
					} else if (bullet.effect == "freeze") {
						if (enemy.froze) {
							return;
						}

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
