import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import IntroductionScreen from '../screen/dummy';
import Login from '../screen/authentication/login';
import SignUp from '../screen/authentication/signUp';
import OtpVerification from '../screen/authentication/OtpVerification';
import SetNewPassword from '../screen/authentication/setNewPassword';
import DummyHome from '../screen/dummy';

const Stack = createStackNavigator();
const App = (props) => {
  // eslint-disable-next-line no-console
  // console.disableYellowBox = true;
  // console.log(props)

  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={Login}
        initialParams={{ fromPopUp: props?.route?.params?.fromPopUp,productId: props?.route?.params?.productId}}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      <Stack.Screen name="DummyHome" component={DummyHome} />
    </Stack.Navigator>
  );
};

export default App;
