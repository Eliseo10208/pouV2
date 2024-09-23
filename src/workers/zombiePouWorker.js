self.onmessage = function(event) {
    const { godPouPosition, zombiePosition } = event.data;

    const speed = 1;
    const angle = Math.atan2(godPouPosition.y - zombiePosition.y, godPouPosition.x - zombiePosition.x);
    const newPosition = {
        x: zombiePosition.x + Math.cos(angle) * speed,
        y: zombiePosition.y + Math.sin(angle) * speed
    };

    self.postMessage(newPosition);
};