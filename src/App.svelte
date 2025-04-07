<script>
	import svelteLogo from "./assets/svelte.svg";
	import viteLogo from "/vite.svg";
	import Counter from "./lib/Counter.svelte";
</script>

<main>
	<div>
		<a href="https://vite.dev" target="_blank" rel="noreferrer">
			<img src={viteLogo} class="logo" alt="Vite Logo" />
		</a>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
		</a>
	</div>
	<h1>Welcome to pup-knight (random name lang)</h1>

	<div class="card">
		<Counter />
	</div>

	<p>Things to plan:</p>

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
	</ol>
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
</style>
