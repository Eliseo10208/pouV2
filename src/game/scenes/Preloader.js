import { Scene } from 'phaser';

// La clase Preloader extiende de la clase Scene de Phaser
export class Preloader extends Scene
{
    // El constructor de la clase Preloader
    constructor ()
    {
        // Llama al constructor de la clase Scene con el nombre 'Preloader'
        super('Preloader');
    }

    // El método init se ejecuta al iniciar la escena
    init ()
    {
        // Añade una imagen de fondo que se cargó en la escena Boot
        this.add.image(512, 384, 'background');

        // Añade un rectángulo que actúa como el contorno de una barra de progreso
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // Añade un rectángulo que actúa como la barra de progreso en sí
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        // Usa el evento 'progress' emitido por el LoaderPlugin para actualizar la barra de progreso
        this.load.on('progress', (progress) => {

            // Actualiza el ancho de la barra de progreso basado en el porcentaje de progreso
            bar.width = 4 + (460 * progress);

        });
    }

    // El método preload se ejecuta para cargar los recursos del juego
    preload ()
    {
        // Establece la ruta de los recursos a 'assets'
        this.load.setPath('assets');

        // Carga las imágenes del juego
        this.load.image('logo', 'logo.png');
        this.load.image('badPou', 'badPou.png');
        this.load.image('godPou', 'skinPouChivas.png'); 
        this.load.image('zombiePou', 'zombiePou.png'); // Cargar la imagen del zombiePou
    }

    // El método create se ejecuta cuando todos los recursos han sido cargados
    create ()
    {
        // Cuando todos los recursos han sido cargados, se puede crear objetos globales aquí

        // Cambia a la escena MainMenu
        this.scene.start('MainMenu');
    }
}
