import { io } from 'socket.io-client';
import store from './store'

const URL = undefined // undefined means get it by js 
const socket = io(URL);

socket.on('refresh', () => {
  console.log('refresh msg gotten!');
  store.dispatch('refresh')
});

export default socket;