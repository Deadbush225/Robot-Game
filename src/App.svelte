<script>
	import svelteLogo from "./assets/svelte.svg";
	import viteLogo from "/vite.svg";
	import Counter from "./lib/Counter.svelte";

	import { onMount } from "svelte";
	import mc from "./assets/robotFighter.png";
	import rock from "./assets/rock.png";

	import { flip } from "svelte/animate";

	let character = {
		realX: 300, // Actual X position in pixels
		realY: 100, // Actual Y position in pixels
		gridX: 6, // Grid position (column)
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

	const gravity = 0.2; // Gravity strength
	const jumpStrength = -5; // Initial upward velocity when jumping

	const img = new Image();
	img.src = mc;

	// const frameCount = 6; // Total number of frames in the sprite sheet
	const frameWidth = 64; // Width of each frame in the sprite sheet
	const frameHeight = 64; // Height of each frame in the sprite sheet
	// const animationSpeed = 100; // Time in milliseconds per frame

	let lastFrameTime = 0;
	let frame = 0;

	function drawCharacter(context, x, y) {
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

	// Update parseTileMap to use drawCharacter for the character
	function parseTileMap(tileMap, tileSize, context, image) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		const rows = tileMap.length;
		const cols = tileMap[0].length;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				if (tileMap[row][col] === 1) {
					context.drawImage(
						image,
						tileSize * 2,
						tileSize * 2,
						tileSize,
						tileSize, // Source coordinates and size
						col * 50,
						row * 50,
						50,
						50 // Destination coordinates and size
					);
				} else if (tileMap[row][col] === 2) {
					// drawCharacter(context, col * 50, row * 50);
					drawCharacter(context, character.realX, character.realY);
				}
			}
		}
	}

	let tileMap = [];
	let gridRows;
	let gridCols;

	function initializeGrid() {
		gridRows = Math.floor(canvas.height / 50);
		gridCols = Math.floor(canvas.width / 50);

		tileMap = Array.from({ length: gridRows }, () =>
			Array.from({ length: gridCols }, (_, index) =>
				index === 0 || index === gridCols - 1 ? 1 : 0
			)
		);
		tileMap[0].fill(1); // Fill the last row with obstacles
		tileMap[gridRows - 1].fill(1); // Fill the last row with obstacles
		for (let i = 3; i > 2; i--) {
			for (let j = 6; j < 10; j++) {
				tileMap[i][j] = 1;
			}
		}

		for (let i = gridRows - 4; i < gridRows - 1; i++) {
			for (let j = gridCols - i; j < 10; j++) {
				tileMap[i][j] = 1;
			}
		}
		tileMap[character.gridY][character.gridX] = 2; // Set initial character position
		console.log(tileMap);
	}

	const rockImg = new Image();
	rockImg.src = rock;

	rockImg.onload = () => {
		drawBox();
	};

	let canvas;
	let gl;

	function drawBox() {
		moveBox();
		// Update the tileMap with the character's position
		tileMap.forEach((row, rowIndex) => {
			row.forEach((tile, colIndex) => {
				if (tile === 2) tileMap[rowIndex][colIndex] = 0; // Clear previous character position
			});
		});
		tileMap[character.gridY][character.gridX] = 2; // Set new character position

		parseTileMap(tileMap, 54, gl, rockImg);
	}

	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
	};

	let lastMoveTime = 0; // Tracks the last time the character moved
	const moveCooldown = 50; // Cooldown in milliseconds

	function applyGravity() {
		const nextRealY = character.realY + (character.state == 2 ? 3 : 7);
		const nextGridY = Math.floor((nextRealY + character.height) / 50);

		const nextRealX = character.realX - character.width / 2;
		const nextGridX = Math.floor((nextRealX + character.width) / 50);

		// Check for barriers
		if (tileMap[nextGridY][nextGridX] !== 1) {
			character.realY = nextRealY;
		} else {
			jump_y = 0;
		}
	}
	let jump_y = 0;

	function moveBox() {
		// Horizontal movement
		if (keys.ArrowLeft) {
			const nextRealX = character.realX - character.speed;
			const nextGridX = Math.floor(nextRealX / 50);

			// Check for barriers
			if (tileMap[character.gridY][nextGridX] !== 1) {
				character.realX = nextRealX;
				character.face = 1;
			}
		}

		if (keys.ArrowRight) {
			const nextRealX = character.realX + character.speed;
			const nextGridX = Math.floor((nextRealX + character.width) / 50);

			// Check for barriers
			if (tileMap[character.gridY][nextGridX] !== 1) {
				character.realX = nextRealX;
				character.face = 0;
			}
		}

		// Vertical movement
		if (keys.ArrowUp && jump_y <= 20) {
			character.state = 2;
			jump_y++;

			if (jump_y == 40) {
				return;
			}

			const nextRealY = character.realY - character.speed * 6;
			const nextGridY = Math.floor(nextRealY / 50);

			// Check for barriers
			if (tileMap[nextGridY][character.gridX] !== 1) {
				character.realY = nextRealY;
			}
		}

		// if (keys.ArrowDown) {
		// 	const nextRealY = character.realY + character.speed;
		// 	const nextGridY = Math.floor((nextRealY + character.height) / 50);

		// 	// Check for barriers
		// 	if (tileMap[nextGridY][character.gridX] !== 1) {
		// 		character.realY = nextRealY;
		// 	}
		// }

		// Update grid position based on real position
		character.gridX = Math.round(character.realX / 50);
		character.gridY = Math.round(character.realY / 50);

		if (keys.ArrowLeft || keys.ArrowRight) {
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
				applyGravity();
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

	<canvas id="glCanvas" width="800" height="600"></canvas>

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
		display: flex;
		margin: 0 auto;
		width: fit-content;
	}
</style>
