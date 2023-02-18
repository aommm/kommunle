// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { HighscoreEntry, Score } from "./score";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDZGEBG5PHxhNLNAP5_9CxP_IypUaUAb9s",

  authDomain: "kommunle.firebaseapp.com",

  projectId: "kommunle",

  storageBucket: "kommunle.appspot.com",

  messagingSenderId: "477451683649",

  appId: "1:477451683649:web:cb82af2b03cbf2fd5b03c0",

  databaseURL:
    "https://kommunle-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
