<script>
	import { assetLoader } from "./Assets";
	import Game from "./Game";

	import Paused from "./modals/paused.svelte";
	import GameOver from "./modals/gameover.svelte";
	import Menu from "./modals/menu.svelte";
	import Button from "./modals/button.svelte";
	import Leaderboard from "./modals/Leaderboard.svelte";
	import GameMessage from "./modals/gameMessage.svelte";
	import Tutorial from "./modals/Tutorial.svelte";

	import { isGameOver, showEndMessage, showLeaderBoards } from "./store";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

	import { soundManager } from "./Sounds";
	import { togglePause } from "./pauseMenu";

	import LeaderboardService from "./LeaderboardService";

	// let showingLeaderboard = false;

	import { load } from "./enemy";

	// let isGameOver = false;
	let gameStarted = false;
	let isPaused = false;
	// let musicEnabled = true;
	// let sfxEnabled = true;

	let loading = true;

	let canvas, gl, game;
	let saved_characterProps;

	function showMenu() {
		isPaused = false;
		gameStarted = false;
	}

	function restartGame() {
		gameStart(saved_characterProps);
	}

	function quitGame() {
		gameStarted = false;
		isGameOver.set(false);
	}

	function showLeaderboard() {
		showLeaderBoards.set(true);
	}

	async function submitScoreAndShowLeaderboard(playerName) {
		// if (game.character.healthBar.health <= 0) {
		// Force synchronization before submission
		game.syncCoins();

		const scoreData = {
			playerName: playerName,
			score: game.calculateFinalScore(),
			enemiesDefeated: game.gameStats.enemiesDefeated,
			coinsCollected: game.gameStats.coinsCollected,
		};

		// Actually submit score
		try {
			await game.leaderboardService.submitScore(scoreData);
			console.log("Score submitted successfully:", scoreData);
		} catch (error) {
			console.error("Error submitting score:", error);
		}
		// }
	}

	// pang toggle ng leaderboard visibility
	function toggleLeaderboard() {
		showLeaderBoards.set(!get(showLeaderBoards));
	}

	function handleUserInteraction() {
		soundManager.play("bgm", true, "bgm");
		// Remove the event listener after first interaction
		window.removeEventListener("click", handleUserInteraction);
	}

	let showTutorial = false;
	let pendingCharacterProps = null;

	function handleMenuStart(characterProps) {
		pendingCharacterProps = characterProps;
		showTutorial = true;
	}

	function handleTutorialClose() {
		showTutorial = false;
		gameStart(pendingCharacterProps); // your existing start logic
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
			load();
		});

		// Set up keyboard event for ESC key
		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && gameStarted) {
				isPaused = togglePause(game);
			}
		});
	});

	function gameStart(characterProps) {
		// characterProps = {
		// 	name: "TV man",
		// 	descriptions: ["Faster speed", "Lower health"],
		// 	speed: 350,
		// 	health: 100,
		// 	// health: 20,
		// 	gun: "shotgun",
		// 	imgName: "character",
		// };
		// soundManager.setVolume("bgm", 1.0);
		saved_characterProps = characterProps;

		game = new Game(canvas, gl, characterProps);
		game.leaderboardService = new LeaderboardService();
		game.createLevel(1);

		gameStarted = true;
		isPaused = false;
	}
</script>

<main>
	{#if loading}
		<div class="loading-screen">
			<h1>Loading...</h1>
		</div>
	{/if}

	{#if isPaused}
		<Paused
			onGamePause={() => {
				isPaused = togglePause(game);
			}}
			onShowMenu={showMenu}
			{restartGame}
		></Paused>
	{/if}

	{#if $showEndMessage == true}
		<GameMessage
			onSubmitScore={submitScoreAndShowLeaderboard}
			onShowMenu={showMenu}
		></GameMessage>
	{/if}

	<!-- {#if !gameStarted && !loading}
		<Menu onStart={gameStart} onShowLeaderboard={showLeaderboard}></Menu>
	{/if} -->
	{#if showTutorial}
		<Tutorial on:close={handleTutorialClose} />
	{:else if !gameStarted && !loading}
		<Menu onStart={handleMenuStart} onShowLeaderboard={showLeaderboard} />
	{/if}

	{#if $isGameOver}
		<GameOver
			message="Game Over! You died."
			onRestart={restartGame}
			onQuit={quitGame}
			onSubmitScore={submitScoreAndShowLeaderboard}
			scoreData={{
				score: game.calculateFinalScore(),
				// level: game.level || 1,
				enemiesDefeated: game.gameStats.enemiesDefeated,
				coinsCollected: game.gameStats.coinsCollected,
				// score: 10000,
				// enemiesDefeated: 1000,
				// coinsCollected: 1000,
			}}
		/>
	{/if}

	{#if $showLeaderBoards}
		<Leaderboard onClose={() => showLeaderBoards.set(false)} />
	{/if}
	<div>
		<canvas id="glCanvas" bind:this={canvas}></canvas>
	</div>

	<!-- Pause Button -->
	{#if gameStarted && !isPaused && !$isGameOver}
		<div class="pause-button">
			<Button
				onClick={() => {
					isPaused = togglePause(game);
					console.log("Paused: ", isPaused);
				}}>Pause</Button
			>
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
</style>
