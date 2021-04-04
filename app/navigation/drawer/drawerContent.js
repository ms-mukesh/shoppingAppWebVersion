import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const defaultUserMaleImage = require('../../assets/images/user_male.png');
import {
  SafeAreaView,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  dashboard_icon,
  help_icon,
  password_icon,
  logut_icon,
  shop_category_icon,
  add_new_product_icon,
  my_product_icon,
  create_shop_icon,
  my_orders_icon,
  address_list_icon,
  shop_list_icon,
  shop_request_icon,
  shopping_cart_icon,
  my_account_icon,
  my_shop_order_icon,
  up_arrow,
  down_arrow,
} from '../../assets/images';
import { color, font, hp, isANDROID, normalize, wp } from '../../helper/themeHelper';
import { center } from '../../helper/styles';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { GradientBackground } from '../../screen/common';
import { ALL, USER_ADMIN, USER_MERCHANT, USER_NORMAL } from '../../helper/constant';

let temp = 0;

export const DrawerContent = (props) => {
  const dispatch = useDispatch();
  const userDetails1 = useSelector((state) => state.user.userDetail);
  const [userDetails, setUserDetails] = useState(null);
  console.log(userDetails1);
  const [shopExpandable, setShopExpandable] = useState(false);
  const [productExpandable, setProductExpandable] = useState(false);
  const DrawerItems = [
    {
      iconSource: dashboard_icon,
      title: 'Home',
      urlToPage: 'HomeScreen',
    },
    {
      iconSource: shop_category_icon,
      title: 'Shop by Category',
      urlToPage: 'ShopByCategoryScreen',
    },

    {
      icon: 'notifications-none',
      title: 'My orders',
      urlToPage: 'CustomerOrderScreen',
      iconSource: my_orders_icon,
    },
    {
      iconSource: shop_list_icon,
      title: 'Shop      ',
      rightIconSource: shopExpandable ? up_arrow : down_arrow,
      expandedValueSource: [
        {
          icon: 'notifications-none',
          title: 'Edit My Shop',
          urlToPage: 'ShopDetailEditScreen',
          iconSource: my_orders_icon,
        },
        userDetails1?.storeRequest
          ? {
              icon: 'news',
              title: 'Create your shop',
              urlToPage: 'CreateShopScreen',
              iconSource: create_shop_icon,
            }
          : { title: false },
        !userDetails1?.storeRequest && {
          iconSource: shop_request_icon,
          icon: 'notifications-none',
          title: 'My Shop requests',
          urlToPage: 'ShopOwnerRequestStatusScreen',
        },
        {
          iconSource: my_shop_order_icon,
          icon: 'notifications-none',
          title: 'My Shop Orders',
          urlToPage: 'ShopOwnerOrderScreen',
        },
      ],
    },
    {
      iconSource: my_product_icon,
      title: 'Products',
      rightIconSourceForProduct: productExpandable ? up_arrow : down_arrow,
      expandedValueSource: [
        {
          iconSource: add_new_product_icon,
          title: 'Add New Product',
          urlToPage: 'AddNewProductScreen',
        },
        {
          iconSource: my_product_icon,
          title: 'My Products',
          urlToPage: 'StoreOwnerProductList',
        },
      ],
    },
    {
      iconSource: address_list_icon,
      icon: 'notifications-none',
      title: 'My Address List',
      urlToPage: 'AddressListScreen',
    },
    {
      iconSource: shop_list_icon,
      icon: 'notifications-none',
      title: 'Shop List',
      urlToPage: 'PendingShops',
    },
    {
      iconSource: shopping_cart_icon,
      icon: 'notifications-none',
      title: 'My Cart',
      urlToPage: 'CartScreen',
    },
    {
      iconSource: my_account_icon,
      icon: 'notifications-none',
      title: 'My Account',
      urlToPage: 'resizeMode={\'contain\'}',
    },
    {
      iconSource: password_icon,
      icon: 'security',
      title: 'Setting',
      urlToPage: 'ChangePassword',
    },

    {
      iconSource: help_icon,
      icon: 'help',
      title: 'About us',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: help_icon,
      icon: 'help',
      title: 'Terms of use',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: logut_icon,
      icon: 'logout',
      title: 'Logout',
      urlToPage: 'Login',
    },
  ];
  const DrawerItemsForNormalUser = [
    {
      iconSource: dashboard_icon,
      title: 'Home',
      urlToPage: 'HomeScreen',
    },
    {
      iconSource: shop_category_icon,
      title: 'Shop by Category',
      urlToPage: 'ShopByCategoryScreen',
    },

    {
      icon: 'notifications-none',
      title: 'My orders',
      urlToPage: 'CustomerOrderScreen',
      iconSource: my_orders_icon,
    },
    {
      iconSource: shop_list_icon,
      title: 'Shop      ',
      rightIconSource: shopExpandable ? up_arrow : down_arrow,
      expandedValueSource: [
        !userDetails1?.storeRequest
          ? {
              icon: 'news',
              title: 'Create your shop',
              urlToPage: 'CreateShopScreen',
              iconSource: create_shop_icon,
            }
          : { title: false },
        !userDetails1?.storeRequest
          ? {
              iconSource: shop_request_icon,
              icon: 'notifications-none',
              title: 'My Shop requests',
              urlToPage: 'ShopOwnerRequestStatusScreen',
            }
          : { title: false },
      ],
    },
    {
      iconSource: address_list_icon,
      icon: 'notifications-none',
      title: 'My Address List',
      urlToPage: 'AddressListScreen',
    },
    {
      iconSource: shopping_cart_icon,
      icon: 'notifications-none',
      title: 'My Cart',
      urlToPage: 'CartScreen',
    },
    {
      iconSource: my_account_icon,
      icon: 'notifications-none',
      title: 'My Account',
      urlToPage: 'MyAccountScreen',
    },
    {
      iconSource: password_icon,
      icon: 'security',
      title: 'Setting',
      urlToPage: 'ChangePassword',
    },

    {
      iconSource: help_icon,
      icon: 'help',
      title: 'About us',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: help_icon,
      icon: 'help',
      title: 'Terms of use',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: logut_icon,
      icon: 'logout',
      title: 'Logout',
      urlToPage: 'Login',
    },
  ];
  const DrawerItemsForAdmin = [
    {
      iconSource: dashboard_icon,
      title: 'Home',
      urlToPage: 'HomeScreen',
    },
    {
      iconSource: shop_category_icon,
      title: 'Shop by Category',
      urlToPage: 'ShopByCategoryScreen',
    },
    {
      icon: 'notifications-none',
      title: 'My orders',
      urlToPage: 'CustomerOrderScreen',
      iconSource: my_orders_icon,
    },
    {
      iconSource: address_list_icon,
      icon: 'notifications-none',
      title: 'My Address List',
      urlToPage: 'AddressListScreen',
    },
    {
      iconSource: shop_list_icon,
      icon: 'notifications-none',
      title: 'Shop List',
      urlToPage: 'PendingShops',
    },
    {
      iconSource: shopping_cart_icon,
      icon: 'notifications-none',
      title: 'My Cart',
      urlToPage: 'CartScreen',
    },
    {
      iconSource: my_account_icon,
      icon: 'notifications-none',
      title: 'My Account',
      urlToPage: 'MyAccountScreen',
    },
    {
      iconSource: password_icon,
      icon: 'security',
      title: 'Setting',
      urlToPage: 'ChangePassword',
    },
    {
      iconSource: help_icon,
      icon: 'help',
      title: 'About us',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: help_icon,
      icon: 'help',
      title: 'Terms of use',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: logut_icon,
      icon: 'logout',
      title: 'Logout',
      urlToPage: 'Login',
    },
  ];
  const DrawerItemsForMerchant = [
    {
      iconSource: dashboard_icon,
      title: 'Home',
      urlToPage: 'HomeScreen',
    },

    {
      iconSource: shop_category_icon,
      title: 'Shop by Category',
      urlToPage: 'ShopByCategoryScreen',
    },

    {
      icon: 'notifications-none',
      title: 'My orders',
      urlToPage: 'CustomerOrderScreen',
      iconSource: my_orders_icon,
    },
    {
      iconSource: shop_list_icon,
      title: 'Shop      ',
      rightIconSource: shopExpandable ? up_arrow : down_arrow,
      expandedValueSource: [
        {
          icon: 'notifications-none',
          title: 'Edit My Shop',
          urlToPage: 'ShopDetailEditScreen',
          iconSource: my_orders_icon,
        },
        {
          iconSource: my_shop_order_icon,
          icon: 'notifications-none',
          title: 'My Shop Orders',
          urlToPage: 'ShopOwnerOrderScreen',
        },
      ],
    },
    {
      iconSource: my_product_icon,
      title: 'Products',
      rightIconSourceForProduct: productExpandable ? up_arrow : down_arrow,
      expandedValueSource: [
        {
          iconSource: add_new_product_icon,
          title: 'Add New Product',
          urlToPage: 'AddNewProductScreen',
        },
        {
          iconSource: my_product_icon,
          title: 'My Products',
          urlToPage: 'StoreOwnerProductList',
        },
      ],
    },
    {
      iconSource: address_list_icon,
      icon: 'notifications-none',
      title: 'My Address List',
      urlToPage: 'AddressListScreen',
    },
    {
      iconSource: shopping_cart_icon,
      icon: 'notifications-none',
      title: 'My Cart',
      urlToPage: 'CartScreen',
    },
    {
      iconSource: my_account_icon,
      icon: 'notifications-none',
      title: 'My Account',
      urlToPage: 'MyAccountScreen',
    },
    {
      iconSource: password_icon,
      icon: 'security',
      title: 'Setting',
      urlToPage: 'ChangePassword',
    },

    {
      iconSource: help_icon,
      icon: 'help',
      title: 'About us',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: help_icon,
      icon: 'help',
      title: 'Terms of use',
      urlToPage: 'TutorialToUseApp',
    },
    {
      iconSource: logut_icon,
      icon: 'logout',
      title: 'Logout',
      urlToPage: 'Login',
    },
  ];

  const renderExpandableRow = (props, index) => {
    const { drawerRow, rowText } = style;
    const {
      title,
      urlToPage,
      iconSource,
      rightIconSource = false,
      expandedValueSource = null,
    } = props;
    const onRowPress = async () => {
      if (urlToPage === 'ShopOwnerRequestStatusScreen') {
        props.navigation.navigate(urlToPage, { fromPopUp: false });
      } else if (urlToPage === 'PendingShops') {
        props.navigation.navigate(urlToPage, { fromPopUp: false });
      } else {
        props.navigation.navigate(urlToPage);
      }
    };
    return (
      title && (
        <View key={index}>
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            style={[drawerRow, { backgroundColor: color.lightGray, paddingLeft: wp(6) }]}
            onPress={onRowPress}
          >
            <View style={[style.drawerContainer]}>
              <Image source={iconSource} style={{ height: hp(3), width: hp(3) }} />
            </View>
            <Text allowFontScaling={false} style={rowText}>
              {title}
            </Text>
          </TouchableOpacity>
          {index === DrawerItems.length && <View style={{ flex: 1 }} />}
        </View>
      )
    );
  };

  const renderRow = (data, index) => {
    const { drawerRow, rowText } = style;
    const {
      IconTag,
      icon,
      title,
      urlToPage,
      iconSource,
      rightIconSource = false,
      expandedValueSource = null,
      rightIconSourceForProduct = false,
    } = data.item;
    const onRowPress = async () => {
      if (rightIconSource) {
        setShopExpandable(!shopExpandable);
      } else if (rightIconSourceForProduct) {
        setProductExpandable(!productExpandable);
      } else {
        if (urlToPage === 'Login') {
          await AsyncStorage.removeItem('userLoginDetail');
          props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'authentication', params: { fromPopUp: false } }],
              })
          );
        } else if (urlToPage === 'NotificationList') {
          props.navigation.navigate(urlToPage, {
            notificationTitle: 'All Notifications',
            notificationType: ALL,
          });
        } else if (urlToPage === 'PendingShops') {
          props.navigation.navigate(urlToPage, { fromPopUp: false });
        } else {
          props.navigation.navigate(urlToPage);
        }
      }
    };

    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          style={[drawerRow, { borderBottomWidth: index === 7 ? hp(0.08) : 0 }]}
          onPress={onRowPress}
        >
          <View style={[style.drawerContainer, {}]}>
            <Image source={iconSource} style={{ height: hp(3), width: hp(3) }} />
          </View>
          <Text allowFontScaling={false} style={rowText}>
            {title}
          </Text>
          {rightIconSource && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShopExpandable(!shopExpandable);
              }}
            >
              <Image
                source={rightIconSource}
                style={{ height: hp(2.5), width: hp(2.5), marginLeft: wp(7) }}
              />
            </TouchableOpacity>
          )}
          {rightIconSourceForProduct && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setProductExpandable(!productExpandable);
              }}
            >
              <Image
                source={rightIconSourceForProduct}
                style={{ height: hp(2.5), width: hp(2.5), marginLeft: wp(6.5) }}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {rightIconSource &&
          expandedValueSource !== null &&
          shopExpandable &&
          expandedValueSource.map((item, index) =>
            renderExpandableRow({ ...props, ...item }, index)
          )}
        {rightIconSourceForProduct &&
          expandedValueSource !== null &&
          productExpandable &&
          expandedValueSource.map((item, index) =>
            renderExpandableRow({ ...props, ...item }, index)
          )}
        {index === DrawerItems.length && <View style={{ flex: 1 }} />}
      </View>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView
        style={{ flex: 1, overflow: 'hidden' }}
        forceInset={{ top: 'always', bottom: 'never' }}
      >
        <View
          style={{
            // ...center,
            paddingVertical: hp(2),
            paddingHorizontal: hp(2),
            marginLeft:wp(4.5)
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.navigate('MyAccountScreen');
            }}
          >
            <View style={{ flexDirection: 'row', marginTop: isANDROID ? hp(5) : 0 }}>
              {typeof userDetails1?.image !== 'undefined' &&
              userDetails1 !== null &&
              userDetails1?.image !== null &&
              userDetails1?.image !== '' ? (
                <Image
                  style={style.drawerImage}
                  resizeMode={'cover'}
                  source={{
                    uri: userDetails1?.image,
                  }}
                />
              ) : (
                <Image style={style.drawerImage} source={defaultUserMaleImage} />
              )}
              {typeof userDetails1?.firstName !== 'undefined' ? (
                <Text
                  style={{
                    fontSize: normalize(18),
                    fontWeight: '500',
                    alignSelf: 'center',
                    marginLeft: wp(4),
                  }}
                >
                  {'Hello,' + userDetails1?.firstName}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: normalize(18),
                    fontWeight: '500',
                    alignSelf: 'center',
                    marginLeft: wp(4),
                  }}
                >
                  {'Hello,' + userDetails1?.phoneNumber}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingVertical: hp(0) }}>
          <FlatList
            numColumns={1}
            // data={DrawerItems}
            data={
              userDetails1?.role === USER_ADMIN
                ? DrawerItemsForAdmin
                : userDetails1?.role === USER_MERCHANT
                ? DrawerItemsForMerchant
                : userDetails1?.role === USER_NORMAL
                ? DrawerItemsForNormalUser
                : DrawerItems
            }
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const style = StyleSheet.create({
  headerText: {
    fontSize: normalize(16),
    fontFamily: font.robotoBold,
    marginTop: hp(2),
    color: color.white,
  },
  drawerRow: {
    // backgroundColor: color.white,
    flexDirection: 'row',
    marginTop: hp(0.5),
    ...center,
    justifyContent: 'flex-start',
  },
  rowText: {
    color: color.black,
    fontSize: normalize(14),
    fontFamily: font.robotoRegular,
    marginLeft: wp(1),
    fontWeight:'700'
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: wp(42),
    backgroundColor: color.lightBlue,
    padding: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(12.5),
  },
  drawerContainer: {
    paddingLeft: wp(6),
    paddingRight: wp(3),
    marginVertical: hp(0.3),
    paddingVertical: hp(0.8),
    borderBottomRightRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  drawerImage: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(5),
    backgroundColor: color.lightGray,
  },
});
