// Import necessary components for navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the two main screens of the app: Start and Chat
import Start from './components/Start';
import Chat from './components/Chat';

// Import Firebase modules to initialize the app and Firestore database
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

  return (
    // NavigationContainer manages the navigation tree and enables screen navigation
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
