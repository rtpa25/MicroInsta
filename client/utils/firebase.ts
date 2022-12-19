import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBHtbX9VQiW9tEfJ3uIJiDKnDaU2lNchuc',
    authDomain: 'microinsta-2d29d.firebaseapp.com',
    projectId: 'microinsta-2d29d',
    storageBucket: 'microinsta-2d29d.appspot.com',
    messagingSenderId: '748834446808',
    appId: '1:748834446808:web:4ac779fbf7cfa07048a6ad',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
