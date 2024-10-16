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

const Chat = ({ route, navigation, db, isConnected }) => {
  // Extracting 'name' and 'background' passed from the previous screen via route parameters
  const { name, backgroundColor, userID } = route.params;

  // State to store the messages in the chat
  const [messages, setMessages] = useState([]);

  // Function that sends new messages and saves them to Firebase Firestor
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

  // Set the title of the chat screen to the user's name when the component mounts
  useEffect(() => {
    navigation.setOptions({ title: name });
  });

  let unsubMessages;

  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (DocumentSnapshot) => {
        let newMessages = [];
        DocumentSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()), // Convert Firestore timestamp to JavaScript Date object
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Fetch messages from Firebase Firestore and listen for real-time updates
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc')); // Query messages from Firestore, ordered by creation date in descending order
    const unsubMessages = onSnapshot(q, (DocumentSnapshot) => {
      // Listens for real-time updates from Firestore
      let newMessages = [];
      DocumentSnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()), // Convert Firestore timestamp to JavaScript Date object
        });
        setMessages(newMessages); // Updates the local state with the fetched messages from Firestore
      });
      return () => {
        if (unsubMessages) unsubMessages(); // Cleanup function to unsubscribe from Firestore updates when the component unmounts
      };
    });
  }, []);

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
