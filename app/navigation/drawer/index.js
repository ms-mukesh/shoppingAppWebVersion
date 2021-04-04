import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {isANDROID, IsAndroidOS, isIOS, IsIOSOS, wp} from '../../helper/themeHelper';
const Drawer = createDrawerNavigator();
import Login from '../../screen/authentication/login';
import HomeScreen from '../homeScreen';
import CreateShopScreen from '../createShop';
import PendingShops from '../shopList';
import CustomerOrderScreen from '../../screen/component/order/showCustomerSideMyOrder';
import CartScreen from '../../screen/component/cart/cartDetail';
import MyAccountScreen from '../../screen/component/Home/MyAccount';
import AddressListScreen from '../../screen/component/Home/addressList';
import AddNewProductScreen from '../product';
import StoreOwnerProductList from '../shopOwnerProductList';
import ShopByCategoryScreen from '../../screen/component/Home/shopByCategroyPage';
import ShopOwnerOrderScreen from '../shopOwnerProduct';
import ShopOwnerRequestStatusScreen from '../../screen/component/shops/shopOwnerRequest';
import ShopDetailEditScreen from '../../screen/component/shops/editShopDetails';

import {DrawerContent} from './drawerContent';
import {useSelector} from 'react-redux';


const DrawerNavigation = props => {
    let params = props.route.params;
    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} params={params} />}
            drawerStyle={{width:(IsAndroidOS || IsIOSOS)?wp(70): wp(30)}}
            backBehavior={'initialRoute'}
            initialRouteName={'HomeScreen'}
            openByDefault={false}
        >
            <Drawer.Screen name="Login" component={Login} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="CreateShopScreen" component={CreateShopScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="PendingShops" component={PendingShops} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="CustomerOrderScreen" component={CustomerOrderScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="CartScreen" component={CartScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="MyAccountScreen" component={MyAccountScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AddressListScreen" component={AddressListScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AddNewProductScreen" component={AddNewProductScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="StoreOwnerProductList" component={StoreOwnerProductList} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ShopByCategoryScreen" component={ShopByCategoryScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ShopOwnerOrderScreen" component={ShopOwnerOrderScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ShopOwnerRequestStatusScreen" component={ShopOwnerRequestStatusScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ShopDetailEditScreen" component={ShopDetailEditScreen} options={{unmountOnBlur: true}} />
            {/*<Drawer.Screen name="AddVoter" component={AddVoter} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="BroadcastNotification" component={BroadcastNotification} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Notification" component={Notification} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="ChangePassword" component={ChangePassword} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="EventCalender" component={EventCalender} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Home" component={homePage} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Event" component={Events} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="News" component={News} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Contribution" component={Contribution} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Gallary" component={Gallary} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen name="Organization" component={Organization} options={{unmountOnBlur: true}} />*/}
            {/*<Drawer.Screen*/}
            {/*    name="TutorialToUseApp"*/}
            {/*    component={TutorialToUseApp}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="ChangePassword"*/}
            {/*    component={ChangePassword}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="SplashScreens"*/}
            {/*    component={SplashScreens}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="NotificationNavigation"*/}
            {/*    component={NotificationNavigation}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name="NotificationList"*/}
            {/*    component={NotificationList}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen*/}
            {/*    name={'BoardCastNotification'}*/}
            {/*    component={BoardcastNotification}*/}
            {/*    options={{unmountOnBlur: true}}*/}
            {/*/>*/}
            {/*<Drawer.Screen name="Education" component={Education} options={{unmountOnBlur: true}} />*/}
        </Drawer.Navigator>
    );
};

export default DrawerNavigation;
