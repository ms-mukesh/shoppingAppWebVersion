
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import ProductList from '../screen/component/Product/showOwnerProduct';
import ProductDetails from '../screen/component/Product/productDetails'

const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="ProductList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
        </Stack.Navigator>
    );
};

export default App;
