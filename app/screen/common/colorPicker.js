import React, { useCallback, useEffect, useState } from 'react';

import { color, hp, isANDROID, wp } from '../../helper/themeHelper';
import { FlatList, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
const colorArray = [
  { colorName: 'white', hexCode: '#FFFFFF' },
  { colorName: 'silver', hexCode: '#C0C0C0' },
  { colorName: 'gray', hexCode: '#808080' },
  { colorName: 'black', hexCode: '#000000' },
  { colorName: 'red', hexCode: '#FF0000' },
  { colorName: 'maroon', hexCode: '#800000' },
  { colorName: 'yellow', hexCode: '#FFFF00' },
  { colorName: 'olive', hexCode: '#808000' },
  { colorName: 'lime', hexCode: '#00FF00' },
  { colorName: 'green', hexCode: '#008000' },
  { colorName: 'aqua', hexCode: '#00FFFF' },
  { colorName: 'teal', hexCode: '#008080' },
  { colorName: 'blue', hexCode: '#0000FF' },
  { colorName: 'navy', hexCode: '#000080' },
  { colorName: 'fuchsia', hexCode: '#FF00FF' },
];
const CustomColorPicker = (props) => {
  const { setCurrentColor = null, closeColorPicker } = props;
  const _RenderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentColor(item?.colorName);
          closeColorPicker();
        }}
        style={{ paddingLeft: wp(1), paddingTop: hp(1) }}
      >
        <View style={[style.colorBox, { backgroundColor: item?.hexCode }]} />
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      transparent={true}
      animated={true}
      onRequestClose={() => {
        closeColorPicker();
      }}
    >
      <TouchableOpacity
        onPress={() => {
          closeColorPicker();
        }}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(71,71,71,0.8)',
        }}
      >
        <FlatList
          data={colorArray}
          numColumns={5}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => _RenderItem(item, index)}
          horizontal={false}
          contentContainerStyle={{ marginTop: hp(35) }}
          bounces={isANDROID ? false : true}
        />
      </TouchableOpacity>
    </Modal>
  );
};
const style = StyleSheet.create({
  colorBox: {
    height: hp(8),
    width: hp(8),
  },
});
export { CustomColorPicker };
