<script>
	import { toggleMusic, toggleSFX } from "../pauseMenu";
	import Button from "./button.svelte";
	let musicEnabled = true;
	let sfxEnabled = true;

	export let onGamePause = () => {};
	export let restartGame = () => {};

	function H_toggleMusic() {
		musicEnabled = toggleMusic();
	}
	function H_toggleSFX() {
		sfxEnabled = toggleSFX();
	}
</script>

<div class="pause-menu">
	<h2>Game Paused</h2>
	<div class="menu-buttons">
		<Button onClick={onGamePause}>Resume</Button>
		<Button onClick={restartGame}>Restart</Button>
		<Button onClick={H_toggleMusic}>
			{musicEnabled ? "Mute Music" : "Unmute Music"}
		</Button>
		<Button onClick={H_toggleSFX}>
			{sfxEnabled ? "Mute SFX" : "Unmute SFX"}
		</Button>
	</div>
</div>

<style>
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
