/* eslint-disable no-undef */ // lastTime is recycled
window.requestAnimationFrame = (lastTime = 0, callback) => {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
    lastTime = currTime + timeToCall;
    return id;
};
/* eslint-enable no-undef */
window.cancelAnimationFrame = id => clearTimeout(id);
