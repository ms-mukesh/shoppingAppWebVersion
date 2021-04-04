import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import AddNewProduct from '../screen/component/Product/addNewProduct'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="AddNewProduct" screenOptions={{headerShown: false}}>
            <Stack.Screen name="AddNewProduct" component={AddNewProduct} />
        </Stack.Navigator>
    );
};

export default App;
