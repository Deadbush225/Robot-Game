<script>
	import svelteLogo from "./assets/svelte.svg";

	import { onMount } from "svelte";
	import mc from "./assets/robotFighter.png";
	import rock from "./assets/rock.png";
	import map from "./assets/map.png";
	import boundary_map from "./assets/boundary-map.png";

	const mapsImg = new Image();
	mapsImg.src = map;

	const boundaryImg = new Image();
	boundaryImg.src = boundary_map;

	let boundaryData; // To store pixel data for collision detection

	let character = {
		realX: 100, // Actual X position in pixels
		realY: 100, // Actual Y position in pixels
		gridX: 2, // Grid position (column)
		gridY: 2, // Grid position (row)
		width: 50,
		height: 50,
		color: "#646cff",
		speed: 2, // pixel per frame// Grid movement speed
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
				character.width, // Destination width
				character.height // Destination height
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
				character.width, // Destination width
				character.height // Destination height
			);
		}
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
				character.width, // Destination width
				character.height // Destination height
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
				character.width, // Destination width
				character.height // Destination height
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

	const tileHandlers = {
		1: (context, row, col) => {
			// Draw floor
			// console.log("drawing floor");
			let tileSize = 96;
			drawSprite(
				context,
				mapImg,
				tileSize * 0,
				tileSize * 2, // Source coordinates for floor
				tileSize,
				tileSize, // Source size
				col * 50,
				row * 50, // Destination coordinates
				50,
				50 // Destination size
			);
		},
		// 2: (context) => {
		// 	// Draw character
		// 	drawCharacter(context, character.realX, character.realY);
		// },
		3: (context, row, col) => {
			// Draw wall
			let tileSize = 96;
			drawSprite(
				context,
				mapImg,
				tileSize * 0,
				tileSize * 5, // Source coordinates for floor
				tileSize,
				tileSize, // Source size
				col * 50,
				row * 50, // Destination coordinates
				50,
				50 // Destination size
			);
		},
		4: (context, row, col) => {
			// Draw wall
			let tileSize = 96;
			drawSprite(
				context,
				mapImg,
				tileSize * 1,
				tileSize * 2, // Source coordinates for floor
				tileSize,
				tileSize, // Source size
				col * 50,
				row * 50, // Destination coordinates
				50,
				50 // Destination size
			);
		},
		// Add more handlers for other tile types as needed
	};

	// Update parseTileMap to use drawCharacter for the character
	function parseTileMap(tileMap, tileSize, context, image) {
		// context.clearRect(0, 0, canvas.width, canvas.height);
		const rows = tileMap.length;
		const cols = tileMap[0].length;

		// console.log(`${rows} x ${cols}`);

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const tileType = tileMap[row][col];

				if (tileType.floor) {
					tileHandlers[tileType.floor](context, row, col);
				}

				if (tileType.object) {
					tileHandlers[tileType.object](context, row, col);
				}
			}
		}

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const tileType = tileMap[row][col];

				if (tileType.character) {
					drawCharacter(context, character.realX, character.realY);
				}
			}
		}
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

	boundaryImg.onload = () => {
		boundaryData = getBoundaryData(boundaryImg);
		console.log("Boundary map loaded");
	};

	function initializeGrid() {
		// gridRows = Math.floor(canvas.height / 50);
		// gridCols = Math.floor(canvas.width / 50);
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

	function moveBox() {
		// Horizontal movement
		if (keys.ArrowLeft) {
			const nextRealX = character.realX - character.speed;
			const nextGridX = Math.floor(nextRealX / 50);

			// Check for barriers
			if (!tileMap[character.gridY][nextGridX]?.object) {
				character.realX = nextRealX;
				character.face = 1;
			}
		}

		if (keys.ArrowRight) {
			const nextRealX = character.realX + character.speed;
			const nextGridX = Math.floor((nextRealX + character.width) / 50);

			// Check for barriers
			if (!tileMap[character.gridY][nextGridX]?.object) {
				character.realX = nextRealX;
				character.face = 0;
			}
		}

		// Vertical movement
		if (keys.ArrowUp) {
			const nextRealY = character.realY - character.speed;
			const nextGridY = Math.floor(nextRealY / 50);

			// Check for barriers
			if (!tileMap[nextGridY][character.gridX]?.object) {
				character.realY = nextRealY;
			}
		}

		if (keys.ArrowDown) {
			const nextRealY = character.realY + character.speed;
			const nextGridY = Math.floor((nextRealY + character.height) / 50);

			// Check for barriers
			if (!tileMap[nextGridY][character.gridX]?.object) {
				character.realY = nextRealY;
			}
		}

		// Update grid position based on real position
		character.gridX = Math.round(character.realX / 50);
		character.gridY = Math.round(character.realY / 50);

		if (keys.ArrowLeft || keys.ArrowRight || keys.ArrowUp || keys.ArrowDown) {
			character.state = 1;
		} else if (character.state != 2) {
			character.state = 0;
		}
	}

	onMount(() => {
		canvas = document.getElementById("glCanvas");
		gl = canvas.getContext("2d");

		if (!gl) {
			console.error("Unable to initialize 2D context.");
			return;
		}

		function resizeCanvas() {
			canvas.width = Math.floor(window.innerWidth / 50) * 50;
			canvas.height = Math.floor(window.innerHeight / 50) * 50;
		}

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		initializeGrid();

		// document.addEventListener("keydown", moveBox);

		document.addEventListener("keydown", (e) => {
			// console.log(`KEY DOWN: ${e.key}`);
			if (keys.hasOwnProperty(e.key)) {
				// console.log(`SETTING: ${e.key}`);
				console.log(
					`POSITION: ${character.realX + 20} ${character.realY + 20} `
				);
				console.log(`GRID: ${character.gridX} ${character.gridY} `);
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
	<!-- <div>
		<a href="https://vite.dev" target="_blank" rel="noreferrer">
			<img src={viteLogo} class="logo" alt="Vite Logo" />
		</a>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
		</a>
	</div> -->
	<div class="hbox">
		<h1>Welcome to PUP-knight</h1>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
		</a>
	</div>

	<canvas id="glCanvas"></canvas>

	<!-- <div class="card">
		<Counter />
	</div> -->

	<!-- <p>Things to plan:</p>

	<ol>
		<li>
			Define the game mechanics
			<ul>
				<li>Player controls and movement</li>
				<li>Combat system</li>
				<li>Scoring and rewards</li>
				<li>Win and lose conditions</li>
			</ul>
		</li>
		<li>Design the characters and environment</li>
		<li>Develop the levels and objectives</li>
		<li>Test and refine the gameplay</li>
		<li>Launch and gather feedback</li>
	</ol> -->
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

	canvas {
		width: 100vw;
		height: 100vh;
	}
</style>
