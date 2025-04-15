<script>
	import { assetLoader } from "./Assets";
	import GameOver from "./modals/gameover.svelte";
	import Menu from "./modals/menu.svelte";
	import Game from "./Game";

	import { isGameOver } from "./store";
	import { onMount } from "svelte";
	// let isGameOver = false;
	let gameStarted = false;

	let tileMap = [];
	let gridRows;
	let gridCols;
	let loading = true;

	let canvas, gl, game;

	function restartGame() {
		game.restartLevel();
	}

	function quitGame() {
		console.log("Quit game");
	}

	function initializeGrid(context) {
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

	onMount(() => {
		assetLoader(() => {
			// loading = false;
			gl = canvas.getContext("2d");

			if (!gl) {
				console.error("Unable to initialize 2D context.");
				return;
			}
			game = new Game(canvas, gl);
		});
	});
	function gameStart() {
		gameStarted = true;

		// assetLoader(() => {
		// setTimeout(() => {
		game.createLevel(1);
		// }, 5000);
		// });
	}

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

	// mapImg.onload = () => {
	// let enemy = spawnEnemy(character.realX, character.realY);
	// enemies.push(enemy);

	// function gameLoop() {
	// moveBox();

	// drawBox();

	// requestAnimationFrame(gameLoop);
	// }

	// requestAnimationFrame(gameLoop);
	// };
</script>

<main>
	{#if !gameStarted}
		<Menu onStart={gameStart}></Menu>
	{/if}
	<!-- {#if !gameStarted}
    <div class="loading-screen">
        <h1>Loading...</h1>
		</div>
        {/if} -->
	<div>
		<canvas id="glCanvas" bind:this={canvas}></canvas>
	</div>
	{#if $isGameOver}
		<GameOver
			message="Game Over! You died."
			onRestart={restartGame}
			onQuit={quitGame}
		/>
	{/if}
</main>

<style>
	.hbox {
		/* display: flex; */
		margin: 0 auto;
		width: fit-content;
		display: none;
	}

	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 1);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
	}
</style>
