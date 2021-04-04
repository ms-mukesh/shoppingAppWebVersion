import React, {useState} from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Image,
    ActivityIndicator, ScrollView, TouchableOpacity,Text,SafeAreaView
} from 'react-native';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GENDER} from '../../helper/constant';
import DefaultFemaleIcon from '../../assets/images/user_female.png';
import DefaultMaleIcon from '../../assets/images/user_male.png';
import {cross_black_icon} from "../../assets/images";

const ImagePreview = props => {
    const {imgArray = [] ,setPreviewClose,editOption=false,onPressEdit=null } = props;
    const {mainView, closeButton, imgView} = styles;
    const [isLoader, setIsLoader] = useState(false);
    return (
        <Modal
            onRequestClose={() => setPreviewClose()}
            animated={false}
            transparent={true}
            visible={true}>
            <SafeAreaView style={mainView}>
                <View style={{flexDirection:'row'}}>
                <TouchableWithoutFeedback onPress={()=>{
                    setPreviewClose()
                }}>
                    <Text style={{flex:1,color:color.white,paddingRight: wp(5),fontSize:normalize(16),fontWeight: 'bold',alignSelf:'flex-end'}}>cancel</Text>
                </TouchableWithoutFeedback>
                    {editOption &&
                    <TouchableWithoutFeedback onPress={() => {
                        onPressEdit()
                    }}>
                        <Text style={{
                            color: color.white,
                            paddingRight: wp(5),
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            alignSelf: 'flex-end'
                        }}>edit</Text>
                    </TouchableWithoutFeedback>
                    }
                </View>
                <ActivityIndicator
                    style={{marginTop: hp(20), position: 'absolute'}}
                    animating={isLoader}
                    size={'large'}
                    color={'gray'}
                />


                <ScrollView
                    scrollEventThrottle={16}
                    pagingEnabled={true}
                    horizontal={true}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}>
                    {imgArray?.map((item)=>{
                        return(

                                <View style={{flex: 1, width: wp(100)}}>
                                    <Image resizeMode={'contain'} style={{ height:hp(100),
                                        width:wp(100)}} source={{uri:item}}/>
                                </View>
                        )
                    })}
                </ScrollView>


            </SafeAreaView>
        </Modal>
    );
};
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'rgba(14,14,14,0.93)',
    },
    closeButton: {
        color: color.white,
        // fontSize: normalize(15),
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginRight: wp(6),
    },
    imgView: {
        height: hp(45),
        width: hp(40),
        marginTop: hp(1),
        overflow: 'hidden',
        alignSelf: 'center',
    },
});
export {ImagePreview};
