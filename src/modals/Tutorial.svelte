<script>
	import { paths } from "../Assets";
	import Button from "./button.svelte";
	import { createEventDispatcher } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	const dispatch = createEventDispatcher();

	const hints = [
		paths.hint1,
		paths.hint2,
		paths.hint3,
		paths.hint4,
		paths.hint5,
	];
	let currentHint = 0;

	if (localStorage.getItem("tutorialSeen") === "true") {
		dispatch("close");
	}

	function nextHint() {
		if (currentHint < hints.length - 1) {
			currentHint++;
		} else {
			// Close or proceed (emit event or call a function)
			// For example: dispatch("close") or call a prop function
			localStorage.setItem("tutorialSeen", "true");
			dispatch("close");
		}
	}
</script>

<div class="modal-backdrop">
	<div class="modal modal-skin">
		{#key currentHint}
			<div
				class="hint-bg"
				style="background-image: url({hints[currentHint]});"
				in:fly={{ y: 40, opacity: 0, duration: 350, easing: cubicOut }}
				out:fly={{ y: -40, opacity: 0, duration: 350, easing: cubicOut }}
			>
				<div class="buttons vertical-btn">
					<Button onClick={nextHint}>
						{currentHint < hints.length - 1 ? "Next" : "Go"}
					</Button>
				</div>
			</div>
		{/key}
	</div>
</div>

<style lang="scss">
	// .image {
	// }
	.hint-bg {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		position: absolute;
		top: 0;
		left: 0;
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		// backdrop-filter: blur(10px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		background-image: url("../assets/ui/modal backdrop.jpg");

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			background: inherit; /* Inherit the background from the parent */
			filter: blur(10px); /* Apply the blur effect */
			z-index: -1; /* Place it behind the children */
		}
	}

	.modal-skin {
		margin: 1em auto 2em;
		height: 37em;

		background-size: cover;
		// background-image: url("../assets/ui/Modal.png");
		background-position: center;
		aspect-ratio: 905 / 573;
		position: relative;
	}

	.buttons {
		margin-top: 1rem;
		display: flex;
		justify-content: flex-start;
	}

	.vertical-btn {
		transform: rotate(90deg);
		position: absolute;
		right: -1em;
		top: 50%;
		transform: translateY(-50%) rotate(90deg);
	}
</style>
