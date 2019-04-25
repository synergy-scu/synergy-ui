import io from 'socket.io-client';
// import SynergyStore from './Store';

// const { dispatch } = SynergyStore;

const IO = new io.Manager({
    path: '/io',
    reconnection: true,
    reconnectionAttempts: 6,
});

IO.on('connect', () => {
    console.info('Manager Connected');
});

IO.on('connect_error', error => {
    console.error('Manager Connection Error\n');
});

IO.on('connect_timeout', () => {
    console.warn('Manager Connection Timeout');
});

IO.on('error', error => {
    console.error('Manager Socket Error\n');
});

IO.on('disconnect', reason => {
    console.info('Manager Disconnected');
    if (reason === 'io server disconnect') {
        console.info('Manager Reconnecting');
        IO.connect();
    }
});

IO.on('reconnect', () => {
    Object.values(IO.nsps).forEach(socket => socket.open());
    console.info('Manager Reconnected');
});

IO.on('reconnecting', attempt => {
    console.info(`Manager Reconnecting: Attempt: #${attempt}`);
});

IO.on('reconnect_error', error => {
    console.error('Manager Reconnection Error\n');
});

IO.on('reconnect_failed', () => {
    console.error('Manager Reconnection Failed');
});

export default IO;
