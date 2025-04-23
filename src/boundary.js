import { get } from "svelte/store";
import boundary_map from "./assets/boundary-map.png";
import { currentRoom } from "./store";
import room_boundary from "./assets/rooms.png";

const boundaryImg = new Image();
boundaryImg.src = boundary_map;

const roomImg = new Image();
roomImg.src = room_boundary;

let roomData;
let boundaryData; // To store pixel data for collision detection

let boundaryWidth;
let boundaryHeight;

let allowedCoordinates = [];

export let rooms = {
	topRight: {
		positions: [],
		doorPosition: { x: 2784, y: 1056, orientation: "Horizontal" },
		cleared: false,
		enemies: [],
		x: 2496,
		y: 96,
		width: 1152,
		height: 1056,
		enemiesSpawned: false,
	},
	bottomRight: {
		positions: [],
		doorPosition: { x: 2400, y: 2016, orientation: "Vertical" },
		cleared: false,
		enemies: [],
		x: 2496,
		y: 1824,
		width: 1152,
		height: 1056,
		enemiesSpawned: false,
	},
};

function getBoundaryData(image) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0);

	const imageData = context.getImageData(0, 0, image.width, image.height);

	for (let y = 0; y < image.height; y += 5) {
		for (let x = 0; x < image.width; x += 5) {
			const index = (y * image.width + x) * 4; // RGBA index
			const red = imageData.data[index];
			const green = imageData.data[index + 1];
			const blue = imageData.data[index + 2];

			// Check if the pixel is white (R=255, G=255, B=255)
			if (red === 255 && green === 255 && blue === 255) {
				allowedCoordinates.push({ x, y });
			}
			if (red === 59 && green === 226 && blue === 219) {
				rooms.topRight.positions.push({ x, y });
			} else if (red === 47 && green === 173 && blue === 168) {
				rooms.bottomRight.positions.push({ x, y });
			}
			// } else if (red === 47 && green === 173 && blue === 168) {
			// 	rooms.bottomLeft.positions.push({ x, y });
			// }
		}
	}
	// console.log(rooms.topRight.positions);

	return imageData;
}

boundaryImg.onload = () => {
	boundaryData = getBoundaryData(boundaryImg);
	console.log("Boundary map loaded");
	boundaryWidth = boundaryData.width;
	boundaryHeight = boundaryData.height;
};

roomImg.onload = () => {
	roomData = getBoundaryData(roomImg);
};

export function getRandomAllowed() {
	return allowedCoordinates[
		Math.floor(Math.random() * allowedCoordinates.length)
	];
}

export function getRandomAllowedRoom() {
	console.log("CURRENT ROOM: " + get(currentRoom));
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
	console.log("REMOVING TEMP BLOCKS");
	console.log(tempBlockedRects);
	tempBlockedRects.get(id).active = false;
	tempBlockedRects.delete(id);
	console.log(tempBlockedRects);
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
		// console.log("OUT OF BOUNDS");
		return true; // Treat out-of-bounds as blocked
	}

	const index = (pixelY * boundaryWidth + pixelX) * 4; // RGBA index
	const red = boundaryData.data[index]; // Red channel

	return red === 0; // Black pixels (R=0) are blocked
}
