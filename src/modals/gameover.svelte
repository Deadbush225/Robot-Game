<script>
	import Button from "./button.svelte";

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

	let playerName = "";
	let scoreSubmitted = false;

	async function submitScore() {
		if (playerName.trim() === "") {
			alert("Please enter a name.");
			return;
		}

		try {
			await onSubmitScore(playerName);
			scoreSubmitted = true;
		} catch (error) {
			console.error("Error submitting score:", error);
		}
	}
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

		{#if !scoreSubmitted}
            <div class="name-input">
                <label for="playerName">Enter your name:</label>
                <input type="text" id="playerName" bind:value={playerName} maxlength="15">
                <button on:click={submitScore}>Submit Score</button>
            </div>
        {:else}
            <div class="score-submitted">
                <p>Score submitted!</p>
            </div>
        {/if}


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
        margin: 0.5rem 0;
        padding: 0.5rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }

    .score-details h2 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        color: gold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
        padding: 0.5rem;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        min-width: 80px;
    }

    .stat-label {
        font-size: 0.9rem;
        color: #ccc;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
    }

    .name-input {
        margin: 5px 0;
        font-size: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .name-input input {
        padding: 8px 12px;
        margin-left: 10px;
        margin-top: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 18px;
        width: 200px;
        height: 24px;
    }

    .name-input button {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .score-submitted {
        color: #4caf50;
        font-weight: bold;
        font-size: 1.2rem;
        margin: 1rem 0;
    }
</style>
