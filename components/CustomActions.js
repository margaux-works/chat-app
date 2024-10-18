import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// CustomActions component responsible for displaying options to send images or location
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  userID,
  storage,
}) => {
  const actionSheet = useActionSheet(); // Hook to display an action sheet

  // Function to handle the selection of different options from the action sheet
  const onActionPress = () => {
    const options = [
      'Choose from Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1; // Index of the cancel button

    // Displaying the action sheet with options
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            pickImage();
            return;
          case 1:
            console.log('user wants to take a photo');
            takePhoto();
            return;
          case 2:
            console.log('user wants to get their location');
            getLocation();
          default:
        }
      }
    );
  };

  // Function to generate a unique reference string for the image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/')[uri.split('/').length - 1]; // Extract the image name from its URI
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Function to upload the image to Firebase storage and send the image URL in the chat
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI); // Generate unique reference for the image
    const response = await fetch(imageURI); // Fetch the image data
    const blob = await response.blob(); // Convert image data to Blob format
    const newUploadRef = ref(storage, uniqueRefString); // Create a reference in Firebase storage
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      // Upload the image to Firebase
      console.log('File has been uploaded successfully');
      const imageURL = await getDownloadURL(snapshot.ref); // Get the downloadable URL of the uploaded image
      onSend([
        {
          _id: `${userID}-${new Date().getTime()}`, // Generate a unique message ID
          createdAt: new Date(),
          user: {
            _id: userID,
            name: '',
          },
          image: imageURL,
        },
      ]);
    });
  };

  // Function to pick an image from the user's library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to get the user's current location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    console.log('Location permission status:', permissions);
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      console.log('Fetched location:', location);
      if (location) {
        onSend([
          {
            _id: `${userID}-${new Date().getTime()}`, // Generate a unique ID
            createdAt: new Date(),
            user: {
              _id: userID,
              name: '',
            },
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          },
        ]);
      } else {
        Alert.alert('Error occurred while fetching location');
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="Opens actions menu"
      accessibilityHint="Opens a menu to choose from sending an image from your library, taking a photo or sending your current location."
      accessibilityRole="Button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
