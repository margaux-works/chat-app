// Import necessary components for navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the two main screens of the app: Start and Chat
import Start from './components/Start';
import Chat from './components/Chat';

// Create a stack navigator instance, which will handle the navigation between screens
const Stack = createNativeStackNavigator();

// The main App component that sets up navigation between the Start and Chat screens
const App = () => {
  return (
    // NavigationContainer manages the navigation tree and enables screen navigation
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
