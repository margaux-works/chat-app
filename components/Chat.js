import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import {
  orderBy,
  onSnapshot,
  addDoc,
  collection,
  query,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  // Destructure parameters passed via route from the previous screen (name, backgroundColor, userID)
  const { name, backgroundColor, userID } = route.params;

  //  State to store messages fetched from Firestore or local storage (offline mode)
  const [messages, setMessages] = useState([]);

  let unsubMessages; // Variable to store the listener that will be used to unsubscribe from Firestore messages

  useEffect(() => {
    // Set the navigation bar title to the user's name when they enter the chat screen
    navigation.setOptions({ title: name });

    // If user is connected to the internet, set up Firestore listener to fetch new messages
    if (isConnected === true) {
      if (unsubMessages) unsubMessages(); // Cleanup any previous listener
      unsubMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

      // Set up a real-time listener to Firestore that updates messages whenever the database changes
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()), // Convert Firestore timestamp to JavaScript Date object
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    }
    // If offline, load cached messages from AsyncStorage
    else loadMessages();

    // Cleanup function to unsubscribe from Firestore when the component unmounts or connection status changes
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  //  Load cached messages from AsyncStorage when offline
  const loadMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Save messages to AsyncStorage for offline access
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle sending new messages, which saves them to Firestore
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]); // Adds the first new message to the Firestore 'messages' collection
  };

  // Customizing the appearance of the chat bubbles for both sides (user and other)
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#fff',
          },
        }}
      />
    );
  };

  // Render custom action buttons (e.g., image picker, location sharing)
  const renderCustomActions = (props) => {
    return (
      <CustomActions
        storage={storage}
        userID={userID}
        onSend={onSend}
        {...props}
      />
    );
  };

  // Render custom view for showing map location if a message contains a location object
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
  };

  return (
    // Main container for the chat screen, applies dynamic background color from props
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* GiftedChat component that handles the chat interface */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        // Conditionally render the InputToolbar based on the connection status
        renderInputToolbar={(props) => {
          if (!isConnected) {
            return null;
          }
          return <InputToolbar {...props} />;
        }}
      />

      {/* Handling keyboard behavior for Android, shifting view height to accommodate the keyboard */}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {/* Handling keyboard behavior for iOS, adjusting padding to prevent the keyboard from covering input */}
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

// Styles for the chat screen container
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
