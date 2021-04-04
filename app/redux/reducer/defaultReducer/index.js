import {user} from './user';
import {DirectoryDetails} from './dashboardReducer'
import {EventReducer} from './eventReducer'
import {AppDefaultSettings} from './appReducer'
import {NotificationDefault} from './notificationReducer'
import {ShopReducer} from './shopReducer'
import {RecentItems} from './recentItems'
import {ProductReducer} from './productReducer'
export const appDefaultReducer = {
   user,
   DirectoryDetails,
   AppDefaultSettings,
   NotificationDefault,
   EventReducer,
   ShopReducer,
   RecentItems,
   ProductReducer
};
