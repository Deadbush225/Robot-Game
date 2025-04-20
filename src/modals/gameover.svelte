<script>
	import Button from "./button.svelte";

	export let message = "Game Over!";
	export let onRestart = () => {};
	export let onQuit = () => {};
</script>

<div class="modal-backdrop">
	<div class="modal modal-skin">
		<h1>{message}</h1>
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
		height: 20em;
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

	.buttons {
		margin-top: 1rem;
		display: flex;
		justify-content: space-around;
	}
</style>
