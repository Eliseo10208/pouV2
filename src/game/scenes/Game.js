import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.godPou = this.physics.add.image(100, 100, 'godPou');
        this.godPou.setDisplaySize(100, 100);
        this.godPou.body.setCircle(100, 100, 100); // Ajustar el área de colisión de la estrella buena

        this.badPou = this.physics.add.image(924, 668, 'badPou').setTint(0xff0000); 
        this.badPou.setDisplaySize(100, 100);
        this.badPou.body.setCircle(100, 100, 100); // Ajustar el área de colisión de la estrella mala

        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        this.cursors = this.input.keyboard.createCursorKeys();

        // Inicializar los Web Workers
        this.goodStarWorker = new Worker(new URL('../../workers/goodPouWorker.js', import.meta.url));
        this.badStarWorker = new Worker(new URL('../../workers/badPouWorker.js', import.meta.url));
        this.timerWorker = new Worker(new URL('../../workers/timerWorker.js', import.meta.url)); // Nuevo Worker para el temporizador

        EventBus.emit('current-scene-ready', this);

        // Habilitar colisiones entre godPou y badPou
        this.physics.add.collider(this.godPou, this.badPou, this.handleCollision, null, this);

        // Añadir texto para mostrar el contador
        this.timerText = this.add.text(16, 16, 'Tiempo: 60', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff'
        });

        // Iniciar el temporizador
        this.timerWorker.postMessage({ action: 'start', duration: 60000 }); // 60 segundos
        this.timerWorker.onmessage = (event) => {
            if (event.data === 'time-up') {
                this.handleTimeUp();
            } else if (event.data.time) {
                this.updateTimer(event.data.time);
            }
        };
    }

    update() {
        // Enviar la posición de godPou y el estado de las teclas al Web Worker de la estrella buena
        this.goodStarWorker.postMessage({
            keys: {
                W: this.keys.W.isDown,
                A: this.keys.A.isDown,
                S: this.keys.S.isDown,
                D: this.keys.D.isDown
            },
            starPosition: { x: this.godPou.x, y: this.godPou.y }
        });
    
        // Recibir la nueva posición de la estrella buena del Web Worker
        this.goodStarWorker.onmessage = (event) => {
            const { x, y } = event.data;
            this.godPou.setPosition(x, y);
        };
    
        // Enviar la posición de las estrellas al Web Worker de la estrella mala
        this.badStarWorker.postMessage({
            cursors: {
                left: this.cursors.left.isDown,
                right: this.cursors.right.isDown,
                up: this.cursors.up.isDown,
                down: this.cursors.down.isDown
            },
            starPosition: { x: this.badPou.x, y: this.badPou.y }
        });
    
        // Recibir la nueva posición de la estrella mala del Web Worker
        this.badStarWorker.onmessage = (event) => {
            const { x, y } = event.data;
            this.badPou.setPosition(x, y);
        };
    }

    handleCollision() {
        this.timerWorker.postMessage({ action: 'stop' }); // Detener el temporizador
        this.changeScene('GameOver');
    }

    handleTimeUp() {
        this.changeScene('Victory'); 
    }

    updateTimer(time) {
        this.timerText.setText('Tiempo: ' + Math.ceil(time / 1000));
    }

    changeScene(sceneKey) {
        this.scene.start(sceneKey);
    }
}