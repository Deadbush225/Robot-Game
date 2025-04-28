import { get } from "svelte/store";
import boundary_map from "./assets/boundary-map.png";
import { currentRoom } from "./store";
import room_boundary from "./assets/rooms.png";

const boundaryImg = new Image();
boundaryImg.src = boundary_map;

const roomImg = new Image();
roomImg.src = room_boundary;

let roomData; // stores it per room
let boundaryData; // To store pixel data for collision detection

let boundaryWidth;
let boundaryHeight;

let allowedCoordinates = [];

export let rooms = {
	basic: {
		positions: [],
		doorPosition: { x: 320, y: 4096, orientation: "Horizontal" },
		cleared: false,
		enemies: [],
		x: 95, // 1px outside the colored room coords
		y: 4189, //
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 4, max: 2 },
		},
		skinVersion: 1,
	},
	enemy_1_01: {
		positions: [],
		doorPosition: { x: 320, y: 2880, orientation: "Horizontal" },
		cleared: false,
		enemies: [],
		x: 95,
		y: 2935,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 5, max: 2 },
			range: { total: 2, max: 2 },
		},
		skinVersion: 1,
	},
	enemy_1_02: {
		positions: [],
		doorPosition: { x: 800, y: 1888 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 95,
		y: 1721,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 5, max: 5 },
			range: { total: 5, max: 2 },
		},
		skinVersion: 1,
	},
	boss_1: {
		positions: [],
		doorPosition: { x: 2208, y: 480 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 1184,
		y: 122,
		width: 1022,
		height: 990,
		enemiesSpawned: false,
		summons: {
			melee: { total: 10, max: 4 },
			range: { total: 10, max: 2 },
			bossRange: { total: 3, max: 1 },
		},
		skinVersion: 1,
	},
	enemy_1_03: {
		positions: [],
		doorPosition: { x: 3424, y: 1888 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 2721,
		y: 1723,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 10, max: 5 },
			range: { total: 5, max: 2 },
		},
		skinVersion: 1,
	},
	enemy_2_01: {
		positions: [],
		doorPosition: { x: 4160, y: 3552, orientation: "Horizontal" },
		cleared: false,
		enemies: [],
		x: 3937,
		y: 2941,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 7, max: 3 },
			range: { total: 5, max: 2 },
		},
		skinVersion: 2,
	},
	enemy_2_02: {
		positions: [],
		doorPosition: { x: 5856, y: 4320 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 5153,
		y: 4157,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 10, max: 4 },
			range: { total: 5, max: 3 },
		},
		skinVersion: 2,
	},
	enemy_2_03: {
		positions: [],
		doorPosition: { x: 6336, y: 5536 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 6369,
		y: 5373,
		width: 706,
		height: 605,
		enemiesSpawned: false,
		summons: {
			melee: { total: 12, max: 5 },
			range: { total: 6, max: 2 },
		},
		skinVersion: 2,
	},
	boss_2: {
		positions: [],
		doorPosition: { x: 4992, y: 6942 - 32 - 1, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 5024,
		y: 6629,
		width: 1024,
		height: 959,
		enemiesSpawned: false,
		summons: {
			melee: { total: 10, max: 4 },
			range: { total: 10, max: 2 },
			bossRange: { total: 6, max: 2 },
		},
		skinVersion: 2,
	},
	spawnPoint2: {
		cleared: false,
		x: 5152,
		y: 2981,
		width: 704,
		height: 572,
		spawnPoint: { x: 5500, y: 3227 },
	},
	end: {
		cleared: false,
		x: 3808,
		y: 6787,
		width: 704,
		height: 572,
		displayEnd: true,
	},
};

function getBoundaryData(image) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0);

	const imageData = context.getImageData(0, 0, image.width, image.height);

	for (let y = 0; y < image.height; y += 20) {
		for (let x = 0; x < image.width; x += 20) {
			const index = (y * image.width + x) * 4; // RGBA index
			const red = imageData.data[index];
			const green = imageData.data[index + 1];
			const blue = imageData.data[index + 2];

			// Check if the pixel is white (R=255, G=255, B=255)
			if (red === 255 && green === 255 && blue === 255) {
				allowedCoordinates.push({ x, y });
			} else if (red === 255 && green === 157 && blue === 157) {
				rooms.basic.positions.push({ x, y });
			} else if (red === 237 && green === 140 && blue === 140) {
				// rgb(237, 140, 140)
				rooms.enemy_1_01.positions.push({ x, y });
			} else if (red === 199 && green === 131 && blue === 131) {
				// rgb(199, 131, 131)
				rooms.enemy_1_02.positions.push({ x, y });
			} else if (red === 211 && green === 111 && blue === 111) {
				// rgb(211, 111, 111)
				rooms.boss_1.positions.push({ x, y });
			} else if (red === 202 && green === 132 && blue === 132) {
				// rgb(202, 132, 132)
				rooms.enemy_1_03.positions.push({ x, y });
			}

			if (red === 130 && green === 224 && blue === 232) {
				// 	rgb(130, 224, 232)
				rooms.enemy_2_01.positions.push({ x, y });
			} else if (red === 71 && green === 240 && blue === 255) {
				// rgb(71, 240, 255)
				rooms.enemy_2_02.positions.push({ x, y });
			} else if (red === 106 && green === 197 && blue === 205) {
				// rgb(106, 197, 205)
				rooms.enemy_2_03.positions.push({ x, y });
			} else if (red === 16 && green === 183 && blue === 197) {
				// rgb(16, 183, 197)
				rooms.boss_2.positions.push({ x, y });
			}
		}
	}

	return imageData;
}

boundaryImg.onload = () => {
	boundaryData = getBoundaryData(boundaryImg);
	boundaryWidth = boundaryData.width;
	boundaryHeight = boundaryData.height;
};

roomImg.onload = () => {
	getBoundaryData(roomImg);
};

export function getRandomAllowed() {
	return allowedCoordinates[
		Math.floor(Math.random() * allowedCoordinates.length)
	];
}

export function getRandomAllowedRoom() {
	return rooms[get(currentRoom)].positions[
		Math.floor(Math.random() * rooms[get(currentRoom)].positions.length)
	];
}

export function getAllowedCoordinates() {
	return allowedCoordinates;
}

// List of rectangles to treat as blocked: {x, y, width, height, active}
let tempBlockedRects = new Map();
let tempBlockIdCounter = 1;

export function clearAllTempBlockedRects() {
	tempBlockedRects.clear();
}

// why is there multiple (3) doors added even though we only add (2)
export function addTempBlockedRect(rect) {
	const id = tempBlockIdCounter++;
	// rect._tempBlockId = id;
	tempBlockedRects.set(id, rect);
	return id;
}

export function removeTempBlockedRect(id) {
	tempBlockedRects.get(id).active = false;
	tempBlockedRects.delete(id);
}

export function isBlocked(x, y) {
	if (!boundaryData) return false; // Boundary data not loaded yet

	// Scale the relative position to match the boundary map's resolution
	const pixelX = Math.floor(x);
	const pixelY = Math.floor(y);

	// Check if (x, y) is inside any temp blocked rectangle
	for (const rect of tempBlockedRects.values()) {
		if (
			rect.active && // Only block if active
			pixelX >= rect.x &&
			pixelX < rect.x + rect.width &&
			pixelY >= rect.y &&
			pixelY < rect.y + rect.height
		) {
			return true;
		}
	}

	// Ensure the coordinates are within bounds
	if (
		pixelX < 0 ||
		pixelX >= boundaryWidth ||
		pixelY < 0 ||
		pixelY >= boundaryHeight
	) {
		return true; // Treat out-of-bounds as blocked
	}

	const index = (pixelY * boundaryWidth + pixelX) * 4; // RGBA index
	const red = boundaryData.data[index]; // Red channel

	return red === 0; // Black pixels (R=0) are blocked
}
