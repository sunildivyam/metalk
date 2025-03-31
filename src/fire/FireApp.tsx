// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "globaldew-tech.firebaseapp.com",
  projectId: "globaldew-tech",
  storageBucket: "globaldew-tech.firebasestorage.app",
  messagingSenderId: "616224005043",
  appId: "1:616224005043:web:eb1e64613b8f63847c09c6",
  measurementId: "G-80PHLC090Z"
};

initializeApp(firebaseConfig, 'meribaat')

export const getFireApp = () => {
  const app = getApp('meribaat');
  return app || initializeApp(firebaseConfig, 'meribaat')
}

export const getFireAnalytics = () => {
  const app = getFireApp();
  return getAnalytics(app);
}

export const initializeAppCheckToken = () => {
  const app = getFireApp();
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('2F6FDB93-D74E-48E2-A1E7-155E47B4ABEB'),
    isTokenAutoRefreshEnabled: true
  });
};

initializeAppCheckToken();
