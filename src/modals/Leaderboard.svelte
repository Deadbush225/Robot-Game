<script>
	import { onMount } from "svelte";
	import LeaderboardService from "../LeaderboardService";

	export let onClose;

	let leaderboard = [];
	let loading = true;
	let error = null;

	const leaderboardService = new LeaderboardService();

	onMount(async () => {
		try {
			leaderboard = await leaderboardService.getLeaderboard();
			console.log("Leaderboard data:", leaderboard);
		} catch (err) {
			error = "Failed to load leaderboard";
			console.error(err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="leaderboard-container">
	<div class="leaderboard-panel">
		<h2>GLOBAL LEADERBOARD</h2>

		{#if loading}
			<p>Loading leaderboard...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else if leaderboard.length === 0}
			<p>No scores yet. Be the first to submit a score!</p>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Player</th>
						<th>Score</th>
						<th>Enemies</th>
						<th>Coins</th>
					</tr>
				</thead>
				<tbody>
					{#each leaderboard as entry, i}
						<tr>
							<td>{i + 1}</td>
							<td>{entry.playerName}</td>
							<td>{entry.score}</td>
							<td>{entry.enemiesDefeated}</td>
							<td>{entry.coinsCollected}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}

		<button on:click={onClose}>Close</button>
	</div>
</div>

<!-- <script>
    import { onMount } from 'svelte';
    import LeaderboardService from '../LeaderboardService';
    
    export let onClose;
    
    let leaderboard = [];
    let loading = true;
    let error = null;
    
    const leaderboardService = new LeaderboardService();
    
    onMount(async () => {
        try {
            loading = true;
            leaderboard = await leaderboardService.getLeaderboard();
            console.log("Leaderboard data:", leaderboard);
        } catch (err) {
            error = 'Failed to load leaderboard';
            console.error(err);
        } finally {
            loading = false;
        }
    });
</script>

<div class="leaderboard-container">
    <div class="leaderboard-panel">
        <h2>GLOBAL LEADERBOARD</h2>
        
        {#if loading}
        <p>Loading leaderboard...</p>
        {:else if error}
        <p class="error">{error}</p>
        {:else if leaderboard.length === 0}
        <p>No scores yet. Be the first to submit a score!</p>
        {:else}
        <table>
            <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Level</th>
                <th>Enemies</th>
                <th>Coins</th>
            </tr>
            </thead>
            <tbody>
            {#each leaderboard as entry, i}
                <tr>
                <td>{i + 1}</td>
                <td>{entry.playerName}</td>
                <td>{entry.score}</td>
                <td>{entry.level}</td>
                <td>{entry.enemiesDefeated}</td>
                <td>{entry.coinsCollected}</td>
                </tr>
            {/each}
            </tbody>
        </table>
        {/if}
        
        <button on:click={onClose}>Close</button>
    </div>
</div> -->
<style>
	.leaderboard-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.leaderboard-panel {
		background: linear-gradient(to bottom, #2a2a3a, #1a1a2e);
		color: white;
		padding: 2.5rem;
		border-radius: 12px;
		min-width: 60%;
		max-width: 800px;
		box-shadow:
			0 0 30px rgba(255, 68, 68, 0.3),
			0 0 15px rgba(0, 150, 255, 0.2);
		border: 2px solid #3a3a5a;
		position: relative;
		overflow: hidden;
	}

	.leaderboard-panel::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(to right, #ff4444, #ff9944, #44aaff);
	}

	h2 {
		text-align: center;
		margin-bottom: 1.8rem;
		color: #ff4444;
		font-size: 2rem;
		text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
		letter-spacing: 2px;
		font-weight: bold;
		margin: 0.5em;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		margin-bottom: 1rem;
	}

	thead {
		background-color: rgba(255, 68, 68, 0.2);
	}

	th {
		padding: 1rem 0.75rem;
		text-align: center;
		border-bottom: 2px solid #ff4444;
		color: #ffcc44;
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	td {
		padding: 0.2rem 0.75rem;
		text-align: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 1.2rem;
	}

	tr:nth-child(even) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	tr:hover {
		background-color: rgba(255, 68, 68, 0.1);
	}

	/* Highlight top 3 players */
	tbody tr:nth-child(1) td {
		color: gold;
		font-weight: bold;
		background-color: rgba(255, 215, 0, 0.1);
	}

	tbody tr:nth-child(2) td {
		color: silver;
		font-weight: bold;
		background-color: rgba(192, 192, 192, 0.1);
	}

	tbody tr:nth-child(3) td {
		color: #cd7f32; /* bronze */
		font-weight: bold;
		background-color: rgba(205, 127, 50, 0.1);
	}

	button {
		margin-top: 1.8rem;
		padding: 0.9rem 2rem;
		background: linear-gradient(to bottom, #ff5555, #ff3333);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1.1rem;
		float: right;
		font-weight: bold;
		letter-spacing: 1px;
		transition: all 0.2s ease;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
		background: linear-gradient(to bottom, #ff6666, #ff4444);
	}

	button:active {
		transform: translateY(1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.error {
		color: #ff4444;
		text-align: center;
		background-color: rgba(255, 68, 68, 0.1);
		padding: 1rem;
		border-radius: 6px;
		border-left: 4px solid #ff4444;
	}

	p {
		text-align: center;
		padding: 2rem;
		font-size: 1.2rem;
		color: #aaaacc;
	}
</style>
