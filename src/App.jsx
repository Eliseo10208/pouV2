import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    // El sprite solo se puede mover en la escena MainMenu
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    // Referencias al componente PhaserGame (game y scene están expuestos)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu')
        {
            // Obtener la posición actualizada del logo
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            // Agregar más estrellas
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            // `add.sprite` es un método de Phaser GameObjectFactory y devuelve una instancia de Sprite Game Object
            const star = scene.add.sprite(x, y, 'godPou');

            // ... sobre la cual puedes actuar. Aquí creamos un Phaser Tween para desvanecer el sprite de la estrella.
            // Por supuesto, podrías hacer esto desde dentro del código de la escena de Phaser, pero esto es solo un ejemplo
            // que muestra que los objetos y sistemas de Phaser pueden ser manipulados desde fuera de Phaser.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }
    }

    // Evento emitido desde el componente PhaserGame
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Iniciar Juego</button>
                </div>
                <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Alternar Movimiento</button>
                </div>
                <div className="spritePosition">Posición del Sprite:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Agregar Nuevo Sprite</button>
                </div>
            </div>
        </div>
    )
}

export default App