import boundary_map from "./assets/boundary-map.png";
const boundaryImg = new Image();
boundaryImg.src = boundary_map;

let boundaryData; // To store pixel data for collision detection

let boundaryWidth;
let boundaryHeight;

let allowedCoordinates = [];

function getBoundaryData(image) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0);

	const imageData = context.getImageData(0, 0, image.width, image.height);

	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const index = (y * image.width + x) * 4; // RGBA index
			const red = imageData.data[index];
			const green = imageData.data[index + 1];
			const blue = imageData.data[index + 2];

			// Check if the pixel is white (R=255, G=255, B=255)
			if (red === 255 && green === 255 && blue === 255) {
				allowedCoordinates.push({ x, y });
			}
		}
	}
	console.log(allowedCoordinates[0]);

	return imageData;
}

boundaryImg.onload = () => {
	boundaryData = getBoundaryData(boundaryImg);
	console.log("Boundary map loaded");
	boundaryWidth = boundaryData.width;
	boundaryHeight = boundaryData.height;
};

export function getRandomAllowed() {
	return allowedCoordinates[
		Math.floor(Math.random() * allowedCoordinates.length)
	];
}

export function getAllowedCoordinates() {
	return allowedCoordinates;
}

export function isBlocked(x, y) {
	if (!boundaryData) return false; // Boundary data not loaded yet

	// Scale the relative position to match the boundary map's resolution
	const pixelX = Math.floor(x);
	const pixelY = Math.floor(y);

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
