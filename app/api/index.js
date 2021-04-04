import axios from 'axios';
import { getToken, generateRandomNumber } from './getToken';
import { checkConnectivity } from '../screen/functions';
import { Alert } from 'react-native-web';

// import {generateRandomNumber} from '../helper/validation';
// import {checkConnectivity, canCallApi} from '../screen/functions/';
// import {Alert} from 'react-native';
// import {EventRegister} from 'react-native-event-listeners';

// const setUnauthorizedUser = async message => {
//   return Alert.alert(
//     'Not Authorized',
//     message,
//     [
//       {
//         text: 'Okay',
//         onPress: () => {
//           EventRegister.emit('forceLogoutEvent');
//         },
//       },
//     ],
//     {
//       cancelable: false,
//     }
//   );
// };

export const Api = async (endpoint, method, data = null) => {
  let token = await getToken();
  console.log('token--', token);
  // let deviceId = await getDeviceId();
  let randomNumber = (await new Date().getTime().toString()) + generateRandomNumber();
  endpoint =
    endpoint.indexOf('?') > -1
      ? endpoint + '&randomKey=' + randomNumber
      : endpoint + '?randomKey=' + randomNumber;

  // let baseurl = 'https://shop-text-tile.herokuapp.com/api/';
  // let baseurl = 'http://3.22.119.214:3100/api/'; //ec2-instance
  let baseurl = 'http://18.219.190.99:3100/api/';
  let url = baseurl + endpoint;
  // checkConnectivity().then((res)=>{
  //   console.log(res)
  // })
  let header = {
    'Content-Type': 'application/json;charset=utf-8',
  };
  console.log('token--', token);

  header = (token === '' && header) || Object.assign(header, { token: token });
  return checkConnectivity().then((isNetworkAvailabe) => {
    if (isNetworkAvailabe) {
      switch (method) {
        case 'get':
          return axios
            .get(url, { headers: header })
            .then((res) => {
              if (res.status === 200) {
                if (
                  res.data.errCode &&
                  res.data.errCode === 401 &&
                  endpoint !== 'userActions/getUserProfile'
                ) {
                  return setUnauthorizedUser(res.data.errMessage);
                } else if (endpoint === 'userActions/getUserProfile') {
                  if (res.data.errCode && res.data.errCode === 401) {
                    return false;
                  } else {
                    return res;
                  }
                } else {
                  return res;
                }
              } else {
                return res;
              }
            })
            .catch((err) => {
              // alert('Oops! May be Server Issue');
              return err;
            });
        case 'post':
          return axios
            .post(url, data, { headers: header })
            .then((res) => {
              if (res.status === 200) {
                return res;
              } else {
                // alert(res.data.data);
                return res;
              }
            })
            .catch((err) => {
              // alert('Oops! May be Server Issue');
              return err;
            });
      }
    } else {
      return Alert.alert(
        'No Internet',
        'Oops! May be your internet is off',
        [
          {
            text: 'Try Again',
            onPress: () => {
              Api(endpoint, method, data);
            },
          },
          {
            text: 'Okay',
            onPress: () => {},
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  });
};
