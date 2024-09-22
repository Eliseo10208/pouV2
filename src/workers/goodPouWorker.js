self.onmessage = function(event) {
    const { keys, starPosition } = event.data;

    const speed = 5;
    let { x, y } = starPosition;

    if (keys.A) {
        x -= speed;
    } else if (keys.D) {
        x += speed;
    }

    if (keys.W) {
        y -= speed;
    } else if (keys.S) {
        y += speed;
    }

    self.postMessage({ x, y });
};