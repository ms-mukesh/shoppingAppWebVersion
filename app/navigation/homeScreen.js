import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import HomePage from '../screen/component/Home/homeScreen'
import ProductDetail from '../screen/component/Home/productDetail'
import CartDetail from '../screen/component/cart/cartDetail'
import PlaceOrder from '../screen/component/order/placeOrder';
import ProductListisng from '../screen/component/Home/productList'
import PlaceDirectOrderScreen from '../screen/component/order/placeDirectOrder'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="HomePage" screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomePage" component={HomePage} />

            {/*<Stack.Screen name="CartDetail" component={CartDetail} />*/}


            {/*<Stack.Screen name="PlaceDirectOrderScreen" component={PlaceDirectOrderScreen} />*/}
            {/*<Stack.Screen name="MyAccount" component={MyAccount} />*/}
        </Stack.Navigator>
    );
};

export default App;
