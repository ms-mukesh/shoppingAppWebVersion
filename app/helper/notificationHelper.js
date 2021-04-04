import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
// import notifee from '@notifee/react-native';
import { isIOS } from './themeHelper';
import { CommonActions } from '@react-navigation/native';

import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_TYPE } from './constant';

export const requestPermissionForNotification = async (userAuthToken = null) => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  }
  return null;
};

export const getDeviceToken = () => {
  return messaging()
    .getToken()
    .then((token) => {
      console.log('Device Id... ', token);
      return token;
    });
};

export const listenerForNotification = async (navigation, userAuthToken = null) => {
  EventRegister.addEventListener('clearNotificationTray', (data) => {
    // notifee.cancelAllNotifications().then((res) => {});
    // if (isIOS) {
    //   PushNotification.clearAllNotifications();
    //   PushNotification.removeAllDeliveredNotifications();
    //   PushNotification.cancelAllLocalNotifications();
    // }
  });
  const goToChatScreen = (message) =>
    navigation.navigate('GroupChat', {
      data: JSON.parse(message),
    });

  const gotToNavigationScreen = (notificationData) => {
    console.log('data-0-', notificationData);
    console.log('type--', notificationData.notification.data);
    AsyncStorage.getItem('userLoginDetail').then((res) => {
      if (res) {
        if (
          notificationData?.notification?.data?.notificationType === NOTIFICATION_TYPE.storeRequest
        ) {
          navigation.navigate('ShopList', { fromPopUp: true });
        } else if (notificationData?.data?.notificationType === NOTIFICATION_TYPE.storeRequest) {
          navigation.navigate('ShopList', { fromPopUp: true });
        } else {
          navigation.navigate('ShopOwnerRequestScreen', { fromPopUp: true });
        }
      } else {
        alert('Please login First Then Check Your Status..');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'authentication', params: { fromPopUp: true } }],
          })
        );
      }
    });
    // navigation.navigate('ShopOwnerRequestScreen', { fromPopUp: true });
  };

  // const channelId = await notifee.createChannel({
  //   id: '123',
  //   name: 'M-Textile',
  // });
  //
  // notifee.onForegroundEvent(({ type, detail }) => {
  //   if (detail?.pressAction?.id === 'default') {
  //     notifee.cancelAllNotifications().then((res) => {});
  //     // if (isIOS) {
  //     //   PushNotification.clearAllNotifications();
  //     //   PushNotification.removeAllDeliveredNotifications();
  //     //   PushNotification.cancelAllLocalNotifications();
  //     // }
  //     // let tempObj = JSON.parse(detail?.notification?.data?.message);
  //     gotToNavigationScreen(detail);
  //     // if (detail?.notification?.data?.message) {
  //     //   if (typeof tempObj.group_ride !== 'undefined' && tempObj?.group_ride) {
  //     //     gotToNavigationScreen(tempObj);
  //     //   } else {
  //     //     goToChatScreen(detail?.notification?.data?.message);
  //     //   }
  //     // } else {
  //     //   goToChatScreen(detail?.notification?.data?.message);
  //     // }
  //   }
  // });

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('remote message--', remoteMessage);
    // notifee.cancelAllNotifications().then((res) => {});
    // if (isIOS) {
    //   PushNotification.clearAllNotifications();
    //   PushNotification.removeAllDeliveredNotifications();
    //   PushNotification.cancelAllLocalNotifications();
    // }

    console.log('Notification caused app to open from background state:', remoteMessage);
    gotToNavigationScreen(remoteMessage);
    // goToChatScreen(remoteMessage?.data?.message);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage((remoteMessage) => {
    console.log('remote message from here--', remoteMessage);
    // notifee.displayNotification({
    //   title: remoteMessage?.notification?.title,
    //   body: remoteMessage?.notification?.body,
    //   data: remoteMessage?.data,
    //   sound: 'default',
    //   android: {
    //     channelId: channelId,
    //     pressAction: {
    //       id: 'default',
    //     },
    //   },
    // });
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        console.log('3', remoteMessage);

        setTimeout(() => {
          gotToNavigationScreen(remoteMessage);
        }, 1000);
      }
    });
};
