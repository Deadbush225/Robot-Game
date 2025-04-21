import { assets } from "./Assets";
import { addTempBlockedRect, removeTempBlockedRect } from "./boundary";

export default class Door {
	constructor(x, y, orientation = "Vertical", camera, character) {
		this.orientation = orientation;

		this.x = x;
		this.y = y;

		this.gap = 0;
		this.frameDuration = 200; // ms per frame
		this.state = "locked";
		this.openStartTime = null;
		this.currentFrame = 8;
		this.lastFrameTime = 0;

		this.img = orientation == "Vertical" ? assets.vDoor : assets.hDoor;

		this.width = this.img.width;
		this.height = this.img.height;
		this.frameWidth = orientation == "Vertical" ? 96 : 96 * 6;

		if (orientation == "Vertical") {
			this.doorRect = {
				x: this.x + 96 - 24,
				y: this.y,
				width: 24,
				height: this.height,
				active: true,
			};
		} else {
			this.doorRect = {
				x: this.x,
				y: this.y + 96 - 24,
				width: this.width,
				height: 24,
				active: true,
			};
		}
		this.doorId = addTempBlockedRect(this.doorRect);

		// Start timer to open after 10 seconds
		setTimeout(() => {
			// this.state = "opening";
			// this.openStartTime = performance.now();
			this.openDoor();
		}, 10000);
		console.log("width: ", this.width, " ", "height: ", this.height);
	}
	openDoor() {
		this.state = "opening";
		removeTempBlockedRect(this.doorId);
	}

	update() {
		if (this.state === "open") {
			return;
		}

		let now = performance.now();
		if (this.state === "opening") {
			if (now - this.lastFrameTime > this.frameDuration) {
				this.currentFrame--;
				this.lastFrameTime = now;
				if (this.currentFrame < 0) {
					this.currentFrame = 0;
					this.state = "open";
				}
			}
		}
	}

	draw(ctx, camera, character) {
		if (this.state === "open") {
			return;
		}

		let { x: x, y: y } = camera.worldToScreen(this.x, this.y, character);

		if (this.orientation == "Vertical") {
			if (this.state === "locked") {
				ctx.drawImage(
					this.img,
					this.frameWidth * 7,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth / 1.5,
					this.height / 1.5
				);
			} else if (this.state === "opening") {
				ctx.drawImage(
					this.img,
					0 + this.currentFrame * 96,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth / 1.5,
					this.height / 1.5
				);
			}
		} else {
			// horizontal
			if (this.state === "locked") {
				ctx.drawImage(
					this.img,
					this.frameWidth * 7,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth / 1.5,
					this.height / 1.5
				);
			} else if (this.state === "opening") {
				ctx.drawImage(
					this.img,
					0 + this.currentFrame * 6 * 96,
					0,
					this.frameWidth,
					this.height,
					x,
					y + 1,
					this.frameWidth / 1.5,
					this.height / 1.5
				);
			}
		}
	}
}
