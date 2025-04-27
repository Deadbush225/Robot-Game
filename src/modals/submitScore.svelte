<script>
	import { showLeaderBoards } from "../store";
	export let onSubmitScore = (playerName) => {};

	let playerName = "";
	let scoreSubmitted = false;

	async function submitScore() {
		if (playerName.trim() === "") {
			alert("Please enter a name.");
			return;
		}

		try {
			// try to return a promise to make sure that the new leaderboard has the score in it
			await onSubmitScore(playerName);
			scoreSubmitted = true;
			// onShowLeaderboard();
			showLeaderBoards.set(true);
		} catch (error) {
			console.error("Error submitting score:", error);
		}
	}
</script>

{#if !scoreSubmitted}
	<div class="name-input">
		<!-- <label for="playerName">Enter your name:</label> -->
		<div class="hBox">
			<input
				type="text"
				id="playerName"
				bind:value={playerName}
				maxlength="15"
				placeholder="Enter Your name"
			/>
			<button on:click={submitScore}>Submit Score</button>
		</div>
	</div>
{:else}
	<div class="score-submitted">
		<p>Score submitted!</p>
	</div>
{/if}

<style>
	.name-input {
		margin: 5px 0;
		font-size: 1.7em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.name-input input {
		padding: 0 0 0 0.3em;
		/* border-radius: 5px; */
		/* border: 1px solid #ccc; */
		font-size: 1em;
		width: 200px;
		height: 100%;
	}

	.name-input button {
		/* margin-top: 10px; */
		padding: 0.5em 0.7em;
		background-color: #ff4444;
		color: white;
		border: none;
		/* border-radius: 5px; */
		cursor: pointer;
		font-size: 1em;
	}

	.score-submitted {
		color: #4caf50;
		font-weight: bold;
		font-size: 1.2rem;
		margin: 1rem 0;
	}

	.hBox {
		display: flex;
		border-radius: 5px;
		border: 2px solid #ff4444;
		overflow: hidden;
	}
</style>
