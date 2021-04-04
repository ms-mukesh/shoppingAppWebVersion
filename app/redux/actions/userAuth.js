import { Api } from '../../api/index';
import { LOADING, RESET_STORE, USER_DETAIL } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDeviceToken,
  listenerForNotification,
  requestPermissionForNotification,
} from '../../helper/notificationHelper';

export const changeUserPassword = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userAuthentication/changePassword', 'post', data)
      .then(async (res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('unauthorized Acess');
        } else if (res.status === 200) {
          return Promise.resolve(res.data);
        } else if (res.status >= 201) {
          alert(res.data.data);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        dispatch({ type: LOADING, payload: false });
        console.log(err);
      });
  };
};
export const setUserDetails = (data) => {
  return (dispatch) => {
    dispatch({ type: USER_DETAIL, payload: data });
    Promise.resolve(true);
  };
};
const requestForNotification = async (authToken, navigation) => {
  const isEnable = await requestPermissionForNotification(authToken);
  if (isEnable) {
    listenerForNotification(navigation, authToken);
    return getDeviceToken();
  }
};

export const memberLogin = (data, navigation = null) => {

  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = {
      inputPhoneNumber: data.mobile,
      inputPassword: data.password,
    };
    return Api('login', 'post', obj)
      .then(async (res) => {
        console.log('logi in api response--', res);
        if (res.status === 200) {
          // alert(JSON.stringify(res.data.data))
          // const device_id = await requestForNotification(res?.data?.data.authToken, navigation);
          // console.log('res--', device_id);
          // res.data.data = { ...res?.data?.data, fcmToken: device_id };
          await AsyncStorage.setItem('userLoginDetail', JSON.stringify(res?.data?.data));

          dispatch({
            type: USER_DETAIL,
            payload: res.data.data,
          });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(res.data.data);
        } else {
          dispatch({ type: LOADING, payload: false });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        alert('errorsss', err);
        console.log("err--",err)
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
        // dispatch({type: LOADING, payload: false});
      });
  };
};

export const getOtpByPhoneNumber = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = {
      inputPhoneNumber: data?.mobile,
      forResetPasswordFlag: data?.forResetPasswordFlag,
    };
    return Api('register', 'post', obj)
      .then(async (res) => {
        if (res.status === 200) {
          // alert(JSON.stringify(res.data.data))
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(res.data.data);
        } else {
          dispatch({ type: LOADING, payload: false });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        alert('errorsss', err);
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
        // dispatch({type: LOADING, payload: false});
      });
  };
};

export const setNewPassword = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = {
      inputPhoneNumber: data.mobile,
      inputPassword: data.password,
    };
    return Api('password', 'post', obj)
      .then(async (res) => {
        // console.log(res);

        // alert(JSON.stringify(res.data));
        if (res.status === 200) {
          // alert(JSON.stringify(res.data.data))
          // await AsyncStorage.setItem('userLoginDetail', JSON.stringify(res.data.data));
          await AsyncStorage.setItem('userLoginDetail', JSON.stringify(res.data.data));
          // console.log(res.data.data);
          dispatch({
            type: USER_DETAIL,
            payload: res.data.data,
          });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(true);
        } else {
          dispatch({ type: LOADING, payload: false });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
        // dispatch({type: LOADING, payload: false});
      });
  };
};
export const addFCMTokenToDb = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = {
      inputOtpToken: data,
    };
    return Api('add-notification-token', 'post', obj)
      .then(async (res) => {
        console.log("resss-",res)
        if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          dispatch({ type: LOADING, payload: false });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
        // dispatch({type: LOADING, payload: false});
      });
  };
};

export const memberLogut = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userAuthentication/logout', 'get')
      .then(async (res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          await AsyncStorage.removeItem('userLoginDetail');
          // setTimeout(()=>{
          //     dispatch({type: RESET_STORE, payload: true});
          // },500)

          return Promise.resolve(true);
        } else {
          alert(res.data.data);
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
        // dispatch({type: LOADING, payload: false});
      });
  };
};
