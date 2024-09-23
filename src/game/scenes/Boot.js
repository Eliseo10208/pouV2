import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        // La escena Boot se utiliza típicamente para cargar cualquier recurso que necesites para tu Preloader, como un logo del juego o un fondo.
        // Cuanto más pequeño sea el tamaño del archivo de los recursos, mejor, ya que la escena Boot en sí misma no tiene un preloader.

        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
