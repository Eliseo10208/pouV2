self.onmessage = function(event) {
    const { cursors, starPosition } = event.data;

    const speed = 5;
    let { x, y } = starPosition;

    if (cursors.left) {
        x -= speed;
    } else if (cursors.right) {
        x += speed;
    }

    if (cursors.up) {
        y -= speed;
    } else if (cursors.down) {
        y += speed;
    }

    self.postMessage({ x, y });
};