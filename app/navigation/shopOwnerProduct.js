import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import OrderList from '../screen/component/shops/ShopOrders';
import OrderDetails from '../screen/component/shops/shopOrderDetail';


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="OrderList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="OrderList" component={OrderList} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
        </Stack.Navigator>
    );
};

export default App;
