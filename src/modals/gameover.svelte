<script>
	export let message = "Game Over!";
	export let onRestart = () => {};
	export let onQuit = () => {};
</script>

<div class="modal-backdrop">
	<div class="modal">
		<h1>{message}</h1>
		<div class="buttons">
			<button on:click={onRestart}>Restart</button>
			<button on:click={onQuit}>Quit</button>
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
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal {
		background: linear-gradient(145deg, #5a5a5a, #3d3d3d);
		padding: 2rem;
		border-radius: 12px;
		text-align: center;
		box-shadow:
			8px 8px 16px #2b2b2b,
			-8px -8px 16px #6f6f6f;
	}

	.buttons {
		margin-top: 1rem;
		display: flex;
		justify-content: space-around;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background: linear-gradient(145deg, #4caf50, #3a8e3f);
		box-shadow:
			4px 4px 8px #2b2b2b,
			-4px -4px 8px #6f6f6f;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow:
			6px 6px 12px #2b2b2b,
			-6px -6px 12px #6f6f6f;
		background: linear-gradient(145deg, #3a8e3f, #4caf50);
	}

	button:active {
		transform: translateY(2px);
		box-shadow:
			inset 4px 4px 8px #2b2b2b,
			inset -4px -4px 8px #6f6f6f;
	}
</style>
