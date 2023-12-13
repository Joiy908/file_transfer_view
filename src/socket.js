import { io } from 'socket.io-client';
import store from './store'

const socket = io();

socket.on('refresh_path', () => {
  store.dispatch('refresh')
});

socket.on('refresh_msgs', () => {
  store.dispatch('getMsgs')
});

export default socket;