<template>
  <button @click="loginUser">
    login
  </button>
  {{ user }}
  <button @click="logOut">
    logout
  </button>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCW-jF6td4a4XysMmkP4HzPIQah_t6c5Uc',
  authDomain: 'shineve-2048.firebaseapp.com',
  projectId: 'shineve-2048',
  storageBucket: 'shineve-2048.appspot.com',
  messagingSenderId: '647881691622',
  appId: '1:647881691622:web:a4ffff26dac052d2f04627',
  measurementId: 'G-4F479PRF6Q',
};

export default {
  setup() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const user = reactive('not logged in');

    const loginUser = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          user.value = result.user;
          console.log('🚀 ~ file: Welcome.vue ~ line 43 ~ loginUser ~ user', user);
          // ...
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

    return {
      loginUser,
      user,
    };
  },
};
</script>
