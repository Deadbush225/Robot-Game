<script>
	import { onMount } from "svelte";
	import rock from "./assets/rock.png";
	import map from "./assets/map.png";
	import boundary_map from "./assets/boundary-map.png";
	import barriers_map from "./assets/barriers.png";
	import Character from "./character";
	import gun from "./assets/gun.png";
	import bulletsrc from "./assets/bullet.png";

	const bulletImg = new Image();
	bulletImg.src = bulletsrc;

	const mapsImg = new Image();
	mapsImg.src = map;

	const boundaryImg = new Image();
	boundaryImg.src = boundary_map;

	const barriersImg = new Image();
	barriersImg.src = barriers_map;

	let boundaryData; // To store pixel data for collision detection

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

	const gunImg = new Image();
	gunImg.src = gun;

	let bullet = {
		x: 0,
		y: 0,
		speed: 8,
	};

	// Update parseTileMap to use drawCharacter for the character
	function parseTileMap(tileMap, tileSize, context, image) {
		gl.fillStyle = "#849198"; // Set the fill color to black
		gl.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
		// context.clearRect(0, 0, canvas.width, canvas.height);
		// context.clearRect(character.realX - 100, character.realY - 100, 250, 250);
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
			mapImg,
			// boundaryImg,
			character.realX - camera.width / 2, // Source X (character centered horizontally)
			character.realY - camera.height / 2, // Source Y (character centered vertically)
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
		character.draw(
			gl,
			canvas.width / 2 - character.width / 2, // Center X position on the canvas
			canvas.height / 2 - character.height / 2 // Center Y position on the canvas
		);

		// Calculate the angle between the character and the mouse
		// Save the current context state
		gl.save();

		// Translate to the character's position
		gl.translate(
			canvas.width / 2 + (character.width * 1) / 5,
			canvas.height / 2 + (character.height * 2) / 5
		);

		// Rotate the canvas to the gun's angle
		if (character.face === 1) {
			gl.rotate(character.gunAngle + (135 * Math.PI) / 180);
		} else {
			gl.rotate(character.gunAngle + (45 * Math.PI) / 180);
		}

		// Draw the gun image, adjusting for its size
		const time = Date.now() / 150; // Adjust the speed of the up and down motion
		const amplitude = 3; // Adjust the amplitude of the motion
		const shakeX = 0; // No horizontal movement
		const shakeY = Math.sin(time) * amplitude; // Periodic up and down motion

		if (character.face === 1) {
			gl.scale(-1, 1); // Flip horizontally
		}

		gl.drawImage(
			gunImg,
			(-gunImg.width * camera.scale * 1.2) / 2 + shakeX,
			(-gunImg.height * camera.scale * 1.2) / 2 + shakeY,
			gunImg.width * camera.scale * 1.2,
			gunImg.height * camera.scale * 1.2
		);

		if (character.face === 1) {
			gl.scale(-1, 1); // Reset the horizontal flip
		}

		// Restore the context state
		gl.restore();

		// Draw bullets from the character's bullets array
		if (character.bullets) {
			character.bullets.forEach((bullet, index) => {
				// Draw the bullet
				const screenX =
					(bullet.x - (character.realX - camera.width / 2)) *
					(canvas.width / camera.width);
				const screenY =
					(bullet.y - (character.realY - camera.height / 2)) *
					(canvas.height / camera.height);

				// Save the current context state
				gl.save();

				// Translate to the bullet's position
				gl.translate(screenX, screenY);

				// Rotate the canvas to the bullet's angle
				gl.rotate(bullet.angle);

				// Draw the bullet image, adjusting for its size
				gl.drawImage(
					bulletImg,
					-25, // Center the image horizontally
					-25, // Center the image vertically
					50, // Width of the bullet
					50 // Height of the bullet
				);

				// Restore the context state
				gl.restore();
			});
		}
		// Draw a grid of dots with 100px gap
		/* ━━━━━━━━━━━━━━━━━━━━━━━ COPILOT ━━━━━━━━━━━━━━━━━━━━━━━━ */
		const gridGap = 100; // Gap between dots in pixels
		const dotRadius = 2; // Radius of each dot

		// Calculate the starting position of the grid based on the character's position and camera offset
		const startX =
			Math.floor((character.realX - camera.width / 2) / gridGap) * gridGap;
		const startY =
			Math.floor((character.realY - camera.height / 2) / gridGap) * gridGap;
		const endX = character.realX + camera.width / 2;
		const endY = character.realY + camera.height / 2;

		// Loop through the visible portion of the world to draw the grid CLUTCHED BY COPILOT
		for (let x = startX; x <= endX; x += gridGap) {
			for (let y = startY; y <= endY; y += gridGap) {
				// Convert world coordinates to screen coordinates
				const screenX =
					(x - (character.realX - camera.width / 2)) *
					(canvas.width / camera.width);
				const screenY =
					(y - (character.realY - camera.height / 2)) *
					(canvas.height / camera.height);

				// Draw the dot
				gl.fillStyle = isBlocked(x, y)
					? "rgba(255, 255, 255, 0.5)"
					: "rgba(255, 0, 255, 0)"; // Semi-transparent white
				gl.beginPath();
				gl.arc(screenX, screenY, dotRadius, 0, Math.PI * 2); // Draw a small circle
				gl.fill();
			}
		}
		/* ━━━━━━━━━━━━━━━━━━━━━━━ COPILOT ━━━━━━━━━━━━━━━━━━━━━━━━ */

		// gl.fillStyle = "red";
		// gl.beginPath();
		// gl.arc(
		// 	character.realX, // Adjust X position relative to the camera
		// 	character.realY, // Adjust Y position relative to the camera
		// 	5, // Radius of the dot
		// 	0,
		// 	Math.PI * 2
		// );
		// gl.fill();
		// Draw a dot at the character's location
		// gl.fillStyle = "red";
		// gl.beginPath();
		// gl.arc(
		// 	character.realX, // Adjust X position relative to the camera
		// 	character.realY, // Adjust Y position relative to the camera
		// 	5, // Radius of the dot
		// 	0,
		// 	Math.PI * 2
		// );
		// gl.fill();

		// Draw barriers or other elements if needed
		gl.drawImage(
			barriersImg,
			// boundaryImg,
			character.realX - camera.width / 2, // Source X (character centered horizontally)
			character.realY - camera.height / 2, // Source Y (character centered vertically)
			camera.width, // Source width
			camera.height, // Source height
			0, // Destination X
			0, // Destination Y
			canvas.width, // Destination width (stretch to fit canvas)
			canvas.height // Destination height (stretch to fit canvas)
		);

		// context.fillStyle = "red";
		// context.beginPath();
		// context.arc(character.realX, character.realY, 5, 0, Math.PI * 2);
		// context.fill();
		// }
		// }
		// }
	}

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

	let camera = {
		// x: 0, // Top-left corner of the camera
		// y: 0, // Top-left corner of the camera
		// width: 0, // Width of the visible area (adjust as needed)
		// height: 0, // Height of the visible area (adjust as needed)
		scale: 1.5,
		width_scale: 0,
		height_scale: 0,
		width: 0,
		height: 0,
	};

	function moveBox() {
		// Note: we deal objects here in world position
		// Calculate the center-bottom position of the character
		const centerX = character.realX + character.width / 2;
		const bottomY = character.realY + character.height;
		// const centerX = character.realX;
		// const bottomY = character.realY;

		// Horizontal movement
		if (keys.ArrowLeft) {
			const nextRealX = character.realX - character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX - character.width, bottomY)) {
				character.realX = nextRealX;
				character.face = 1;
			}
		}

		if (keys.ArrowRight) {
			const nextRealX = character.realX + character.speed;

			// Check collision at the new center-bottom position
			if (!isBlocked(nextRealX + character.width, bottomY)) {
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
			if (!isBlocked(centerX, nextRealY + character.height * 1.5)) {
				character.realY = nextRealY;
			}
		}

		if (character.bullets) {
			character.bullets.forEach((bullet, index) => {
				// Update bullet position
				bullet.x += bullet.dx;
				bullet.y += bullet.dy;

				// Remove bullets that go out of bounds
				if (isBlocked(bullet.x, bullet.y)) {
					character.bullets.splice(index, 1);
				}
			});
		}

		// Update grid position based on real position
		// character.gridX = Math.round(character.realX / 50);
		// character.gridY = Math.round(character.realY / 50);
		console.log(`Position: ${character.realX} x ${character.realY}`);

		if (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown) {
			character.state = 1;
		} else if (character.state != 2) {
			character.state = 0;
		}
	}

	let canvasAspectRatio;

	let character = new Character(camera.scale);

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
	}

	onMount(() => {
		canvas = document.getElementById("glCanvas");
		gl = canvas.getContext("2d");

		if (!gl) {
			console.error("Unable to initialize 2D context.");
			return;
		}

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		initializeGrid(gl);

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

		canvas.addEventListener("mousemove", (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			const dx = mouseX - centerX;
			const dy = mouseY - centerY;

			character.gunAngle = Math.atan2(dy, dx);
		});

		canvas.addEventListener("mousedown", (event) => {
			// Summon a bullet at the gun's location
			const bulletX = character.realX + (character.width * 1) / 5;
			const bulletY = character.realY + (character.height * 2) / 5;

			// Calculate the direction of the bullet based on the gun's angle
			const bulletSpeed = 10;
			const bulletDx = Math.cos(character.gunAngle) * bulletSpeed;
			const bulletDy = Math.sin(character.gunAngle) * bulletSpeed;

			// Create a new bullet object
			const newBullet = {
				x: bulletX,
				y: bulletY,
				dx: bulletDx,
				dy: bulletDy,
				angle: character.gunAngle,
			};

			// Add the bullet to an array to track its movement
			if (!character.bullets) {
				character.bullets = [];
			}
			character.bullets.push(newBullet);
		});

		// canvas.addEventListener("mousedown", (event) => {
		// 	// Debugging: Summon 10 bullets in all 360 directions
		// 	// const bulletX = character.realX + (character.width * 1) / 5;
		// 	// const bulletY = character.realY + (character.height * 2) / 5;
		// 	const bulletX = character.realX;
		// 	const bulletY = character.realY;
		// 	// console.log(`BULLET ORIGIN: ${bulletX} x ${bulletY}`);

		// 	const bulletSpeed = 10;
		// 	const totalBullets = 10;

		// 	for (let i = 0; i < totalBullets; i++) {
		// 		const angle = (i * 2 * Math.PI) / totalBullets; // Divide 360 degrees into equal parts
		// 		const bulletDx = Math.cos(angle) * bulletSpeed;
		// 		const bulletDy = Math.sin(angle) * bulletSpeed;

		// 		const newBullet = {
		// 			x: bulletX,
		// 			y: bulletY,
		// 			dx: bulletDx,
		// 			dy: bulletDy,
		// 			angle: angle,
		// 		};

		// 		if (!character.bullets) {
		// 			character.bullets = [];
		// 		}
		// 		character.bullets.push(newBullet);
		// 	}
		// });

		mapImg.onload = () => {
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
	.hbox {
		/* display: flex; */
		margin: 0 auto;
		width: fit-content;
		display: none;
	}
</style>
