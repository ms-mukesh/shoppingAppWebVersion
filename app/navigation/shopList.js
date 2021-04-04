import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import ShopList from '../screen/component/shops/shopList';
import ShopDetails from '../screen/component/shops/shopDetail';

const Stack = createStackNavigator();
const App = (props) => {
  // eslint-disable-next-line no-console
  // console.disableYellowBox = true;

  return (
    <Stack.Navigator initialRouteName="ShopList" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ShopList"
        component={ShopList}
        initialParams={{ fromPopUp: props?.route?.params?.fromPopUp }}
      />
      <Stack.Screen name="ShopDetails" component={ShopDetails} />
    </Stack.Navigator>
  );
};

export default App;
