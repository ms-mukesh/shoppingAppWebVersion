import AsyncStorage from '@react-native-async-storage/async-storage';
import { isWEB } from '../helper/themeHelper';
export const getToken = () => {
  return AsyncStorage.getItem('userLoginDetail').then((res) => {
    if (res) {
      let obj = JSON.parse(res);
      console.log(obj.authToken);
      return obj.authToken;
    } else {
      return '';
    }
  });
};

export const getDeviceId = () => {
  return AsyncStorage.getItem('userLoginDetail').then((res) => {
    if (res) {
      let obj = JSON.parse(res);
      return obj.deviceId;
    } else {
      return '';
    }
  });
};
export const generateRandomNumber = () => {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789';
  let NUMBER = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    NUMBER += digits[Math.floor(Math.random() * 10)];
  }
  return NUMBER;
};
