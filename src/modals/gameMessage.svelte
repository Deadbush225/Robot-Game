<script>
	import Button from "./button.svelte";
	import tv_man from "../assets/ui/tv man (1).gif";
	import { showEndMessage, showLeaderBoards } from "../store";
	import { fade } from "svelte/transition";
	import SubmitScore from "./submitScore.svelte";
	import { spawnPointX, spawnPointY } from "../store";

	export let onSubmitScore;
	export let onShowMenu = () => {};
</script>

<div class="modal-backdrop" transition:fade={{ duration: 700 }}>
	<div class="modal modal-skin">
		<h1>You did it!</h1>
		<img class="image" src={tv_man} alt="TV Man" />
		<p>
			Congratulations on completing the game! Your determination and skill truly
			made a difference. We're proud of your achievement—thank you for playing
			and being part of this journey!
		</p>

		<SubmitScore {onSubmitScore}></SubmitScore>

		<div class="buttons">
			<!-- <Button
				onClick={() => {
					showEndMessage.set(false);
					showLeaderBoards.set(true);
				}}>Leaderboards</Button
			> -->
			<Button
				onClick={() => {
					showEndMessage.set(false);
					onShowMenu();
					spawnPointX.set(300);
					spawnPointY.set(5689);
				}}>Quit</Button
			>
		</div>
	</div>
</div>

<style lang="scss">
	.image {
		margin: 1em auto 0;
		width: 7em;
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		// background: rgba(0, 0, 0, 0.7);
		// background-image: url("../assets/ui/modal backdrop.jpg");
		background-size: cover;
		background-position: center;
		backdrop-filter: blur(10px);

		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;

		h1 {
			margin: 0;
		}
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
		height: 37em;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;

		padding: 3em 5em;
		box-sizing: border-box;
		p {
			font-size: 2.3em;
			line-height: 1.2;
			margin: 0;
		}
		h1 {
			font-size: 4em;
		}
	}

	.modal-skin {
		background-size: cover;
		background-image: url("../assets/ui/Modal.png");
		background-position: center;
		aspect-ratio: 905 / 573;
	}

	.buttons {
		margin-top: 1rem;
		display: flex;
		justify-content: space-around;
	}
</style>
