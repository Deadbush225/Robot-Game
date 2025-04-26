<script>
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
</div>

<style>
    .leaderboard-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .leaderboard-panel {
        background-color: #1a1a2e;
        color: white;
        padding: 2rem;
        border-radius: 8px;
        min-width: 60%;
        max-width: 800px;
    }

    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #ff4444;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.75rem;
        text-align: center;
        border-bottom: 1px solid #333;
    }

    button {
        margin-top: 1.5rem;
        padding: 0.75rem 1.5rem;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        float: right;
    }

    .error {
        color: #ff4444;
        text-align: center;
    }
</style>