<script>
	import { soundManager } from "../Sounds";
	import { showLeaderBoards } from "../store";
	import Button from "./button.svelte";
	import SubmitScore from "./submitScore.svelte";

	export let message = "Game Over!";
	export let onRestart = () => {};
	export let onQuit = () => {};
	export let onSubmitScore;
	export let scoreData = {
		score: 0,
		// level: 0,
		enemiesDefeated: 0,
		coinsCollected: 0,
	};
	// export let onShowLeaderboard = () => {};

	soundManager.play("gameOver");
</script>

<div class="modal-backdrop">
	<div class="modal modal-skin">
		<h1>{message}</h1>

		<div class="score-details">
			<h2>Your Score: {scoreData.score}</h2>
			<div class="stats-grid">
				<!-- <div class="stat-box">
                    <span class="stat-label">Level</span>
                    <span class="stat-value">{scoreData.level}</span>
                </div> -->
				<div class="stat-box">
					<span class="stat-label">Enemies Defeated</span>
					<span class="stat-value">{scoreData.enemiesDefeated}</span>
				</div>
				<!-- naka comment yan siya kasi di naa-update ng maayos (diko ma debug 😀) -->
				<!-- <div class="stat-box">
                    <span class="stat-label">Coins Collected</span>
                    <span class="stat-value">{scoreData.coinsCollected}</span>
                </div> -->
			</div>
		</div>

		<SubmitScore {onSubmitScore}></SubmitScore>

		<div class="buttons">
			<Button onClick={onRestart}>Restart</Button>
			<Button onClick={onQuit}>Quit</Button>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* background: rgba(0, 0, 0, 0.7); */
		/* background-image: url("../assets/ui/modal backdrop.jpg"); */
		background-size: cover;
		background-position: center;
		backdrop-filter: blur(10px);

		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-backdrop::before {
		content: "";
		position: absolute;
		inset: 0;
		background: inherit; /* Inherit the background from the parent */
		filter: blur(10px); /* Apply the blur effect */
		z-index: -1; /* Place it behind the children */
	}

	.modal {
		/* padding: 2rem; */
		/* border-radius: 12px; */
		text-align: center;
		/* height: 20em; */
		height: 600px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding: 1em;
		box-sizing: border-box;
	}

	.modal-skin {
		background-size: cover;
		background-image: url("../assets/ui/Modal.png");
		/* background-color: rgba(0, 0, 0, 0.341); */
		background-position: center;
		aspect-ratio: 905 / 573;
	}

	.modal h1 {
		font-size: 4.5rem;
		margin: 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.buttons {
		margin-top: 1rem;
		display: flex;
		justify-content: space-around;
		padding: 10px;
	}

	.score-details {
		/* margin: 0.5rem 0; */
		/* padding: 0.5rem; */
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 5px;

		h2 {
			margin: 0 0 0.5rem 0;
			font-size: 3rem;
			color: gold;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		}
	}

	.stats-grid {
		display: flex;
		justify-content: center;
		gap: 15px;
	}

	.stat-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 1.5em;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 5px;
		min-width: 80px;

		.stat-label {
			font-size: 1.7em;
			color: #ccc;
		}

		.stat-value {
			font-size: 2.3rem;
			font-weight: bold;
			color: white;
		}
	}
</style>
