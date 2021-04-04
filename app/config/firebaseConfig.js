import * as firebase from 'firebase';
// export const config = {
//   apiKey: 'AAAAabs4E00:APA91bE8VTWhsfoy4xg7bcvqlBQUF_SoVB9G8UlWGqXSRf4kVPoqM3dP8GZ3QFK2BVJOA6DxHug2UHpPgeQ0hWn4t1cgQ9aO_kyRb5FbsCwVuDLTxP577Dv_-sVK4Py2NU_MxE6mMoXK',
//   authDomain: 'votingappproject-7cf3e.firebaseapp.com',
//   databaseURL: 'https://votingappproject-7cf3e.firebaseio.com',
//   projectId: 'votingappproject-7cf3e',
//   storageBucket: 'votingappproject-7cf3e.appspot.com',
//   messagingSenderId: '454112580429',
// };
export const config = {
  apiKey: 'AAAAOrthHMg:APA91bFXZye_5CwF_OBbsnLiKBfZ5usDObI1vRb2sGH1q6LKgGvDtXA_KexBtYcsqj6X-mwcqIYlCDmXe3ATOWa2IxtzQj81QFEjmWTo6OF8jab_ONd3IMmlkvtHjSKw2XNluKsLZuB0',
  authDomain: 'marothiatextile-88b17.firebaseapp.com',
  databaseURL: 'https://marothiatextile-88b17.firebaseio.com',
  projectId: 'marothiatextile-88b17',
  storageBucket: 'marothiatextile-88b17.appspot.com',
  messagingSenderId: '252251806920',
};

const fire = firebase.initializeApp(config);
export default config;
