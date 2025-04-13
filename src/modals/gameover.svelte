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
		background: rgb(77, 73, 73);
		padding: 2rem;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #3d953e;
	}
</style>
