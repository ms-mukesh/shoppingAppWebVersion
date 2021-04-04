import React, {useState,useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, StyleSheet} from 'react-native';

import {useDispatch, useSelector} from "react-redux";
import {AppHeader, GradientBackground, Loading} from "../../common";
import {color, hp, normalize, wp} from "../../../helper/themeHelper";
import {getAllCategories, getCategoryWiseProduct} from "../../../redux/actions/homeScreenActions";


const ShopByCategoryScreen = props => {
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [categories,setCategories] = useState([]);
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getAllCategories()).then(async (res)=>{
            if(res){
                await setCategories(res)
                console.log("categories--",categories)
            }
        })
    },[])
    const getProductByCategory = (categoryId) =>{
        dispatch(getCategoryWiseProduct({inputCategoury:categoryId})).then((res)=>{
            if(res){
                props.navigation.navigate('ProductListisng',{data:res})
            }
        })
    }
    const renderCategories = ({item, index}) => {
        return (
            <View key={Math.random() + 'DE'} style={[style.mainView,{marginLeft:index!==0?wp(1):0}]}>
                <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                    getProductByCategory(item?._id)
                }}>
                    <Image resizeMode={'contain'} style={[style.categoryImageStyle,]} source={{uri:item.image}}/>
                </TouchableOpacity>
                <Text style={style.bottomTextStyle}>{item?.name}</Text>
            </View>
        );
    };
    return (
        <GradientBackground>
            <AppHeader title={'Available Categories'} onMenuPress={() => props.navigation.openDrawer()} />
            <View style={{flex:1,padding:wp(1)}}>
            <FlatList
                numColumns={3}
                // data={[...data.imgPath, ...data.docPath]}
                horizontal = {false}
                data={categories}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderCategories}
                keyExtractor={(item, index) => index.toString()}
            />
            </View>
            {isLoading && <Loading isLoading={isLoading} />}
        </GradientBackground>
    );
};
const style = StyleSheet.create({
    categoryImageStyle: {
        height: hp(25),
        width: wp(25),
        borderRadius: hp(2),
    },
    mainView:{
        width:wp(26),
        flex:1,marginTop:hp(2),
        paddingTop:hp(1),
        flexDirection:'column',alignItems:'center',
        backgroundColor: color.white,
        // backgroundColor: 'red',
        borderRadius:hp(2),
        paddingLeft:wp(2),
        paddingRight:wp(2),
        paddingBottom:hp(1)
    },
    bottomTextStyle:{marginTop:hp(1),fontSize:normalize(14),fontWeight:'700',color:color.themeBtnColor},
})

export default ShopByCategoryScreen;

