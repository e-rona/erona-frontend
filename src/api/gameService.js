import {apiClient} from './apiClient';
import axios from 'axios';

export const getGame = async () => {
  try {
    const {data} = await axios.post('http://43.201.76.241:8080/game-list', {
      userId: '1234',
    });
    return data;
  } catch (err) {
    console.log('err:', err);
  }
};
