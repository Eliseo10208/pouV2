import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class ZombieGame extends Scene {
    constructor() {
        super('ZombieGame');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000); // Fondo negro para el modo zombie

        // Configurar los límites del mundo
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        // Crear el pou bueno controlado por el jugador
        this.godPou = this.physics.add.image(100, 100, 'godPou');
        this.godPou.setDisplaySize(100, 100);
        this.godPou.body.setCircle(50); // Ajustar el área de colisión de godPou
        this.godPou.setCollideWorldBounds(true);

        // Crear un pou zombie en una posición alejada del godPou
        this.zombiePou = this.physics.add.image(Phaser.Math.Between(300, this.scale.width - 100), Phaser.Math.Between(300, this.scale.height - 100), 'zombiePou');
        this.zombiePou.setDisplaySize(100, 100);
        this.zombiePou.body.setCircle(50); // Ajustar el área de colisión del zombiePou
        this.zombiePou.setCollideWorldBounds(true);

        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit('current-scene-ready', this);

        // Añadir texto para mostrar el contador
        this.timerText = this.add.text(16, 16, 'Tiempo: 60', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff'
        });

        // Iniciar el temporizador
        this.timerWorker = new Worker(new URL('../../workers/timerWorker.js', import.meta.url));
        this.timerWorker.postMessage({ action: 'start', duration: 60000 }); // 60 segundos
        this.timerWorker.onmessage = (event) => {
            if (event.data === 'time-up') {
                this.handleTimeUp();
            } else if (event.data.time) {
                this.updateTimer(event.data.time);
            }
        };

        // Inicializar el Web Worker para godPou
        this.goodStarWorker = new Worker(new URL('../../workers/goodPouWorker.js', import.meta.url));

        // Inicializar el Web Worker para el zombiePou
        this.zombiePouWorker = new Worker(new URL('../../workers/zombiePouWorker.js', import.meta.url));

        // Habilitar colisiones entre godPou y zombiePou
        this.physics.add.collider(this.godPou, this.zombiePou, this.handleCollision, null, this);
    }

    update() {
        // Enviar la posición de godPou y el estado de las teclas al Web Worker de godPou
        this.goodStarWorker.postMessage({
            keys: {
                W: this.keys.W.isDown,
                A: this.keys.A.isDown,
                S: this.keys.S.isDown,
                D: this.keys.D.isDown
            },
            starPosition: { x: this.godPou.x, y: this.godPou.y }
        });

        // Recibir la nueva posición de godPou del Web Worker
        this.goodStarWorker.onmessage = (event) => {
            const { x, y } = event.data;
            this.godPou.setPosition(x, y);
        };

        // Enviar la posición de godPou y la posición actual del zombiePou al Web Worker
        const godPouPosition = { x: this.godPou.x, y: this.godPou.y };
        const zombiePosition = { x: this.zombiePou.x, y: this.zombiePou.y };
        this.zombiePouWorker.postMessage({ godPouPosition, zombiePosition });

        // Recibir la nueva posición del zombiePou del Web Worker
        this.zombiePouWorker.onmessage = (event) => {
            const { x, y } = event.data;
            this.zombiePou.setPosition(x, y);
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