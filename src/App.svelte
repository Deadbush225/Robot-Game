<script>
	import svelteLogo from "./assets/svelte.svg";

	import { onMount } from "svelte";
	import mc from "./assets/robotFighter.png";
	import rock from "./assets/rock.png";
	import map from "./assets/map.png";
	import boundary_map from "./assets/boundary-map.png";
	import barriers_map from "./assets/barriers.png";
	import { scale } from "svelte/transition";

	const mapsImg = new Image();
	mapsImg.src = map;

	const boundaryImg = new Image();
	boundaryImg.src = boundary_map;

	const barriersImg = new Image();
	barriersImg.src = barriers_map;

	let boundaryData; // To store pixel data for collision detection

	let character = {
		realX: 500, // Actual X position in pixels
		realY: 500, // Actual Y position in pixels
		gridX: 2, // Grid position (column)
		gridY: 2, // Grid position (row)
		width: 50,
		height: 50,
		color: "#646cff",
		speed: 5, // pixel per frame// Grid movement speed
		face: 0,
		state: 0,
		// "Standing" | "Walking" | "Jumping",
		//
	};

	const img = new Image();
	img.src = mc;

	// const frameCount = 6; // Total number of frames in the sprite sheet
	const frameWidth = 64; // Width of each frame in the sprite sheet
	const frameHeight = 64; // Height of each frame in the sprite sheet
	// const animationSpeed = 100; // Time in milliseconds per frame

	let lastFrameTime = 0;
	let frame = 0;

	function drawCharacter(context, x, y) {
		// console.log(`${x} x ${y}`);
		switch (character.state) {
			case 2:
			case 0:
				drawStandingCharacter(context, x, y);
				break;
			case 1:
				drawWalkingCharacter(context, x, y);
				break;
		}
	}

	function animateSprite(frameCount, animationSpeed) {
		const currentTime = Date.now();
		frame = frame > frameCount ? 0 : frame;

		if (currentTime - lastFrameTime >= animationSpeed) {
			frame = (frame + 1) % frameCount; // Loop through frames
			lastFrameTime = currentTime;
		}
	}

	function drawStandingCharacter(context, x, y) {
		animateSprite(6, 100);

		if (character.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				img,
				frame * frameWidth + 15, // Source X position (frame index * frame width)
				11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				-x - character.width, // Adjust X position for flipped image
				y, // Destination Y position
				character.width * camera.scale, // Destination width
				character.height * camera.scale // Destination height
			);
			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				img,
				frame * frameWidth + 15, // Source X position (frame index * frame width)
				11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				character.width * camera.scale, // Destination width
				character.height * camera.scale // Destination height
			);
		}
		// console.log(`${x} x ${y}`);
		// console.log(`${x * camera.scale} x ${y * camera.scale}`);
	}

	function drawWalkingCharacter(context, x, y) {
		animateSprite(2, 200);

		if (character.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				img,
				frame * frameWidth + 15, // Source X position (frame index * frame width)
				64 + 60 + 15, // Source Y position for walking animation
				31, // Source width
				39, // Source height
				-x - character.width, // Adjust X position for flipped image
				y, // Destination Y position
				character.width * camera.scale, // Destination width
				character.height * camera.scale // Destination height
			);
			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				img,
				frame * frameWidth + 15, // Source X position (frame index * frame width)
				64 + 60 + 15, // Source Y position for walking animation
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				character.width * camera.scale, // Destination width
				character.height * camera.scale // Destination height
			);
		}
	}

	/**
	 * Draws a sprite from a spritesheet.
	 * @param {CanvasRenderingContext2D} context - The canvas rendering context.
	 * @param {HTMLImageElement} image - The spritesheet image.
	 * @param {number} srcX - The X coordinate of the source tile in the spritesheet.
	 * @param {number} srcY - The Y coordinate of the source tile in the spritesheet.
	 * @param {number} srcWidth - The width of the source tile.
	 * @param {number} srcHeight - The height of the source tile.
	 * @param {number} destX - The X coordinate on the canvas.
	 * @param {number} destY - The Y coordinate on the canvas.
	 * @param {number} destWidth - The width of the destination tile.
	 * @param {number} destHeight - The height of the destination tile.
	 */
	function drawSprite(
		context,
		image,
		srcX,
		srcY,
		srcWidth,
		srcHeight,
		destX,
		destY,
		destWidth,
		destHeight
	) {
		context.drawImage(
			image,
			srcX,
			srcY,
			srcWidth,
			srcHeight, // Source coordinates and size
			destX,
			destY,
			destWidth,
			destHeight // Destination coordinates and size
		);
	}

	const mapImg = new Image();
	mapImg.src = map;

	mapImg.onload = () => {
		drawBox();
	};

	const rockImg = new Image();
	rockImg.src = rock;

	rockImg.onload = () => {
		drawBox();
	};

	// Update parseTileMap to use drawCharacter for the character
	function parseTileMap(tileMap, tileSize, context, image) {
		context.clearRect(character.realX - 100, character.realY - 100, 250, 250);
		const rows = gridRows;
		const cols = gridCols;

		// console.log(`${rows} x ${cols}`);

		// for (let row = 0; row < rows; row++) {
		// 	for (let col = 0; col < cols; col++) {
		// 		const tileType = tileMap[row][col];

		// 		if (tileType.floor) {
		// 			tileHandlers[tileType.floor](context, row, col);
		// 		}

		// 		if (tileType.object) {
		// 			tileHandlers[tileType.object](context, row, col);
		// 		}
		// 	}
		// }

		// context.drawImage(boundaryImg, 0, 0, canvas.width, canvas.height);
		// for (let row = 0; row < rows; row++) {
		// for (let col = 0; col < cols; col++) {
		// const tileType = tileMap[row][col];
		// if (tileType.character) {

		// Draw the visible portion of the map
		// gl.drawImage(
		// 	mapsImg,
		// 	camera.x, // Source X (camera position)
		// 	camera.y, // Source Y (camera position)
		// 	camera.width, // Source width
		// 	camera.height, // Source height
		// 	0, // Destination X
		// 	0, // Destination Y
		// 	canvas.width, // Destination width (stretch to fit canvas)
		// 	canvas.height // Destination height (stretch to fit canvas)
		// );
		gl.drawImage(
			// mapImg,
			boundaryImg,
			camera.x, // Source X (camera position)
			camera.y, // Source Y (camera position)
			camera.width, // Source width
			camera.height, // Source height
			0, // Destination X
			0, // Destination Y
			canvas.width, // Destination width (stretch to fit canvas)
			canvas.height // Destination height (stretch to fit canvas)
		);

		// console.log(
		// 	`Is equal: ${mapImg.width / mapImg.height} x ${boundaryImg.width / boundaryImg.height}`
		// );

		// note: check if canvas aspect ratio is equal to camera aspect ratio

		// drawCharacter(
		// 	gl,
		// 	character.realX - camera.x, // Adjust X position relative to the camera
		// 	character.realY - camera.y // Adjust Y position relative to the camera
		// );
		// Draw the character relative to the camera
		drawCharacter(
			gl,
			canvas.width / 2 - character.width / 2, // Center X position on the canvas
			canvas.height / 2 - character.height / 2 // Center Y position on the canvas
		);
		// Draw a dot at the character's location
		// gl.fillStyle = "red";
		// gl.beginPath();
		// gl.arc(
		// 	character.realX - camera.x + character.width / 2, // Adjust X position relative to the camera
		// 	character.realY - camera.y + character.height, // Adjust Y position relative to the camera
		// 	5, // Radius of the dot
		// 	0,
		// 	Math.PI * 2
		// );
		// gl.fill();
		// Draw a dot at the character's location
		gl.fillStyle = "red";
		gl.beginPath();
		gl.arc(
			character.realX - camera.x, // Adjust X position relative to the camera
			character.realY - camera.y, // Adjust Y position relative to the camera
			5, // Radius of the dot
			0,
			Math.PI * 2
		);
		gl.fill();

		// Draw barriers or other elements if needed
		// gl.drawImage(
		// 	barriersImg,
		// 	camera.x,
		// 	camera.y,
		// 	camera.width,
		// 	camera.height,
		// 	0,
		// 	0,
		// 	canvas.width,
		// 	canvas.height
		// );

		// context.fillStyle = "red";
		// context.beginPath();
		// context.arc(character.realX, character.realY, 5, 0, Math.PI * 2);
		// context.fill();
		// }
		// }
		// }
	}
	// let tileMap = [
	//     [
	//         { floor: 1, object: null, decoration: null }, // Floor with no object or decoration
	//         { floor: 1, object: 3, decoration: 5 },      // Floor with a wall and decoration
	//     ],
	// ];
	let tileMap = [];
	let gridRows;
	let gridCols;

	function getBoundaryData(image) {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		canvas.width = image.width;
		canvas.height = image.height;

		context.drawImage(image, 0, 0);
		return context.getImageData(0, 0, image.width, image.height);
	}

	let boundaryWidth;
	let boundaryHeight;

	boundaryImg.onload = () => {
		boundaryData = getBoundaryData(boundaryImg);
		console.log("Boundary map loaded");
		boundaryWidth = boundaryData.width;
		boundaryHeight = boundaryData.height;
	};

	function initializeGrid(context) {
		gridRows = Math.floor(canvas.height / 50);
		gridCols = Math.floor(canvas.width / 50);

		// tileMap = Array.from({ length: gridRows }, (_, rowIndex) =>
		// 	Array.from({ length: gridCols }, (_, colIndex) => ({
		// 		floor: 1, // Default floor type
		// 		object: (() => {
		// 			if (colIndex === 0 || colIndex === gridCols - 1) {
		// 				return 4; // Walls on the left and right edges
		// 			}
		// 			if (rowIndex === 0 || rowIndex === gridRows - 1) {
		// 				return 3; // Walls on the top and bottom edges
		// 			}
		// 			return 0; // Default case
		// 		})(),
		// 		character: false,
		// 	}))
		// );
		// console.log(tileMap);
		// // Add specific objects or walls
		// // tileMap[2][2].object = 2; // Example: Add an object at (2, 2)
		// // tileMap[3][3].object = 3; // Example: Add a wall at (3, 3)
		// tileMap[character.gridY][character.gridX].character = true;
		// console.log(tileMap);
	}

	let canvas;
	let gl;

	function drawBox() {
		moveBox();
		// Update the tileMap with the character's position
		// tileMap.forEach((row, rowIndex) => {
		// 	row.forEach((tile, colIndex) => {
		// 		if (tile === 2) tileMap[rowIndex][colIndex] = 0; // Clear previous character position
		// 	});
		// });
		// tileMap[character.gridY][character.gridX] = 2; // Set new character position

		parseTileMap(tileMap, 54, gl, rockImg);
	}

	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	};

	function isBlocked(x, y) {
		if (!boundaryData) return false; // Boundary data not loaded yet

		// Adjust the character's position relative to the camera
		// console.log(`${scaleX} x ${scaleY}`);

		// Scale the relative position to match the boundary map's resolution
		const pixelX = Math.floor(x * camera.scale);
		const pixelY = Math.floor(y * camera.scale);

		// console.log(`B D:${boundaryWidth} x ${boundaryHeight}`);
		// console.log(`${x} x ${y}`);
		// console.log(`${pixelX} x ${pixelY}`);

		// Ensure the coordinates are within bounds
		if (
			pixelX < 0 ||
			pixelX >= boundaryWidth ||
			pixelY < 0 ||
			pixelY >= boundaryHeight
		) {
			console.log("OUT OF BOUNDS");
			return true; // Treat out-of-bounds as blocked
		}

		const index = (pixelY * boundaryWidth + pixelX) * 4; // RGBA index
		console.log(index);
		const red = boundaryData.data[index]; // Red channel
		console.log(red);

		return red === 0; // Black pixels (R=0) are blocked
	}

	let camera = {
		x: 0, // Top-left corner of the camera
		y: 0, // Top-left corner of the camera
		// width: 0, // Width of the visible area (adjust as needed)
		// height: 0, // Height of the visible area (adjust as needed)
		scale: 1.5,
		// width_scale: 0,
		// height_scale: 0,
		width: 0,
		height: 0,
	};

	function moveBox() {
		// Calculate the center-bottom position of the character
		// const centerX = character.realX + character.width / 2;
		// const bottomY = character.realY + character.height;
		const centerX = character.realX;
		const bottomY = character.realY;

		// Horizontal movement
		if (keys.ArrowLeft) {
			const nextRealX = character.realX - character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX, bottomY)) {
				character.realX = nextRealX;
				character.face = 1;
			}
		}

		if (keys.ArrowRight) {
			const nextRealX = character.realX + character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX, bottomY)) {
				character.realX = nextRealX;
				character.face = 0;
			}
		}

		// Vertical movement
		if (keys.ArrowUp) {
			const nextRealY = character.realY - character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(centerX, nextRealY)) {
				character.realY = nextRealY;
			}
		}

		if (keys.ArrowDown) {
			const nextRealY = character.realY + character.speed;

			// Check collision at the new center-bottom position\
			if (!isBlocked(centerX, nextRealY)) {
				character.realY = nextRealY;
			}
		}

		// Update grid position based on real position
		// character.gridX = Math.round(character.realX / 50);
		// character.gridY = Math.round(character.realY / 50);
		console.log(`CAMERA: ${camera.x} x ${camera.y}`);

		// // Update camera position
		// const padding = 500; // Padding before the camera starts moving

		// if (character.realX < camera.x + padding) {
		// 	camera.x = Math.max(0, character.realX - padding - character.speed);
		// 	// return;
		// }
		// if (character.realX > camera.x + camera.width - padding) {
		// 	camera.x = Math.min(
		// 		mapImg.width - camera.width,
		// 		character.realX - camera.width + padding + character.speed
		// 	);
		// }
		// if (character.realY < camera.y + padding) {
		// 	camera.y = Math.max(0, character.realY - padding - character.speed);
		// 	// return;
		// }
		// if (character.realY > camera.y + camera.height - padding) {
		// 	camera.y = Math.min(
		// 		mapImg.height - camera.height,
		// 		character.realY - camera.height + padding + character.speed
		// 	);
		// }

		if (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown) {
			character.state = 1;
		} else if (character.state != 2) {
			character.state = 0;
		}
	}

	let canvasAspectRatio;
	onMount(() => {
		canvas = document.getElementById("glCanvas");
		gl = canvas.getContext("2d");

		if (!gl) {
			console.error("Unable to initialize 2D context.");
			return;
		}

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			canvasAspectRatio = canvas.width / canvas.height;

			// Set the scale so that the minimum height matches the image's height

			// set the value from the with (but make is so that it will depend on who is smaller)
			// camera.width = Math.floor(96 * 15);
			// camera.height = Math.floor(camera.width / canvasAspectRatio);

			// if (96 * 15 > mapImg.height) { // minimum 15 blocks height
			//     camera.scale = mapImg.width / 96 * 15;
			// } else {
			// }

			camera.scale = 1.5;
			// camera.scale = mapImg.width / (96 * 30);
			camera.width = canvas.width * camera.scale;
			camera.height = canvas.height * camera.scale;

			camera.width_scale = mapImg.width / camera.width;
			camera.height_scale = mapImg.height / camera.height;
			// console.log(`${camera.width_scale} x ${camera.height_scale}`);
		}

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		initializeGrid(gl);

		// document.addEventListener("keydown", moveBox);

		document.addEventListener("keydown", (e) => {
			// console.log(`KEY DOWN: ${e.key}`);
			if (keys.hasOwnProperty(e.key)) {
				// console.log(`SETTING: ${e.key}`);
				// console.log(
				// 	`POSITION: ${character.realX + 20} ${character.realY + 20} `
				// );
				// console.log(`GRID: ${character.gridX} ${character.gridY} `);
				keys[e.key] = true;
			}
		});

		document.addEventListener("keyup", (e) => {
			// console.log(`KEY DOWN: ${e.key}`);
			if (keys.hasOwnProperty(e.key)) {
				// console.log(`RESETTING: ${e.key}`);
				keys[e.key] = false;
			}
		});

		img.onload = () => {
			function gameLoop() {
				moveBox();

				drawBox();
				requestAnimationFrame(gameLoop);
			}

			requestAnimationFrame(gameLoop);
		};
	});
</script>

<main>
	<div>
		<canvas id="glCanvas"></canvas>
	</div>
</main>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.read-the-docs {
		color: #888;
	}

	.hbox {
		/* display: flex; */
		margin: 0 auto;
		width: fit-content;
		display: none;
	}
</style>
