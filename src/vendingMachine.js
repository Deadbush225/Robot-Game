import { assets } from "./Assets";

export class VendingMachine {
	constructor(x, y, gunMachine) {
		this.coins = [];
		this.coinCount = 0;
		this.frameWidth = 56; // Width of each frame in the sprite sheet
		this.frameHeight = 41; // Height of each frame
		this.frameCount = 1; // Number of frames in the animation
		this.currentFrame = 0;
		this.frameInterval = 100; // Milliseconds between frame changes
		this.lastFrameTime = 0;
		this.x = x;
		this.y = y;
		this.gunKeeper = gunMachine;
		this.scale = 2;

		this.lastVendingTime = 0;
	}

	// Randomly summon a gun at a specific position
	summonRandomGun() {
		this.gunKeeper.summonGun(this.x + this.frameWidth * 2, this.y + 200);
	}

	draw(gl, camera, character) {
		const { x: screenX, y: screenY } = camera.worldToScreen(
			this.x,
			this.y,
			character
		);

		// console.log(screenX, screenY);

		// gl.save();
		// gl.translate(screenX, screenY);

		// Draw the current frame of the coin animation
		gl.drawImage(
			assets.vending,
			this.currentFrame + 1,
			0 + 11, // Source x, y
			this.frameWidth,
			this.frameHeight, // Source width, height
			screenX,
			screenY, // Destination x, y (centered)
			this.frameWidth * 2.2,
			this.frameHeight * 2.2 // Destination width, height
		);
		// Draw a dot at the vending machine origin (for debugging)
		// gl.save();
		// gl.fillStyle = "red";
		// gl.beginPath();
		// gl.arc(screenX, screenY, 5, 0, Math.PI * 2);
		// gl.fill();
		// gl.restore();
		// gl.save();
		// gl.strokeStyle = "yellow";
		// gl.lineWidth = 2;
		// gl.strokeRect(
		// 	screenX,
		// 	screenY - this.frameHeight / 2,
		// 	(this.frameWidth / 2) * 2.2,
		// 	this.frameHeight * 2.2
		// );
		// gl.restore();
	}

	isOverlapping(character) {
		if (character.coins < 10) {
			return;
		}

		if (this.lastVendingTime !== 0 && Date.now() - this.lastVendingTime < 500) {
			return;
		}
		this.lastVendingTime = Date.now();

		const characterPoint = { x: character.realX, y: character.realY };

		const vendingBounds = {
			left: this.x,
			right: this.x + (this.frameWidth / 2) * 2.2,
			top: this.y - this.frameHeight / 2,
			bottom: this.y + this.frameHeight * 2.2 - this.frameHeight / 2,
		};

		if (
			characterPoint.x > vendingBounds.left &&
			characterPoint.x < vendingBounds.right &&
			characterPoint.y > vendingBounds.top &&
			characterPoint.y < vendingBounds.bottom
		) {
			character.coins -= 10;
			this.summonRandomGun();
			console.log("VENDING!!");
			// this.summonRandomGun();
		}
	}
}
