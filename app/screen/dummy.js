import React from 'react';
import { View, Text } from 'react-native';
import { AppHeader, GradientBackground, Loading } from '../screen/common/';
import { useSelector } from 'react-redux';

const CustomerOrderScreen = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  console.log(props)
  return (
    <GradientBackground>
      {isLoading && <Loading isLoading={isLoading} />}
      <AppHeader title={'My Orders'} onMenuPress={() => props.navigation.openDrawer()} />
    </GradientBackground>
  );
};

export default CustomerOrderScreen;
