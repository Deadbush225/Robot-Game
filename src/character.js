const frameWidth = 64; // Width of each frame in the sprite sheet
const frameHeight = 64; // Height of each frame in the sprite sheet
import { assets } from "./Assets";

export class Character {
	constructor(scale, healthBar) {
		this.img = assets.character;
		this.realX = 500; // Actual X position in pixels
		this.realY = 500; // Actual Y position in pixels
		this.gridX = 2; // Grid position (column)
		this.gridY = 2; // Grid position (row)
		this.width = 50;
		this.height = 50;
		this.color = "#646cff";
		this.speed = 10; // pixel per frame
		this.face = 0;
		this.state = 0; // "Standing" | "Walking" | "Jumping"
		this.lastFrameTime = 0;
		this.frame = 0;
		this.camera_scale = scale;
		this.gunAngle = 0;

		this.bullets = [];
		this.health = 100; // Character's health
		this.isTakingDamage = false; // Flag to track if the character is taking damage
		this.damageTimer = 0; // Timer to control the duration of the damaged state
		this.healthBar = healthBar;
	}

	takeDamage(amount) {
		if (!this.isTakingDamage) {
			this.health -= amount;
			if (this.health > 0) {
				// this.state = 3; // Set state to "Damaged"
				this.isTakingDamage = true;
				this.damageTimer = Date.now(); // Start the damage timer
			} else {
				this.state = 3;
			}
			this.healthBar.setHealth(this.health);
		}
	}

	updateState() {
		// Automatically transition out of the damaged state after 500ms
		if (this.isTakingDamage && Date.now() - this.damageTimer > 200) {
			this.isTakingDamage = false;
			this.state = 0; // Return to "Standing" state
		}
	}

	animateSprite(frameCount, animationSpeed) {
		const currentTime = Date.now();
		this.frame = this.frame > frameCount ? 0 : this.frame;

		if (currentTime - this.lastFrameTime >= animationSpeed) {
			this.frame = (this.frame + 1) % frameCount; // Loop through frames
			this.lastFrameTime = currentTime;
		}
	}

	draw(context, x, y) {
		this.updateState();
		switch (this.state) {
			case 3:
				this.drawKilled(context, x, y);
				break;
			case 2:
			case 0:
				this.drawStanding(context, x, y);
				break;
			case 1:
				this.drawWalking(context, x, y);
				break;
		}
	}

	drawKilled(context, x, y) {
		this.animateSprite(4, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				64 * 2 + 60 + 11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);

			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				64 * 2 + 60 + 11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}

	drawStanding(context, x, y) {
		this.animateSprite(6, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);

			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15 + (this.isTakingDamage ? 384 : 0), // Source X position (frame index * frame width)
				11, // Source Y position (assuming single row sprite sheet)
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}

	drawWalking(context, x, y) {
		this.animateSprite(3, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15, // Source X position (frame index * frame width)
				64 + 60 + 15, // Source Y position for walking animation
				31, // Source width
				39, // Source height
				-x - this.width, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
			context.restore(); // Restore the context state
		} else {
			context.drawImage(
				this.img,
				this.frame * frameWidth + 15, // Source X position (frame index * frame width)
				64 + 60 + 15, // Source Y position for walking animation
				31, // Source width
				39, // Source height
				x, // Adjust X position for flipped image
				y, // Destination Y position
				this.width * this.camera_scale, // Destination width
				this.height * this.camera_scale // Destination height
			);
		}
	}
}

export default Character;
