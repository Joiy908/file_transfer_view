import { io } from 'socket.io-client';
import store from './store'

const socket = io('http://127.0.0.1:8080'); // Replace with your server URL

socket.on('refresh', () => {
  console.log('refresh msg gotten!');
  store.dispatch('refresh')
});

export default socket;