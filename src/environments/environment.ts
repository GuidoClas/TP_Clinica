// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDpnlSiL1j_kPXhKzMGAO8fH2-MmCToRN8",
    authDomain: "tp-clinic.firebaseapp.com",
    projectId: "tp-clinic",
    storageBucket: "tp-clinic.appspot.com",
    messagingSenderId: "413064768407",
    appId: "1:413064768407:web:11fa693a6d3e4ab67772d2"
  },
  recaptcha: {
    siteKey: '6LfcW4wiAAAAANEDkIHUW0xG8VYTs8jSLidrIGw_'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
