<script>
	// export let text = "Button";
	export let onClick = () => {};

	import { soundManager } from "../Sounds";
</script>

<button
	class="button-skin"
	on:click={() => {
		soundManager.play("ui_select");
		onClick();
	}}
>
	<span>
		<slot></slot>
	</span>
</button>

<style>
	.button-skin {
		background-image: url("../assets/ui/Button.png");
		background-size: cover;
		background-position: center;

		aspect-ratio: 239 / 85;
		/* aspect-ratio: 301 / 121; */
	}
	button {
		height: 4em;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: none;
		cursor: pointer;
		/* background: linear-gradient(145deg, #4caf50, #3a8e3f); */
		color: black;
		background: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	button:hover {
		filter: brightness(0.6);
	}

	span {
		/* //remove margin of font, and make it a bit bigger */
		font-size: 2em;
	}
</style>
