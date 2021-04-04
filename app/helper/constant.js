export const ALL = 'ALL';
export const EVENT = 'EVENT';
export const HEAD = 'HEAD';
export const NORMAL = 'NORMAL';
export const GENDER = {
  male: 'male',
  female: 'female',
};
// export const THEME_COLOR = ['#f7f7f7', '#F5E4EA', '#b16f89'];
export const THEME_COLOR = ['#f8f8f8', '#f8f8f8', '#f8f8f8'];
export const USER_ADMIN = 'Admin';
export const USER_MERCHANT = 'Merchant';
export const USER_NORMAL = 'Customer';
export const RAZOR_PAY_KEY = 'rzp_live_t67U0BoWeFiPpO';
export const RAZOR_PAY_SECRET_KEY = '7lIb1BrxQvhZ6rJEFoZfEYMQ';
export const defaultFilterObject = {
  stores: [],
  brandList: [],
  categories: [],
  colorArray: [],
  foundResult: 0,
  MaxPrice: 10000,
  MinPrice: 0,
  types: [],
  fabric: [],
};
export const colorArray = [
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
export const NOTIFICATION_TYPE = {
  storeRequest: 'storeRequest',
  storeResponse: 'storeResponse',
};
