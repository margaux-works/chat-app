import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { useState } from 'react';

const Start = ({ navigation }) => {
  // useState hook to manage the user's name input
  const [name, setName] = useState('');
  // Predefined array of colors for the user to choose as the chat background
  const colors = ['#313cb5', '#b52721', '#faca82', '#9cd9f0'];
  // useState hook to manage the selected background color
  const [background, setBackground] = useState('');

  return (
    // Main container that holds all elements and applies styles to center them on the screen
    <View style={styles.container}>
      {/* Image background for the screen's backdrop */}
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.imgBackground}
      >
        {/* App title displayed at the top of the screen */}
        <Text style={styles.title}>MyGram</Text>
        {/* Container for the input field, color options, and the button */}
        <View style={styles.boxContainer}>
          {/* Input field for the user to enter their name */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
          {/* Text label for the color selection section */}
          <Text style={styles.textBgColor}>Choose Background Color:</Text>
          {/* Row of color options for the user to choose as the background color */}
          <View style={styles.containerBgBox}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                accessible={true}
                accessbilityRole="button"
                accessibilityHint="Choose a background color for the chat screen"
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  background === color && styles.selectedColor,
                ]}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>
          {/* Button that navigates to the Chat screen, passing the user's name and background color */}
          <TouchableOpacity
            style={styles.button}
            title="Start Chatting"
            onPress={() =>
              navigation.navigate('Chat', {
                name: name,
                background: background,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

// Stylesheet to define the visual appearance of components in the Start screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
    margin: 25,
  },
  boxContainer: {
    backgroundColor: 'white',
    width: '88%',
    height: '44%',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: '10%', // pushes it closer to the bottom
  },
  textInput: {
    width: '88%',
    borderColor: '#757083',
    borderRadius: 4,
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    opacity: 50,
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
  },
  textBgColor: {
    fontSize: 16,
    color: '#757083',
    fontWeight: '400',
    opacity: 100,
  },
  containerBgBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
  selectedColor: {
    borderColor: '#757083',
    borderWidth: 4,
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    marginBottom: 15,
    width: '88%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Start;
