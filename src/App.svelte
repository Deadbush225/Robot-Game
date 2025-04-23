<script>
	import { assetLoader } from "./Assets";
	import GameOver from "./modals/gameover.svelte";
	import Menu from "./modals/menu.svelte";
	import Game from "./Game";

	import { isGameOver } from "./store";
	import { onMount } from "svelte";

	import { soundManager } from "./Sounds";
	import { togglePause, toggleMusic, toggleSFX } from "./pauseMenu";

	// let isGameOver = false;
	let gameStarted = false;
	let isPaused = false;
	let musicEnabled = true;
	let sfxEnabled = true;

	let tileMap = [];
	let gridRows;
	let gridCols;
	let loading = true;

	let canvas, gl, game;
	let saved_characterProps;

	function restartGame() {
		gameStart(saved_characterProps);
	}

	function quitGame() {
		gameStarted = false;
		isGameOver.set(false);
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

	function handleUserInteraction() {
		soundManager.play("bgm", true, "bgm");
		// Remove the event listener after first interaction
		window.removeEventListener("click", handleUserInteraction);
	}

	onMount(() => {
		assetLoader(() => {
			loading = false;
			gl = canvas.getContext("2d");

			if (!gl) {
				console.error("Unable to initialize 2D context.");
				return;
			}

			window.addEventListener("click", handleUserInteraction);
			gameStart();
		});

		// Set up keyboard event for ESC key
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && gameStarted) {
				isPaused = togglePause(game);
			}
		});
	});

	function gameStart(
		characterProps = {
			name: "TV man",
			descriptions: ["Faster speed", "Lower health"],
			speed: 350,
			health: 100,
			// health: 20,
			gun: "pistol",
			imgName: "character",
		}
	) {
		soundManager.setVolume("bgm", 0.3, "bgm");
		saved_characterProps = characterProps;

		game = new Game(canvas, gl, characterProps);
		game.createLevel(1);

		gameStarted = true;
		isPaused = false;
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
	<!-- {#if loading}
		<div class="loading-screen">
			<h1>Loading...</h1>
		</div>
	{/if}
	{#if !gameStarted && !loading}
		<Menu onStart={gameStart}></Menu>
	{/if}

	{#if $isGameOver}
		<GameOver
			message="Game Over! You died."
			onRestart={restartGame}
			onQuit={quitGame}
		/>
	{/if} -->
	<div>
		<canvas id="glCanvas" bind:this={canvas}></canvas>
	</div>


	<!-- Pause Button -->
    {#if gameStarted && !isPaused && !$isGameOver}
        <div class="pause-button">
            <button on:click={() => (isPaused = togglePause(game))}>Pause</button>
        </div>
    {/if}
    
    <!-- Pause Menu -->
    {#if gameStarted && isPaused && !$isGameOver}
        <div class="pause-menu">
            <h2>Game Paused</h2>
            <div class="menu-buttons">
                <button on:click={() => (isPaused = togglePause(game))}>Resume</button>
                <button on:click={restartGame}>Restart</button>
                <button on:click={() => (musicEnabled = toggleMusic())}>
                    {musicEnabled ? "Mute Music" : "Unmute Music"}
                </button>
                <button on:click={() => (sfxEnabled = toggleSFX())}>
                    {sfxEnabled ? "Mute SFX" : "Unmute SFX"}
                </button>
            </div>
        </div>
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

	.pause-button {
        position: absolute;
        top: 20px;
        right: 20px;
    }
    
    .pause-button button {
        padding: 8px 16px;
        background-color: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .pause-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 50;
    }
    
    .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }
    
    .menu-buttons button {
        padding: 10px 20px;
        background-color: #555;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 200px;
    }
    
    .menu-buttons button:hover {
        background-color: #777;
    }
</style>
