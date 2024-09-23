self.onmessage = (event) => {
    const { action, interval } = event.data;

    if (action === 'start') {
        console.log('Background worker started with interval:', interval);
        self.intervalId = setInterval(() => {
            const color = Phaser.Display.Color.RandomRGB().color;
            console.log('Generated color:', color);
            self.postMessage({ color });
        }, interval);
    } else if (action === 'stop') {
        console.log('Background worker stopped');
        clearInterval(self.intervalId);
    }
};