export default class HUD {
    constructor(game) {
        this.game = game;
    }
    
    draw(gl, canvas) {
        // Background for HUD
        gl.save();
        gl.fillStyle = "rgba(0, 0, 0, 0.7)";
        gl.fillRect(10, 60, 200, 110);
        gl.strokeStyle = "#ffffff";
        gl.lineWidth = 2;
        gl.strokeRect(10, 60, 200, 110);
        
        // Score information
        gl.fillStyle = "#ffffff";
        gl.font = "18px Arial";
        gl.fillText(`Score: ${this.game.gameStats.score}`, 20, 85);
        gl.fillText(`Enemies: ${this.game.gameStats.enemiesDefeated}`, 20, 115);
        gl.fillText(`Coins: ${this.game.character.coins}`, 20, 145);
        
        gl.restore();
    }
}

// export default class HUD {
//     constructor(game) {
//         this.game = game;
//     }
    
//     draw(gl, canvas) {
//         // Background for HUD
//         gl.save();
//         gl.fillStyle = "rgba(0, 0, 0, 0.7)";
//         gl.fillRect(10, 60, 200, 110);
//         gl.strokeStyle = "#ffffff";
//         gl.lineWidth = 2;
//         gl.strokeRect(10, 60, 200, 110);
        
//         // Score information
//         gl.fillStyle = "#ffffff";
//         gl.font = "18px Arial";
//         gl.fillText(`Score: ${this.game.gameStats.score}`, 20, 85);
//         gl.fillText(`Enemies: ${this.game.gameStats.enemiesDefeated}`, 20, 115);
//         gl.fillText(`Coins: ${this.game.character.coins}`, 20, 145);
//         gl.fillText(`Level: ${this.game.level}`, 20, 175);
        
//         gl.restore();
//     }
// }