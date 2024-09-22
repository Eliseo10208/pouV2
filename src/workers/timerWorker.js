let timerId;
let endTime;

onmessage = function(event) {
    if (event.data.action === 'start') {
        endTime = Date.now() + event.data.duration;
        timerId = setInterval(() => {
            const remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
                clearInterval(timerId);
                postMessage('time-up');
            } else {
                postMessage({ time: remainingTime });
            }
        }, 1000);
    } else if (event.data.action === 'stop') {
        clearInterval(timerId);
    }
};