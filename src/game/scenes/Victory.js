import { Scene } from 'phaser';

export class Victory extends Scene {
    constructor() {
        super('Victory');
    }

    create() {
        // Establecer el color de fondo de la escena de victoria
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

      
        const restartButton =  this.add.text(512, 384, '¡Victoria!', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
