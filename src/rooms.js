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
				this.rooms[key] = room;
			}
		}
	}

	update(game) {
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
					room.enemies = this.spawnEnemies(room);
					console.log(room.enemies);
					game.enemies.push(...room.enemies);
					room.enemiesSpawned = true;
				}
				console.log("Entered Room");
			}
		}
	}

	isCharacterInRoom(room, game) {
		const { realX: x, realY: y } = game.character;
		const { x: rx, y: ry, width, height } = room;
		return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
	}

	spawnEnemies(room) {
		console.log("Spawning in room: ", room);
		return Array.from({ length: 5 }, () =>
			spawnEnemy(
				room.x + Math.random() * room.width,
				room.y + Math.random() * room.height,
				1
			)
		);
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
}
// ...existing code...
