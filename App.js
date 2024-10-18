// Import necessary components for navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the two main screens of the app: Start and Chat
import Start from './components/Start';
import Chat from './components/Chat';

// Import Firebase modules to initialize the app and Firestore database
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';

// Create a stack navigator instance, which will handle the navigation between screens
const Stack = createNativeStackNavigator();

// The main App component that sets up navigation between the Start and Chat screens
const App = () => {
  // Firebase configuration object containing the app's Firebase keys and identifiers
  const firebaseConfig = {
    apiKey: 'AIzaSyDtlJAiz9mJ2Vswo1fho9zWvxqszSDKyZM',
    authDomain: 'chat-app-8486e.firebaseapp.com',
    projectId: 'chat-app-8486e',
    storageBucket: 'chat-app-8486e.appspot.com',
    messagingSenderId: '641939315088',
    appId: '1:641939315088:web:b5e17f78b040208a507b15',
  };

  // Initialize Firebase with the provided configuration
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  // Use NetInfo hook to monitor network connection status (online/offline)
  const connectionStatus = useNetInfo();

  // useEffect hook to handle network status changes
  // If the user is offline, disable Firestore's network access
  // If the user is online, re-enable Firestore's network access
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    // NavigationContainer manages the navigation tree and enables screen navigation
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
