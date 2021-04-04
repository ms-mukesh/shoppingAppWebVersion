import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import CreateShopPage from '../screen/component/createShop/createShop'
import CartDetail from "../screen/component/cart/cartDetail";



const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="CreateShopPage" screenOptions={{headerShown: false}}>
            <Stack.Screen name="CreateShopPage" component={CreateShopPage} />
        </Stack.Navigator>
    );
};

export default App;
