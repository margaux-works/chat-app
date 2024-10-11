import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  // Extracting 'name' and 'background' passed from the previous screen via route parameters
  const { name, background } = route.params;

  // State to store the messages in the chat
  const [messages, setMessages] = useState([]);

  // Function that appends new messages to the chat
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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

  // Initialize the chat with some default messages when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  return (
    // Main container for the chat screen, applies dynamic background color from props
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* GiftedChat component that handles the chat interface */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
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
