import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  FlatList,
  Linking,
  Share,
} from 'react-native';
import { AppButton, AppHeader, GradientBackground, Loading } from '../../common';
import {hp, wp, normalize, color, isANDROID, IsIOSOS, IsAndroidOS} from '../../../helper/themeHelper';
import { shadowStyle } from '../../../helper/styles';
import { cross_black_icon, search_icon } from '../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderStatus } from '../../../redux/actions/dashboardAction';
import {
  addItemToRecentItemList,
  getAllBrandList,
  getAllCategories,
  getAllStoresForCustomers,
  getBrandWiseProduct,
  getCategoryWiseProduct,
  getProductDetail,
  getQuickHomeScreenProduct,
  getRecentItemList,
  getShopWiseProduct,
  getTrendingProduct,
  searchProduct,
} from '../../../redux/actions/homeScreenActions';
import {
  getAutoCompleteData,
  getCustomerOrder,
  getMyAddresses,
} from '../../../redux/actions/userActions';
import { defaultFilterObject } from '../../../helper/constant';
import * as Sharing from 'expo-sharing';
// import FastImage from 'react-native-fast-image';
// import RNUpiPayment from 'react-native-upi-payment';
const dummyAdvertisment = [
  {
    itemName: 'test1',
    imgUrl:
      'https://www.adobe.com/content/dam/cc/us/en/products/paras/What_is_Adobe_Textile_Designer2.jpg.img.jpg',
  },
  {
    itemName: 'test1',
    imgUrl:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBgaFxgXFxsbGBoaGhgYGhkYGBoaHSggHRolGxgaIjEhJSkrLi4uGB8zODMsNyguLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALoBEAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgcBAP/EAD4QAAECBAQEBAQFAgYCAgMAAAECEQADITEEEkFRBSJhcTKBkfAGQqGxE1LB0eFi8RQjcoKSojOTssJDs+L/xAAZAQACAwEAAAAAAAAAAAAAAAABAgADBAX/xAAnEQACAgICAQQBBQEAAAAAAAAAAQIRAwQhMRIiQVFhcRNCgZGxFP/aAAwDAQACEQMRAD8AzqkAKdlEJBKKZUnKy0sKoJMoqFw+Xe9v4ZSMzFbO5v4Esp2ZTGUoGuYOnaKpiilKvwy4YFD7JBUgUoSZWZBzAWalYtCSijFWTwj8yUigT1MlehqUgwwAUSXBzAKrcEsyRkWUsWcpKF0Itake4R1KOaj5hMAZWV2QokbiYEL5kmhJeCRZTgkMQW1SkZVAndUtSFMoaR7Il5FKE05spq+uVkTVZTvLUlV2paIQrxMtLISPEXJy1CQtQRMCc1imayhlVZRpePZWHBJplWuqlB1NndKwpixCZyUlixrrrbIw6i+dOVRygkpYs/4UwgAsCxSp9S0WSUGZlBbQLLAqBmgypj0qRMQhX+4XiEB0BUxVQ2Y1JoE51VBKnzBOIQDYtnNoukglwWGcuSGtMNSCzumcK7A0j5KzzKBHPlflbJ+KwJLGmWcgHW/WLUzFzDQB1FT2BSJhAmKALUTOSDzbv1EIQxCgtysZAsVyjw/iOleZq0moSd6xLBqExVQTRsqRMBzTM0qb8qgQFpSdTU60A+IW5UFIHM4ctZYOZmmB/wDNQTbWrCh+mTQTcVHKSHUla0ylOErSkq5jorMRakQBCdi1TMxExWdszgPUynVTMC4VJBsQDcm0D8WxgSTMUQCcxBGhKyVBC2SrPQ8swFwbgQFxjFJluXBAOVsrgsZhysSVSlZVOMvKK61jPqxRmqzLJOzlyzkjMdTU1O8LKVF+HC8jLsTiFzeVCcqdwGcdAKJBDHKKO51j2Rw1vfv2YIw88N7/AE6QWiaCN/f0ihybOzi14QRQjDNExJ9++sXpVb6RLq7wpoUQf8Onv3vFK5NPfu0MG099W8/vH2X3/PeJYfESYjB9L+/29YWzsNGoVJHvt+0DTsG/7e/dYKZRkwKSE/D+KzZJDKJT+Un7bRreFfEcuZy5spIok0rrZnPnoIzOI4f79+6wum4YiHuzn5Ndx6Ot4bHUYB6Nd+rAJYBldfmFINw2Jdy5N2IAOyg5cJTrYJN7xybh/Hpso15x1v5ExruF/EKJjc1aULOG0v8AYawTK4G2RixU96+ikupVz1YG1TBknE8yiDW5BfNRiC3i82/3RmMLiQ97dWpa5rYiw0NIZYfEU2LjtV0mlyXaxF7QbK3E0aMaXa59m1T9fMNDFE8b/bbvt9u8ZaXMJoTsSAx6FwAAK/mynrWDZOK0bZy56hzoCdyfO8NYlGllTffm33i0ohHhsS6elDuwqHozW/k1g+TiBTr1+/n94awBH4MUTJXp3p6QSlbxIoiEFi5ZBp9tPf2ihaGOj6+6HYjaGkyVFC5R9tbz92gUQ5UjMlXK7JLpe4GX8WWCf/Ylj0FY+ISHKEOE8xJIBKUJKkmgILyllLhrB49JSX/DdWV2BflHLNlgKLhspmCvbrHqJOUMHYMXykP+HlYjvJWxa7CGIQlyyxKwwSUgFgP/ABgBWVhXNKWFMbsfO4YZSmJJLkA0qamQqpNiFIMXKwzO4tyl3NQJsokaAlKE0cVAir/GJqUqKszgAu5/ypUwUvUoNYhDwSE5WYkkCv8AUuUwAAZ/8yST6bxbPmlecpU5UTkSAxeaJc6WpQ1GcKFriIT8SzrlqYOcooKpV+NLJzUqFKD/AFEQmropKFMU5sqiUAcrTZTkzA7pK05gNhe0IV4yakgKSQHKsoDgtNQFooNpiVDpuHj7FTQpJWSpGcOkupLGYnPf8K34qCxdzYamKMUoo/NlH5gQDX8dAD5wSxWyX0cxFKsuuRycqnKH55ikn8RJ/DUWcOw2DXiBLDxAlkl0vUA8tfxELFVKWhR5zsB1JgDG4kBJA/4ZeUlIS4XKJoXD50muu0BT+IFCmSkVBBGVgqjALl+HQcydn6x9gMGSXULWu1OYAPoxMK2atfWeR2+hRjcHPmHMok6AXYCwc6BxAxwc1N0n3/NI6Bh8GhIcB6UvVg/1TTuIJXg0rcXqczs9ALf7WU26TFTdnUjqJdM5omcRdxBEvFHeN+vg8tdVJGumzOWHUhQ6EwDP+D5aiGdJL+RdmD6BTeShC0P+lkj9mak4r39+sEf4jX3+318ojj+ATJVQXSzsR0JbrZQptCwTSDX21PfaBRPNp0xyMRt73i+XPB6+6096wjRO9/z6Wi5E4dfP9h+v6xCxZEOkzP0/ePaH+dYWSsQd/fvvBCZ9mPl+38PAodTCF4cH379vAs3AgiDJWJo2nun39IklY9n7+X2iBaTM9iuGHQQtm4ZSS9RsY2ikPcftA07AAi0FSozZNWMhLw74hmyqK5h6H+Y1vDePomPlUzhiKv56kUFy1DGZxPCNoUTMKpBcODo0PaZgya0o/Z1rC4oGialj+7AJc7ipI6Qeme9qgFRA1DczACiaPY70jlGA+I5iGC+ZP1/aNbwzjiJg5SO1CaaMS1qVB0gmRwNz/imerjmYu9aKFaDU2Y9C8GDFE3dPeocgEO+/Yd4y+Gxlq/lq+xaijQBiDQHtB0nEWc2yuTStixu/+kjtBTK3E1MrGNanf1p+9qwdKxOnv232jLIxDAAv9qgkO13Y/wBJ7wfKxgavbrQ/M1ddT5wyYtGiC3ppEJkt9IXyMSdd/O7PUuNNNINlz9D6awwDk6MPlUMpAZScrgA/+RBD3rlnKDasNBEnH4JAIJCHzAUf8FQAL7p3fwiPPwz8ywxKHOUi5wrvQ2y+HqOwiFAoSnmUwlggA5mVLVJXcsGUwv11iBLsTMCSVJJVkWpw9BkmiYcxbVKzXrA86YhOYANlIGVszmSoqZKk2/yla6B31is4hkoWc7kIJLK5aGROBH4agS+VxvvaK5MschWWdsxyNUPJmKJVIIoMpLmjh3LQSBE1YRlJKwwYOqihKmOkOVD/APGogAFyCbXMFzMpOUlQQpBLEsMk1Ut0qQpaUsiakEkM1AIGCSnIFsEqYZwMqapXKUQuWosk5RQpBUTWl68ZPICFPlNCCpKUuoiU2WfKOQKP4SrjcXdQBChMwKCKhJyMcxEu0sof8RBytzAlJD05ixYgcTxBStk+Ii1rl2mIYoUalilnivFY1j+HLBeqSSACUsyRMCeVdLWb6xdw7hZp1b61EK2bNfWc3bPOGYAuHvppYOB0FxGowsoWSACDQ6v4017OIpw+DCQ9dGIdq1S79QRDNEklmB3TlrcZkP8A1OFD1hGdrHjUUTlBVciTQPt1Q70bKSnqzRYAxGV7hqcpCRnSAf8ASVCm0eKLP4fMMSzTEtUbEPHwnJBqAwIYkAAMtJDllJ8Mwh3GjvqC0nh2Ba7VFQHS1KB6fhqIt8sRxU4pcK5mBrcghKkg1q5yAs4O0DYucAMhcpCXqa0C0hgXSoM1iDt0GyT8RyoHLUZiNK0T01Y20gMWU0uWBcZ4qjKdSbjfxEdSC7VqN4yOIwcyYSWYP57V9RHSMN8LpHMvmNy9X131ST6QceBoZsuZIv5UJrukg9xC+Rjy3k/ByVWCmJ3/AFsaeoIioKa+v8fwY6ljfhxJJcVp1q+U/wDbKf8AdGb4p8OkEsijP2+Zu7Zh/tiWipKcfsyqV+/fWLkztffmTHmI4YtGhp07j7iBSSCxoYhZHKmMUYjr7v1PsWghM7+OvT+a9qQpSv37/iLkzff8a+fWsQuUxzLxDUf3T3+lIJlT3cU8vL+8I5c6uv6++7/WL0z/AEt027e7QCxTGwILD3p6xROwiTSkUy8T1/by9OvaCUT/AOO/vTrEG4YqxvCHdqQom4JaC4cEbRsgRt79+6xVOw6TBUmijJrQmIsD8RzEUmDMLOKHz9T6xquG8aQtPKsE671u5qb1bvCDF8HBDgNCefw9cs5kv3EOmmc/JrSj1ydTk4wOAkly+4uKijqPMO3SGUnGWFQ7sKC4B5UorcfuI5RgPiOYhkzHIGoLHzGv8RrOGccQsDKQrcPsXqGG7VOsEyOBu8NihpuNmDpsyWAJaxKfvDHC4t9GtUPQGlWFKgeJq7xkcPjH8Llh3LJLiiHFjrm1hpJxgtV6ksQSzguwZIFflPlBsrcTLyllXP8AMoAgVp+JIlqS7EFLrlluofaPioLI5nRMVSmZIM1BmMlKkOGmJd+vcmSZic6QShRQlVspIEmaFXS1fwyASewd6UYhCUqXYKTmYHMHKZqZiHSpBT4Vm5O5i0QqWEkqOVIVMJIUsDKAuWFeIyvzpLDuAwrAy5+RS5yaBSl1FKKSlYBmS+VRfRScqXrtBOJm/h5LAua0QSUzSKTEcpJC2KiKsQIVYucEgKNMoT+RCjyoZKSl0TGKSGO+psA0GT8WhXODkckguhK1KJmZvw5yaLbOCygCegYQhxGLM05ZdRUFTBOa1wnlLZQxbSgEVqmLmkpS+Q1JbKVdVJByveoFYf8AC+CsA3WltMw72MI2b9bVcuWB8K4Xaj/uap+ukaWVgwEginVx/qS/RwRF+GkXAYiuWlHYTEjzD+hgqbKCHYFmLKDtT/MS+1CR5QlnYhBRKhcG40IXvzId+oUPpEpkwAuGy1NQdAJiczIIpX62iMmaaB3YlilyGCkqQOVdmURYtA2JLZqChbMKl/8AMFhlWAeUVsbxB7DJ08XSrlBuLBlElzLYjlXdSdIS4jiLAGoIZlOApgENlULkFNlb7x9isX+UEllEOolrtlUGJDNQ7QmmcFnqWV5jmr2oRYW1iqWSKM2XYUOFyzRcJlCYp5pBuQNCwBBZw1NY2uFUgDlysArX8pCm39d45th04mVRUvMHeg2JDlJoTpXeHGF4yksFKKFWGcGzZXKvES3ypLXpCeaZUsil2blM0WNw9CPyl7XbKSHZosQg1LUG1RShfflI9IzsniLprQ0JZiSSCk8tEireJlNqYIlY4M5KjqbMCUm6lBhbUG3ihrDQ0El3BNwxv/pUa60SryiM7COzX/UkP/3Sf+ZimTjXFSwO9g6L1rcXAb+qsXJxgKiKDM7X1SC7a11Ab6QSciHivAQramp6W70b0VGP4r8MEOQKf3F97f8AEx1acUuWto+xAUKkWqR5xXMwaVA0oOlrHQ/lr5HcwUI4po4RieHKSTRuh0919IFJIvHZeI/D6VC2rb9K/T1H5jGS4t8KkOU1/S3rp7VBsWpR6MQF+/7dvtF4mvc7/aLsbwhSCaM32v77DeF+Yi4iUPHL7dDGXP29/r7MWy8Sb+X0tW8LEzItC/f9+kQtUxunE1f0a2/nf+KwSnEvf3+5Y97WpCNM1vf7frBCZ7Oxrv0rQ6tELFMdImaXcH6XPulD5+mWk0+8LUT/ANz799oLkzaae7jWvrAHtMDxXCUm0J5/DFoOZLgjURqUzIlkCvpBTaKsmCExFgfiKZLYTQSKV/g039Y2XCOOJmABKkm1CxbSoYB2bQnljP4jhaVQNhuEmWsLQopIsxreG8kY56UvZj5ExJQAoh/8ssrOkOypS1ArSpNBlGbRiAxj4zxLQBUOkGqsiiVyLBbmWpyPAWJo7QNMn5Fk51A5nIByeGclQ3lKoTQFkneBcRxIIAdgoBikIymwBCkEFKqg2rX0vZyUrJ4vFhGclTELdQYJmHmJBUkuiYC4L+ghVh8PMnqJNEkkkAMD1azttBPDeFKmkFQypSQyTYVAsdbRqsLgQgBwAC3SnMg1t4mrFbkdXV079Ugbh/DEyx2c6aEOPRUOJKMqdeV6Gh/y1CzCrpVEUAFuVLqKQapcZgUKud0gxJKxWgYipOceLMhWh1SDtQwh1VFRVHuYpG6QWcigyKFfB+RUVJWcwALgZA4ALMVg+FQNhdtfWE+aliXDEFQZNAPw0uM0shmJ1DdICxuIZVSCHOUkuPEqyxzDQsd4jIwmdPSUgliA1fEBRD1otJ7wFLzzCGemruRQmirtSx3jzCYZc9QJcIFibkEKo7VteNbw7hqUpFLN/wDrNe0ZM2xXCMeTP7RAcBwcJBcaV/8AXpDhHDwBZvFp0QfR4NEsAH6f+vpE1sxfqdrp296Rhtt8mNsgrDJD01Vp1BeAuI8LlKDKQNaN1MMJ05nfre3yh9vfkMxxrjbEhDqVqBvW50NbCh2iK74B5V2IeIyFYctLVyG6XpUDUe6WifDuPy1UzALG+7uMlkprSm9oBxmEnzjz8qdhY+f1pAK+ClI8MbYNpcsX/oa6NrIxGUuCKVobM5/8jUJST4Q/LaC5M9LJdRBcWGV2JQrKbqUAoHlYly4jCycXNlkVKmtmr6Egw3wnGkLPMSFEMcxqaCoUX2Fhp1ixM0QzxkbCVi2KNDyizEmqCABzElqgZSdovlYvMpI15QaVN00oT5Fu0Z0YggWAFXamZy4cl1LGZJ9RUQTJnZa6VZ7XCwyPE2UminT1EMmXcGkQtJAAauWmoJGXQvdtHeJmUlSXYPQ+tW/5Aj/dCX/FaAhwFMK5mScwdKTZnuVC8GDEh+UimZspexCx4AzUNjvQUhrBQPxDgstYq30BsC/27MfyiMjxb4OeqB5D22n/AF6GOgSpwO7BzofCro9Mqru0WKkg0JbRzoRy6jsfXrBFaT7OE8Q4KuWbH9Pf8bwuWCm4b37+kdy4lwhCiQzv5tcX7v6dYyPGfhF6oDk7e/dPM2L4uPRz1Ez39O8TC/f37wdxLgS5ZJYjWo96/eFSklPiB9t+49YIVk+QxE2v3+1tfPrBUvEU2NP293hWlUWpVoerefT3pALlIcScT6dPfvaCBiNz5/uPZhKibv78rRdLn9e/vTzfSIWKY8lzwevv94uzj379tCRM7TfbW3lRusFoxH1/bp1p59YBYpAuMxKTLyIHMol0oompKmVKUGS2YDlNCmDuEcEJOdYzFqJDkBwSAH7Qx4TwJEoErVmWKkl7BQBALU/mHMiUlKcwFv6h8iilWoYZVaxa5GTW0lD1T7IDCpSCRfSqauAtNyNoIWacpqQoMMoIzALSKLs4P1vEwtgkipDOxc8istkzPyqBp/MDy8SQQgqcgoGV+blUR4Jorez/AKspvLJmIZyogUUQ7o2WkDOCkm5vqe8UzZory5XWWKhkYfiUaZLcO73Hy9oGmYgswIBLJIAKHcJBdCuVQNA9DCufPIUoJFVGiUuBWlZauUCrH6QG0uxG0lbC8ZjAAkmqmABysuyRyrSGUKUBGsfcK4WqaoKWOUMWo9HNevLBPBODFShMmVJrblF1foI12FwwSGAah+iQP3/iMObP+2Jhy5nLhdFWA4cEgAAUH2R//UMVIYGmps+iLad/31+pUA/m1rYMzn33pFUxfmHLMARUDY7nTv4hGTvszNls2ZQtZ3sSPBe7W9L9IX47iATq5egGZzRsoBFdR5HQsFHxH8QowyMy2KjZISQVG9K0FASf6leePwHxMmbMzTVMRZKqgdEuWL1BLmhi7HglJeXsVTyqP5OhYXBLxNyUj8qSHINeYjcH1obtDSRwOWkBLDpS799T+nnCbhnFAQwUbMHqbkj+kAF9B44dyOIVvStKnKCeYkJYUUM17MIsSS4Mzm2eKwCTZn7a/S9/daJ3CUkE/p71f24hicUCzl3dwKm7EUd9x1B0EW/jJLamvY0ehIsUsQej6tEoFmRxnw2DYf3G3v8AeEHEPhtQFE/T3tHTgzAJNfK7ODejj0JbVormYQEUHXdrDWrOLb7Ug8roZTORImzpBLVFuvkq8MsDxRCgwJCtvDXqzqVci4uLRt8XwNC9HJ6elx3694y3FvhGjpBh1P5NGPO0WDEAjKSAkWcMLZXyJ5iTyl6HvBUvFEip5iU8qqkqIKXCEsCXa7KoIyi0YiQSCCU63fa4Y+sGYLiyVskli3hIy6vXKCVB+pFT3ixM2QzRkavC4wKIDXOpcuUbulIqPmZXUwdJxblOUuD0diUgsSMqQXBo4PQtGblYpiPWwZgrNRAJzMMwZZOvMIIkTlZspuMoyrDlkqYAJ+VOXRbppeGTLTUYafmcblqVuM2gJcEWNegqY9WUqDppfUA2ettz6DaEsrHgEABynKG8RotuYnlRfXMm0G4bEncgEPU/lUxY2oFXGYV+V4awUU4/g6TRhr7pvmHr3jLcY+Eb5Uu/T6bP7vSN5IxAyjoBZjQHKWIBABBvmIs5ePV5VUNNC5Aq7VHcOeijvBFavs4dxD4emSyaED3/AH9doVKSpNwR79+hjumN4QhQoBuPqdKWH/XZoy3FfhFy6UjW2g9j3UwbE8WujmqV1i0L/j7wz4t8Orl1AYefv2ISrQpNxb377waGWT5DETffukXIn+fvfTX6wuRM9+/1ixK4BapHUZ5BJZgapBo3MgKekwUzD+9onipuoKuYEuy8ozS3flWdQTaPPxSlgpRTltVYHLNIfMXBDEh+0CzllIGZmYOopDGiwGmy7W1hjayzEHO5fMa2yrZwmjEBYrr17uFicQQVDNmSSf60GqvEg8yS7ezFU+eQkB3AINS4LMOVaagMmxhfKC56mS4Tqo36sWewhZSUVbKsmRQXJ5MnqmES5dS+rlIenzVFBb+mNFwHgORlrqbursVB/VP2gzg3BBLTQVAOnS/qo+kaASmzNsoOXfwggb+X3152bO5Ol0YJ5HJ2yEiSEpboQwt4Uj6Pf0FYvU1XO9abMAHvXy7G3i1Xo19tQKW/uS1DWKZ02hqzk6hrAa6H6hxo5oKbJTZl6ixoCkioA1bzPQ7PGY+JePJlBkgKmKqAyTfVTWA+7tEfiT4gErlQc0w2HKWfUsO0Y2VIUslaiSS5JO/vSNurqufql1/pi2dpQ4XYJMkKnKK5hzKPl5BrDpFiuEJ1G/a8OZOGp1rWjG37wT+CEvcGu/5h099I66gkjjyztvsRSMLOlf8AjWWFcpqPE1jD3hnxTlITOTlqCCeZDilR1ygVj6Yw2etHH5hZwHt/a0I+KKBc+dfM1B76RXkwxl2WYtiXTOj4TiQYEFxcVpsCyavlcX+YVhhJxuj5erAC5KSRU3B3okVjj/C8XPlH/KPJTlNR6XjZcL4+lQCV8p2OtgQFNekc+eBx6NykbqVjGDPTUuXDkFgCpiUrPqSdIvRiXNw1aBt+cDl3qGoAHrGckY5uYl7uWqXBCnKtwFK7qaDU4o0AAUqgN1VACW2Yp02RFPKGHqp27j+KmvUc3QjUmJTZYO120rsQH2/bpCbD4trPUctnJfMkgJev3Kk2g+XOLvUAile5SHJ0U4/5HaJYSvGcKQtJcD6d/K+0ZHjPwW5JSK3jdScW99a071Y1FDzdiTFh6htrizP+nkRtDL6GUmjjxRiMMWIKkhtwR2Yh/ODMDxNCyNCzFJFqN4RUlm1FhWOj4/hqVghQArtXt6fp5Y/jvwYDzJDHp76wyn8mnHsNFScQ7CjklhQ1V+VCSyeYXBFxQwbKxLlnJdyx5i5GZwE8oLg1BCq1BaMjNTPkFlpzoHd2p1bT6CD8HxNKvCzuHBD60dAFdRU6iLEzbDLGRrpeKu1RzMwCi5SFfLyUY+FlXoYMTjCSwf5mbmDsFFihk3BLCzeGMtLnOwzGjAuzEOwZAvQghyD1hlh8YXSSXqhxRRfwKdFEu7UUxtUwyY5oJWJz2IuwSBmq2ajA6g0uKu1YtmIB+bqHszO1tj/1EIsLiAwZQqEOHJyl8vNYJo3i3uIPw2JYs/hZ2dwxKSSEtTm/Np4qtDWRoliuFpU4yB9afbp+43MZXi3wiljlH0pUWfb9x0jbysUkitWoRmL0dJJZ2oR+jx8pq7uXd2oWIPn9zBEfPZxLifwyuWSRp79+e0JJspSfEPfv7R3vGYBKtAXqzedfTr4T0EZfifwslXhBB/Xb3sdC8GweDXKB8RPYiwJUpmeWpgsO6TyHw2tQ7QuxmLCa2L3bIrqGsqpI8hFWMxuRSgmtwlArVjUg2FVa6wVwvgqlnMup0SLByB+/pCZMqgjXlzKPC7BMDwxc9WYhk3axOtW7j1jZcP4WEdGDdPlB+jwXhMGBYU1tqpmcdANoLSn1IO1yrqb/AFpTeObkyym7ZhlJt2z1YAB/3baqDee30j1cyhFPm13bSxpRrEu7RBUypLiy9RU7AHf1Uxs0DT8R1GrArFXIDWq4BD6jsIrS+iuyyfOYEE0rTMkgO29S4LOdhtXNfEvxF+GCmWXmKG4YObqYbvSB/iP4l/D/AMqWXmEEk/kvU0FSSTc39crhsOSSpRKiXcmpJ1jfq6nl6pLgw7O0oKo9k5UgqUVLJKjUk1JPX6QxRJNQ2hs5pHyMP0/N208otYbjXVN6Nqa/teOwlRw55HJ2TVLIcMQ2a9Q4rtQ+6ROaAHpRybWcjVmb3qHqWpNaAO+qdcrNQMG7WejGLcHgZk8sgUcB6AkkkgUpp2oLNBboSMXIXzpyllkg3rowJo+jWi/CcAUuqrajbenShjX4HgAQHyv03e3qKdwO8NJfDQG1t2L/ALgN3GsUybZqhUejGTOBNpUX/Ufr7eA5/DC/hL/6f0HSvt46BNw+yuzi7Dl9Ry9xrAs3Bi7A22c6jX8tPvtCOJYp8mFw86ZKP5kjQ/odIb4HiyVFsxSacp73Fa+JR84LxvDAHypLFmq7/lfUuHG56CEWN4aQTTSh+2u1OjUiieNMujkNTLxWoLPSha5zUSNiSfLpBKcQqgUAkFwRZgSHFXNFEDdgqMTIx0yXQupPeo7HzhxguKJXVJZWrhiHcHQmx9tGaWJouUjWS8SSl3KrkuKEtzXIunma7BIg2TiHAsSAWAYkkeRJJBZ/zHpGaRiSSDW9qlzQh3oXJSk/6YLkYxjQ0LDrTmSSEjq3+pUV9DGilKsxfZ2YuDlLkVBYjqzm0TSpKgCC7nW9Ry0d7BvIGjtCfD4mmxJ25RUJF60WydaJVaCcNiAa3upTEmhPO7UAzDOejB4lhJ43hCFghgbW/b3rTfHcc+DASVIodG/eNsJhNSX8R5r0qr5uoPdhFwWkhiAOjjZ7ORavS0FOhlJo4+Zk+RyrBUm1HB+hDwwwXEkqGVKrhiLNY1CakOBQ0vSOg4zg6JlCOlO37VjF8Y+Di+aXykVpDqfyasew12XJxHQNzZR4WcBVEJcjmBGorUBoN/xlSlm8ZAagdIVRCTQPqCRU0jHy8TOw5aYkkbihDG5AaGfDeIpLMzEgkOw1dwHU7E66eUWpmuGWMjUJxLOjw+Nh8zEZnyIpltUU3FILk4pqUBL7DlKXDJTmP1I6CsZyXOZnNsr/ACBw6TUc2xcNq4g7CzWGrchNMooSkukVUf6k1vDWWcGhlzbHeoqNQ4+azg+p1i3K9RYjQHUBQH3H+0QoROy5SFNalEuUqKTXxEsb0Ve8XJxYB2Y0cNZW6tb0IB7wbJVmX4RwFlZlVLuSa9R9E/WNHhsPYNs9KPzK0tXqInKl0ZN69yyKsK9df4vytetU3BN0u1TXfbY78iU3Llmds+lS6C1k7UD3d+9fXePH6ntQUKvtvsz2pEOa4H5bAF7l6/r56RTiJpSBcWZwLs48R/quRZ9bChbJT8S1VW1qnU/chLd23pjfib4lKD+DKLzPmU5IR1ZhzG7aP5RX8S/EZB/CkHnspQZkjYMPFQDUcrxn8Jhmrck93L36n1MdLV079Ukc/a21FUj3CYa5Lk3JJue5hqhIDjem2oFdfKvaIoQB0+nzWLsfuzWi2WsMW1FKnVTg8obL06UqAI6yVHDnJy5JswNmY8z0Yqa+TSt/oaRVPmgUodaKP5q1IqCwPmDcR9NnMHe9+dVXJJvdw1exu8Z/ifGWVlRzN4q08ty5PrBboOPG5ukjS8OwhnKD5sgq5+Zi6g7hnBJp1paN7w2QlACUgPUB6sxCktlBqASGGpbcxzr4f+I5bgPkULZhqLVL9PICNtgOJOBlGgFSVOxeWDYOLP8A1EtFLk75NP6XhwaRJSzJ5Q9gPlUQwBoKLp3e14mlSSdgWII0BvY6Kr9oUoxaWuOppqMwokWceVAweDP8YCLl7s35uVfzfm+tLCISy7JcOdXcvR6nyLH94pXIAFWq9QLaE+Rr5m0TRPZiSXcvXUUNjVx9aBhEwdAXD08R/wBNALkOnqRQaxAAmIwxqCGFXAP02YKr2OsLcRw9xQAeQoxrW9D9CLCHyG8NA4peyi4zE3Hyn/7RV+EdjZnJbo3o4P8A9YDRLMXjeFFgR9PT9W9G3hBiuHkVDgjWOlz8K7hjqzgVNm0fYtqHrAOK4U4qKmx6/ufUEaQjgWRyMwmG4rMRRYzCtWdqbQ9wuPSuqVbW8yKAXfL5g7xHHcFv7f3+94z+I4cpCnSWO4/XeKJYky6ORM16ZrVIpq35SADVVSSMpBvzm0G/ju9QVXo5c/M5FGLZuyIxGF4ypHLNTaygAPUNu0P8JjQvmBcHfmsC3Q0DV0UYzSxtFykaTD4xiCCzgMaVYOgkBy2UudyRWDpM9w4JuLOWBPLUkPlVTZyXNIz0rEm2ZjZ+VNXLEs5op/JItBeHmC7cjFmDhjQ1VQZXFf67iFoYeSpoUL0PUEM9Wroqz3rpFy5e5A0bTahd+vXyhKnFkUdquQFXUOQ+GwItUUBLwdIxKnABDuGuA9SguVUzAN0TuYiogLj+DImA0Bp2tQ1tej2tvGK4z8HqQSuW46j1EdH/ABHZykeFhStCw8TdOiWj6hex2tYuNya1H1N4iddDRm0cdGLmyaTEkizgM/dg/sbQ7wfEErGZKh3pelyok+JI7PcRsOI8DlzUktevt9P5pGG4t8MrlHNLJHY+392ixZPk1Y9h+40ViHD75nIZzmGYBSpjBQcG4BpQl4YS5rgsogEqD2SykPlK1ubhiC42MY3D8VVLLTAxFc7PXzBI1tvDSRjnZQ+WoIvQ5gylMBRxyj5bGLEzZDIpdG13bc1rQN66enSKzcFvp/S9td9BrekeOAGob6K6AF9N62pFOJmh7AeLRQ2HlY60rHKKCM+aAGI7uno1yq9X9De2K+I+PnMZMi/zrDMOiW1/eIfE3HysmThywdlrAHmEkd7vCnC4Vm966R1NXV6lNfwc7a2vH0xPsHhQBXXfVzXufWGcpHoWrYeLcsDbVx2jyXLtS+X0JJq7D1J7xakUFGIytVA0NXL166UfSOokcSc7Z8gC9GOX5m1NwkWDWq1xEFzmDj0zK7/t6g3ePP8AEM1S9H5gN1Fti5toe8AT5xVypJegNTqWDMD7MEMIObpFeMnlXIks+rnWj23r5wOjh3YanpYKFt2MMMJhqB6Et6HlVTMGLgHf6mGqJBL0VQOpif8AQvUjY/xcVZ0scFBUjOzeF9BqTYu1Db1iyRKnSfAsgVoXylrsOorSNL/hiaZag81q5AApsw1SoFunYR8jCsG5XBL9Si1jqkkUu3nE8BrKcB8TKFJqWuHBLVrXUB2P+1o0+F4mlXOkgg7ZWZiCA76FwGuoxlMRgxlIISwF9PzJauzp8mDmE2MSuQXQspP00IFyDcdu8I4UI8afR1SRiybcxFaE0y0o2hTQdAah4vl4sgFIbaoAD+JOYv8AlBfowescs4Z8bMcs3/kl2o1w+wbs8a/AcWQsApUFUoQBcl6kmz/QQnJTKDiaeTPdgSCD6gKromhBFdrC8FJxW4byb+lQYJozA9KXMIZGLBsTV6kuQFFxYXCtNSpO0EYfFp3ag+Umlllz+U1fVTWg2JTHaQVaE3e4qGzJYjUB29YiqW+Y0IcaFzTrd017ig1gCXi2J0IqXCflLHpX6mCkTNHD1FWNRawcuHrr0EQhFeFzFn6gvelx3H1esL8ZwlJowrqLWd2ItV29BDgLG1tQWqfCXbQ0ewsI8KahqAt37VNwrS7Gp0iNERheI8CNWG9Lj6ddez3jOzMGuUSUEg/Q+UdUmYYNY+ZvoHpoQ3ozwsx3CUqFi+jg6t9f1F4rcCyORoxOE418s109R4SLEFukPcPi3FC71rWp7lrq/wCogDiXAum1dK/p1hJ/h5skug+WnpGeeFexfHJZt8NiwwFd2e7BgGFiUcp6qgszH72DDK4UXSXJ/MMr7JvGPwPHqst0nuQD5i1QPSHEnEhjsxFA5axuaHKKdzGeUGuy1M0icW9QEqcGjku//kFLBxnPRqwwGJcuQLVdwCw5rl6pZXkkRm5eOJblzKez0zMAQEpahDD/AGmCJeLNLC2QsBZylRfShJ35Q8JYxogQata9A5DO5rcpv1pFU6SC+oHQa1FBRulhrAsufQMoswo5LUcOw+XxHqoQYiezgkjWruLOKqqyiDW5MEBl+MfDKVuQ0Y7F/D82SoqRRvMHyjrdCCCLu9tPEHJ831ciKp2FCnF9N2o+3n263ibRZHI0Z+dPuW1uFK1L7dg/aMJ8RcfMw/gyFctlzBruAanuXir4h+IVzlGXKpLbKpVXV0D6adYDwOEt5WjRq6leqX9Fe1tUqifYPBgMT08q+9oayJNQAHJaoqXqTZqto/nEJUuxfarvvs5B6fSLVAOkgPQaKPy6AsC929I6aRxZzcmTlIcin5bhOr6qNjvrR4oXPIAA/puE0oaMf9VH7R9mIFRt8opy67+IdwQdIBx2Iy6F+w0YGw7OekEEYuTpHmLxJYBNyGGoDW+1PKK8Jh9P31ZQLsaPTz6xDCyC7mpqSWfwGu+h6W7w6w0l6dFJFyKHMm2Y2fT+Ajp48agqLsPLBypzEAsOwXe5HzD9N4JlykgBTu9T/wAssx+U0Zleh2EVyJNxmpa4DJWMyfmFj0byghCicpYMqtnYLGRdcpatXf6kQ455KVkY2ILnqUkhdaEOk6b72IUliWLFPZjlSFJL5n8JIJ0om8RlrKAQSXSXsoEmqVJ8NHQxrYDrFZUQwCwWoMrHwFk0UA/IrlA7mCAqxKsjjMwDC5SSAzXBS+VfkOprieP4x1ZEbB9NBShbQw945jwn/Ll+IgOQClgyfECSCdfrCCXgb6dT9frCPkZcCpErzgnCz5ksgoUUn6HuPpB3+F9/f0NYpXh2ox9PX94HiG0x/wAM+L6ZZwZ/mFu5D+fcCNZg+JJUAUlJF6VuO+gAI6mOWGR/ce/OLMLiZkpWZCmOu3Wn1hHArliT6OyjGPUtmo4GVqcqqalqDq5ghOL2JforVJYMw1TQeZcRznhXxQhVJoyK3+WzeVPvGqk496pUTaxZ6NQjoct4SqKZRa7NJLUasSRTRR/qS32APU1gpE9SnLBmCjcsFHStQC3c1tGfl4h6MC4YABVrp/5VT/pTBsmYC/U0NA+YUNSz0poBWJZXXwNvxyWzOwcm+nKur3Ygv1AEfLZic1Q+jCh5nYaBlM7CrwFh56WYhjy/k1BDAfUDrmMFImUuKNU5flob3BDMNS5rBIV4jDpU9TWpLAee9XB6gnSE+J4SlQI1Zg7EBr1tT0qNofCaz9KaActi+tHD62EQTLCgRt12tq3ho9g28Bol88HPeIcC2D7QoR+LJfLb8pt5R1LE4RKiNR0B1toKka3LQi4lwcF6Au9Q2lbfXYViuUS2ORoQ4HjgPKolB2ej1qD3Uow4kYk/KRWumlRfQEp8hGfx/BiNNr+6/wAwDKxE6TYkp2P6bRnnh+C+M7N7hsaRqCHsSTcnM7MKnmJ1AENJeJL9rGiQco7E1QQz6npGJwHGkrZJorYvWnetAE9odYfFNXNzOK0uLEkmnzDyEUOLRYmaNOIVoSWZjzEN8pFNPC5uTBJnOyqipdh4TmsXNcpI75ozcnGlndh1JNDY0/K/SpEMMPPUQzZdbAcwosV2TY7mECclweFtvT+/sGGMlAcEtpRwNC/iLfQiKZNwNMr+eW8HzEAEMAKJt1SX9Y7iRxck3ZVnbWoAoSWLJ1CR/Ij1Xhs/dKqHLZ+5+xj6fOVycx8I1OhIH0J9YGmXV2/UQRaKsTiGal6AMXf69PrAWEklagVPUgWcDMCnrqBt9opFZynqyUM+nMLQ0wSQXcOyVM+nPpC9nSw41GN+4Xg8MSxZvCbOz8i6HNq12+zsZBDcxfKEkEXeWog05m5emndwZdUl6smez6MXDecF4ZRUWJcZyK1oUsR2oPSHSLS6crK4qLpSQCSWIXLcONHq1qttNOUpqk7lSUksFGhAzV5qDqXO0GiSnJKOUPlw9WGqlP6wDipScpLB/wAOcXaricEg9wKdoKZGj4zRRVwQlRT/AJgFXQoBVaE1JFzQWIhfxjiQTLAPMohLAqC/kQ5YhxVq9GFBFaZqhMSyiOZVi1jT0hLjS85ZNWcB9AwoOlT6xCHuGlUc1Jud/YglEvR6/c6W3H2inBl2evP+io9QouOx+hDQyQjZamV3rbrtp5HeIKlbD6g/3Y/SCykbfn+4ihKiwr7aCAFm4UdvT9dvtAs7C6ftRv2v2MNUad0/cj7R8Neyf/kR9qQGhkzPTsL2+nun2izAcQmyDyHl1Saj08/tDBenZP2VC+ZY+X2MVuI132azhHxLLm0UyF/fsfJvWNFJngjStKNcl6uXbM3kI5JONPf5Y2PwpNUZIdRPcnpFUlRXPGlyblGJFhYgguU2XWu1QXHVIpBEvGEl2o+Ziou5GUj/AFEV3AtCkjXXKv8A+Qi/Oa1Nzr+ZYzeusIiiXA7lYrNYWANz/wDjtRqEh20AqWgtExQLAEaByo9UG1XqAPPrCCVNVmTU1BN9Spie7UguSs/hEuXAJBfV794ehFIcpANaVLO9Bm65LuGKtHYQNMlgsC4Fg/dwGKgCx00BcwKhZypqbb7GkeGcrMoZizS9TquvrEoDmUTsG4bKC9h9K63cOaqo1IRcR4RsN+lG99Ax1jZYkvmerInEPoXFe8CcRDUFBnalKDKQPUn1hGrLE6Ob4vhZrbv/AH9dzEcPjZkoseZOxLkaFjGqnoBSHAsD6qY/SEPEB9/3imUV0y+E7QywXE0zNwR8qiR5MNCw9Ib8MSpSwzizKI1DsdSxLkxhJYr/AMfuY3fAj/lyzqQXO/IbxnnjS5LYyP/Z',
  },
  {
    itemName: 'test1',
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbcXUzN6V3GJ1vJSK_OkapvFZxDhiLnpeWDQ&usqp=CAU',
  },
  {
    itemName: 'test1',
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI45n1AzYHmA7K907w1Z6sB1IyFLipAHfsvw&usqp=CAU',
  },
];

const HomePage = (props) => {
  const isLoading = useSelector((state) => state.appDefaultSettingReducer.isLoading);
  const recentItems = useSelector((state) => state.recentItemReducer.recentItems);
  const cartDetails = useSelector((state) => state.productReducer.myCart);
  const [storeList, setStoreList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trenidngProduct, setTrendingProduct] = useState([]);
  const [searchField, setSearchField] = useState([]);
  const [searchData, setsearchData] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [homeScreenProduct, setHomeScreenProduct] = useState([]);
  const [storeForFilter, setStoreForFilter] = useState([]);
  const [categoryForFilter, setCategoryForFilter] = useState([]);
  const [brandForFilter, setBrandForFilter] = useState([]);
  const [fabricForFilter, setFaricForFilter] = useState([]);
  const [typeForFilter, setTypeForFilter] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    ...defaultFilterObject,
  });
  const setFilter = (value) => {
    setCurrentFilter(value);
  };
  const setFlagForFilter = (value) => {
    setSearchField('');
    setsearchData([]);
    setFilterFlag(value);
  };
  const setDataForFilter = async (value) => {
    await setFilterData(value);
    console.log('filter data---', value);
  };


  const onTextChange = useCallback((value) => {
    setSearchField(value);
    if (value === '') {
      setsearchData([]);
      // setSearchFlag(0);
    }
  });
  const moveToProductDetailPage = (productId, image = null, price = 0, name = '') => {
    props.navigation.navigate('ProductDetail', {
      // productDetails: res,
      productId: productId,
      productImage: image,
      price: price,
      productName: name,
      // productName: res?.name,
    });
    // dispatch(getProductDetail({ inputProductId: productId }))
    //   .then(async (res) => {
    //     if (res) {
    //       props.navigation.navigate('ProductDetail', {
    //         productDetails: res,
    //         productId: productId,
    //         productName: res?.name,
    //       });
    //     } else {
    //       alert('fail to get product data');
    //     }
    //   })
    //   .catch((err) => {
    //     alert('fail to get product data');
    //   });
  };
  const dispatch = useDispatch();

  const initilizePayment = (upiId) => {
    RNUpiPayment.initializePayment(
      {
        vpa: '8980957789@ybl', // or can be john@ybl or mobileNo@upi
        payeeName: 'Mukesh bhargav',
        amount: '1',
        transactionRef: '123456',
      },
      successCallback,
      failureCallback
    );
  };
  const failureCallback = (data) => {
    if (data['Status'] == 'SUCCESS') {
      alert('success');
    } else {
      alert('failed');
    }
  };
  const successCallback = (data) => {
    console.log(data);
    //nothing happened here using Google Pay
  };

  useEffect(() => {
    Linking.openURL('intent://shoppingapp/#Intent;scheme=mukesh;package=com.shoppingproject;S.content=WebContent;end')
    dispatch(getAllCategories()).then(async (res) => {
      if (res) {
        await setCategories(res);
      }
    });
    dispatch(getAllStoresForCustomers()).then(async (res) => {
      if (res) {
        await setStoreList(res);
      }
    });
    dispatch(getTrendingProduct()).then(async (res) => {
      if (res) {
        await setTrendingProduct(res);
      }
    });
    dispatch(getAllBrandList()).then(async (res) => {
      if (res) {
        await setBrandList(res);
      }
    });
    dispatch(getQuickHomeScreenProduct()).then(async (res) => {
      if (res) {
        await setHomeScreenProduct(res);
      }
    });
  }, []);
  const searchText = useCallback((value) => {
    if (searchField.length > 0) {
      Keyboard.dismiss();
      if (searchField !== null) {
        let obj = {
          inputSearch: searchField,
        };
        dispatch(searchProduct(obj)).then(async (res) => {
          if (res.length === 0) {
            setSearchField('');
            await setsearchData([]);
            alert('No product found with this search!')
            // Alert.alert(
            //   '',
            //   'No product found with this search!',
            //   [
            //     {
            //       text: 'Okay',
            //       onPress: async () => {
            //         setSearchField('');
            //         await setsearchData([]);
            //         // dispatch(setSearchData([]));
            //       },
            //     },
            //   ],
            //   {
            //     cancelable: false,
            //   }
            // );
          } else {
            await setsearchData(res);
          }
        });
      }
    }
  });
  const renderTrendingProduct = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // initilizePayment("ds")
            moveToProductDetailPage(item?.product, item?.image, item?.price, item?.name);
          }}
        >
          <Image
            resizeMode={'contain'}
            style={style.trendingProductImage}
            source={{ uri: item?.image }}
          />
          {/*<FastImage*/}
          {/*  style={style.trendingProductImage}*/}
          {/*  resizeMode={FastImage.resizeMode.contain}*/}
          {/*  source={{*/}
          {/*    uri: item?.image,*/}
          {/*    headers: { Authorization: '9876543210' },*/}
          {/*    priority: FastImage.priority.normal,*/}
          {/*    cache: FastImage.cacheControl.immutable,*/}
          {/*  }}*/}
          {/*/>*/}
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
        >
          {item?.price}
        </Text>
      </View>
    );
  };

  const renderBrands = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainViewForRound}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(getBrandWiseProduct({ inputBrand: item?._id })).then((res) => {
              if (res) {
                if (res.length > 0) {
                  props.navigation.navigate('ProductListisng', { data: res });
                } else {
                  alert('No product found for this brand');
                }
              }
            });
          }}
        >
          <View style={style.roundImageView}>
            <View
              style={[
                style.categoryImageStyle,
                { backgroundColor: color.lightPink, padding: hp(2) },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  style.bottomTextStyle,
                  {
                    fontWeight: '700',
                    fontSize: normalize(10),
                    width: wp(30),
                    textAlign: 'center',
                  },
                ]}
              >
                {item?.brandName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const renderRecentProduct = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={{ flex: 1, marginTop: hp(1) }}>
        <TouchableWithoutFeedback
          onPress={async () => {
            moveToProductDetailPage(item?.product);
          }}
        >
          <View
            style={{
              height: hp(26),
              width: recentItems.length < 2 ? wp(45) : wp(32),
              borderRadius: hp(1),
              marginLeft: wp(1),
              alignItems: 'center',
            }}
          >
            <Image
              style={[style.recentItemImage, { width: recentItems.length < 2 ? wp(45) : wp(32) }]}
              source={{ uri: item?.image }}
            />
            <Text numberOfLines={1} style={style.bottomTextStyle}>
              {item?.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const renderAdvertisments = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainViewForAdd}>
        <Image style={style.advertisementImage} source={{ uri: item.imgUrl }} />
        {/*<FastImage*/}
        {/*  style={style.advertisementImage}*/}
        {/*  resizeMode={FastImage.resizeMode.cover}*/}
        {/*  source={{*/}
        {/*    uri: item?.imgUrl,*/}
        {/*    headers: { Authorization: '9876543210' },*/}
        {/*    priority: FastImage.priority.normal,*/}
        {/*    cache: FastImage.cacheControl.immutable,*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    );
  };
  const renderCategories = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainViewForRound}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            getProductByCategory(item?._id);
          }}
        >
          <View style={style.roundImageView}>
            <Image style={style.categoryImageStyle} source={{ uri: item.image }} />
            {/*<FastImage*/}
            {/*  style={style.categoryImageStyle}*/}
            {/*  resizeMode={FastImage.resizeMode.contain}*/}
            {/*  source={{*/}
            {/*    uri: item?.image,*/}
            {/*    headers: { Authorization: '9876543210' },*/}
            {/*    priority: FastImage.priority.normal,*/}
            {/*    cache: FastImage.cacheControl.immutable,*/}
            {/*  }}*/}
            {/*/>*/}
          </View>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(25), textAlign: 'center' }]}
        >
          {item?.name}
        </Text>
      </View>
    );
  };
  const renderHomeScreenProducts = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={[style.mainView]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            moveToProductDetailPage(item?.product, item?.image, item?.price, item?.name);
          }}
        >
          <Image
            resizeMode={'contain'}
            style={style.trendingProductImage}
            source={{ uri: item?.image }}
          />
          {/*<FastImage*/}
          {/*  style={style.trendingProductImage}*/}
          {/*  resizeMode={FastImage.resizeMode.contain}*/}
          {/*  source={{*/}
          {/*    uri: item?.image,*/}
          {/*    headers: { Authorization: '9876543210' },*/}
          {/*    priority: FastImage.priority.normal,*/}
          {/*    cache: FastImage.cacheControl.immutable,*/}
          {/*  }}*/}
          {/*/>*/}
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
        >
          {item?.price}
        </Text>
      </View>
    );
  };

  const renderSearchProduct = ({ item, index }) => {
    return (
      <View key={Math.random() + 'MK'} style={style.mainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            moveToProductDetailPage(item?.product, item?.image, item?.price, item?.name);
          }}
        >
          <Image
            resizeMode={'contain'}
            style={style.trendingProductImage}
            source={{ uri: item?.image }}
          />
          {/*<FastImage*/}
          {/*  style={style.trendingProductImage}*/}
          {/*  resizeMode={FastImage.resizeMode.contain}*/}
          {/*  source={{*/}
          {/*    uri: item?.image,*/}
          {/*    headers: { Authorization: '9876543210' },*/}
          {/*    priority: FastImage.priority.normal,*/}
          {/*    cache: FastImage.cacheControl.immutable,*/}
          {/*  }}*/}
          {/*/>*/}
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
        >
          {item?.price}
        </Text>
      </View>
    );
  };
  const renderFilterProduct = ({ item, index }) => {
    return (
      <View key={Math.random() + 'MK'} style={style.mainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            moveToProductDetailPage(item?.product);
          }}
        >
          <Image style={style.trendingProductImage} source={{ uri: item?.image }} />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
        >
          {item?.price}
        </Text>
      </View>
    );
  };
  const renderStoreList = ({ item, index }) => {
    return (
      <View key={Math.random() + 'DE'} style={style.mainViewForRound}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            getProductByShop(item?._id);
          }}
        >
          <View style={style.roundImageView}>
            <Image style={style.categoryImageStyle} source={{ uri: item.storeImage }} />
            {/*<FastImage*/}
            {/*  style={style.categoryImageStyle}*/}
            {/*  resizeMode={FastImage.resizeMode.contain}*/}
            {/*  source={{*/}
            {/*    uri: item.storeImage,*/}
            {/*    headers: { Authorization: '9876543210' },*/}
            {/*    priority: FastImage.priority.normal,*/}
            {/*    cache: FastImage.cacheControl.immutable,*/}
            {/*  }}*/}
            {/*/>*/}
          </View>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[style.bottomTextStyle, { width: wp(25), textAlign: 'center' }]}
        >
          {item?.companyName}
        </Text>
      </View>
    );
  };
  const getProductByCategory = (categoryId) => {
    dispatch(getCategoryWiseProduct({ inputCategoury: categoryId })).then((res) => {
      if (res) {
        props.navigation.navigate('ProductListisng', { data: res });
      }
    });
  };
  const getProductByShop = (shopId) => {
    dispatch(getShopWiseProduct({ inputStoreId: shopId })).then((res) => {
      if (res) {
        if (res.length === 0) {
          alert('No product till now found from this shop...');
        } else {
          props.navigation.navigate('ProductListisng', { data: res });
        }
        // props.navigation.navigate('ProductListisng',{data:res})
      }
    });
  };
  const goToFilterScreen = () => {
    if (typeForFilter.length === 0 || fabricForFilter.length === 0) {
      dispatch(getAutoCompleteData())
        .then(async (res) => {
          if (res) {
            setTypeForFilter(res?.type);
            setFaricForFilter(res?.fabric);
            props.navigation.navigate('FilterScreen', {
              categories: categories,
              stores: storeList,
              brandList: brandList,
              types: res?.type,
              fabric: res?.fabric,
              currentFilter: currentFilter,
              setFilter: setFilter,
              setFlagForFilter: setFlagForFilter,
              setDataForFilter: setDataForFilter,
            });
          } else {
            props.navigation.navigate('FilterScreen', {
              categories: categories,
              stores: storeList,
              brandList: brandList,
              types: [],
              fabric: [],
            });
          }
        })
        .catch((err) => {
          props.navigation.navigate('FilterScreen', {
            categories: categories,
            stores: storeList,
            brandList: brandList,
            types: [],
            fabric: [],
          });
        });
    } else {
      props.navigation.navigate('FilterScreen', {
        categories: categories,
        stores: storeList,
        brandList: brandList,
        types: typeForFilter,
        fabric: fabricForFilter,
        currentFilter: currentFilter,
        setFilter: setFilter,
        setFlagForFilter: setFlagForFilter,
        setDataForFilter: setDataForFilter,
      });
    }
  };
  return (
    <GradientBackground>
      <AppHeader
        title={'Home'}
        onMenuPress={() => {
          props.navigation.openDrawer();
        }}
        cartItemCount={cartDetails.length}
        onCartIconPress={() => {
          props.navigation.navigate('CartDetail');
        }}
        onFilterIconPress={() => {
          goToFilterScreen();
        }}
      />

      <View style={style.searchTextinput}>
        <TextInput
          allowFontScaling={false}
          style={[style.searchContainer, { justifyContent: 'center' }]}
          placeholder={'Search Product Here ...' + ' '}
          placeholderTextColor={color.black}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          value={searchField}
          onChangeText={onTextChange}
          onSubmitEditing={searchText}
        />
        {searchField.length > 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setSearchField('');
            }}
          >
            <Image
              source={cross_black_icon}
              style={{ marginRight: wp(5), alignSelf: 'center', height: hp(1.5), width: hp(1.5) }}
            />
          </TouchableWithoutFeedback>
        )}
        {searchField.length > 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              searchText();
            }}
          >
            <Image
              source={search_icon}
              style={{ alignSelf: 'center', height: hp(2), width: hp(2) }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
      {searchField !== '' && searchData.length > 0 ? (
        <View>
          <Text style={style.listTitleText}>Search Result</Text>
          <ScrollView>
            <FlatList
              numColumns={4}
              horizontal={false}
              data={searchData}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={true}
              renderItem={renderSearchProduct}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ height: hp(25) }} />
          </ScrollView>
        </View>
      ) : filterData.length > 0 ? (
        <View>
          <Text style={style.listTitleText}>Filter Result</Text>
          <AppButton
            onPress={async () => {
              setFilterData([]);
              setCurrentFilter({ ...defaultFilterObject });
            }}
            customBtnText={{ fontSize: normalize(13) }}
            containerStyle={{
              width: wp(20),
              marginTop: hp(1),
              borderRadius: hp(1),
              height: hp(4),
              backgroundColor: 'red',
            }}
            title={'REMOVE FILTER'}
          />
          <ScrollView>
            <FlatList
              numColumns={3}
              horizontal={false}
              data={filterData}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={true}
              renderItem={renderSearchProduct}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ height: hp(35) }} />
          </ScrollView>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {trenidngProduct.length > 0 && (
            <View>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Trending Product</Text>
                <View style={style.listTitleDividerView} />
              </View>
              <FlatList
                numColumns={1}
                horizontal={true}
                data={trenidngProduct}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderTrendingProduct}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {homeScreenProduct.length > 0 && (
            <View style={{ marginTop: hp(0) }}>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Quick Buy</Text>
                <View style={style.listTitleDividerView} />
              </View>
              <FlatList
                numColumns={1}
                horizontal={true}
                data={
                  homeScreenProduct.length > 10 ? homeScreenProduct.slice(0, 10) : homeScreenProduct
                }
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderHomeScreenProducts}
                keyExtractor={(item, index) => index.toString()}
              />
              <Text
                onPress={() => {
                  if (homeScreenProduct.length > 0) {
                    props.navigation.navigate('ProductListisng', { data: homeScreenProduct });
                  }
                }}
                style={[
                  style.listTitleText,
                  { alignSelf: 'flex-end', marginRight: wp(2), marginTop: hp(1) },
                ]}
              >
                See all
              </Text>
            </View>
          )}

          {dummyAdvertisment.length > 0 && (
            <View>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Advertisment's</Text>
                <View style={style.listTitleDividerView} />
              </View>
              <FlatList
                numColumns={1}
                horizontal={true}
                data={dummyAdvertisment}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderAdvertisments}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {recentItems.length > 0 && (
            <View>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Recent Items</Text>
                <View style={style.listTitleDividerView} />
              </View>
              <FlatList
                numColumns={1}
                horizontal={true}
                data={recentItems}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderTrendingProduct}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {categories.length > 0 && (
            <View>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Categories</Text>
                <View style={style.listTitleDividerView} />
              </View>

              <FlatList
                numColumns={4}
                // data={[...data.imgPath, ...data.docPath]}
                horizontal={false}
                data={categories}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderCategories}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {storeList.length > 0 && (
            <View>
              <View style={style.listTitleView}>
                <View style={style.listTitleDividerView} />
                <Text style={style.listTitleText}>Stores</Text>
                <View style={style.listTitleDividerView} />
              </View>
              <FlatList
                numColumns={4}
                // data={[...data.imgPath, ...data.docPath]}
                horizontal={false}
                data={storeList}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderStoreList}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}

          <View>
            <View style={style.listTitleView}>
              <View style={style.listTitleDividerView} />
              <Text style={style.listTitleText}>Brands</Text>
              <View style={style.listTitleDividerView} />
            </View>
            <FlatList
              numColumns={4}
              // data={[...data.imgPath, ...data.docPath]}
              horizontal={false}
              data={brandList}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={true}
              renderItem={renderBrands}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

        </ScrollView>

      )}
      <View style={{ height: hp(5) }} />
      {isLoading && <Loading isLoading={isLoading} />}
    </GradientBackground>
  );
};
const style = StyleSheet.create({
  trendingProductImage: {
    height: (IsIOSOS || IsAndroidOS)?hp(23):hp(25),
    width: (IsIOSOS || IsAndroidOS)?wp(26):wp(15),
    borderRadius: hp(2),
  },
  recentItemImage: {
    height: hp(20),
    width: wp(32),
    borderRadius: hp(1),
  },
  roundImageView: {
    height: hp(14),
    width: hp(14),
    borderRadius: hp(7),
    backgroundColor: color.white,
    shadowOffset: { height: 2, width: 2 },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: color.black,
  },
  categoryImageStyle: {
    height: hp(14),
    width: hp(14),
    borderRadius: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  advertisementImage: {
    height: hp(30),
    width: wp(50),
    borderRadius: hp(1),
    // marginLeft:wp(1)
  },
  searchTextinput: {
    flexDirection: 'row',
    marginHorizontal: wp(3),
    marginVertical: hp(1),
    paddingHorizontal: hp(2),
    backgroundColor: color.creamGray,
    borderRadius: wp(2),
    ...shadowStyle,
    elevation: 10,
  },
  subText: {
    fontSize: normalize(12),
  },
  common: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontStyle: {
    color: color.blue,
    fontSize: normalize(13),
    // fontFamily: font.robotoRegular,
    marginLeft: wp(2),
    fontWeight: 'bold',
  },
  mainView: {
    flex: 1,
    width:(IsIOSOS || IsAndroidOS)?wp(35):wp(20),
    marginTop: hp(2),
    marginLeft: wp(3),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
  mainViewForAdd: {
    flex: 1,
    marginTop: hp(2),
    marginLeft: wp(3),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: hp(2),
    paddingTop: hp(1),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    paddingBottom: hp(1),
  },
  birthdayView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  searchContainer: {
    fontSize: normalize(14),
    marginLeft: wp(2),
    paddingVertical: hp(1.5),
    flex: 1,
    color: color.black,
  },
  rowBack: {
    marginBottom: hp(1),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2.5),
    backgroundColor: color.themePurple,
    borderRadius: wp(2),
  },
  iconStyle: {
    width: wp(4.0),
    height: wp(4.0),
  },
  sortLabel: {
    fontSize: normalize(15),
    color: '#414141',
    fontWeight: 'bold',
  },
  sortListItem: {
    fontSize: normalize(16),
    // fontWeight: 'bold',
    color: color.blue,
  },
  sortViewHeader: {
    height: hp(5.5),
    backgroundColor: color.blue,
  },
  sortViewHeaderText: {
    fontWeight: 'bold',
    fontSize: normalize(15),
    color: color.white,
    // color: color.white,
  },
  sortViewButton: {
    height: hp(4),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: hp(0.5),
  },
  sortButtonText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  sortMainView: {
    flex: 1,
    marginTop: hp(1),
    flexDirection: 'row',
    padding: hp(0.5),
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dividerView: {
    height: hp(0.05),
    backgroundColor: color.gray,
    width: wp(75),
    alignSelf: 'center',
  },
  sortModalMainView: {
    flex: 0,
    width: wp(84),
    backgroundColor: color.white,
  },
  sortModalTopRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: wp(10),
  },
  mainViewForRound: {
    // shadowOffset: { height: 2, width: 2 },
    // shadowRadius: 20,
    // shadowOpacity: 1,
    // elevation: 3,
    // shadowColor: color.black,
    flex: 1,
    marginTop: hp(3),
    marginLeft: wp(2),
    alignItems: 'center',
  },

  listTitleDividerView: { height: hp(0.1), width: wp(26), backgroundColor: color.lightGray },
  listTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  listTitleText: {
    fontSize: normalize(16),
    fontWeight: '700',
    textAlign: 'center',
    color: color.themeBtnColor,
  },
  bottomTextStyle: {
    marginTop: hp(1),
    fontSize: normalize(12),
    fontWeight: '700',
    color: color.themeBtnColor,
  },
  sortModalBottomRow: { height: hp(10), alignItems: 'center', justifyContent: 'center' },
});

export default HomePage;
