const frameWidth = 64; // Width of each frame in the sprite sheet
const frameHeight = 64; // Height of each frame in the sprite sheet
import mc from "./assets/robotFighter.png";

const img = new Image();
img.src = mc;
export class Character {
	constructor(scale) {
		this.realX = 500; // Actual X position in pixels
		this.realY = 500; // Actual Y position in pixels
		this.gridX = 2; // Grid position (column)
		this.gridY = 2; // Grid position (row)
		this.width = 50;
		this.height = 50;
		this.color = "#646cff";
		this.speed = 5; // pixel per frame
		this.face = 0;
		this.state = 0; // "Standing" | "Walking" | "Jumping"
		this.lastFrameTime = 0;
		this.frame = 0;
		this.camera_scale = scale;
		this.gunAngle = 0;

		this.bullets = [];
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
		switch (this.state) {
			case 2:
			case 0:
				this.drawStanding(context, x, y);
				break;
			case 1:
				this.drawWalking(context, x, y);
				break;
		}
	}

	drawStanding(context, x, y) {
		this.animateSprite(6, 100);

		if (this.face === 1) {
			context.save(); // Save the current context state
			context.scale(-1, 1); // Flip horizontally
			context.drawImage(
				img,
				this.frame * frameWidth + 15, // Source X position (frame index * frame width)
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
				img,
				this.frame * frameWidth + 15, // Source X position (frame index * frame width)
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
				img,
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
				img,
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
