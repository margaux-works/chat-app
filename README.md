# Chat App

The **Chat App** is a mobile application built with React Native that allows users to communicate in real-time. With features like text messaging, image sharing, and location sharing, the app provides a seamless chatting experience. Developed using Expo and Google Firestore, the Chat App is designed to work on both Android and iOS devices, ensuring users can stay connected wherever they are. The development process emphasizes high-quality code through a test-driven development (TDD) approach.

## Features

- **User Authentication**

  - Users can enter the chat anonymously via Google Firebase authentication.

- **Join a Chat Room**

  - A simple interface for users to enter their name and select a background color before joining the chat.

- **Send and Receive Messages**

  - Users can exchange messages in real-time with their friends and family.

- **Image Sharing**

  - Users can send images either by selecting from their device's image library or taking a new picture using the camera.

- **Location Sharing**

  - Users can share their current location, displayed in a map view.

- **Offline Access**

  - Users can read their messages offline, allowing them to access conversations anytime.

- **Screen Reader Compatibility**
  - The app is designed to be compatible with screen readers for users with visual impairments

## Tech Stack

- **React Native**: Framework for building mobile applications.
- **Expo**: Development tool for building and deploying React Native apps.
- **Google Firestore**: Database for storing chat messages and user data.
- **Firebase Authentication**: Handles anonymous user authentication.
- **Gifted Chat**: Library for creating the chat interface and functionality.
- **JavaScript (ES2015+)**: Modern JavaScript for handling app logic.
- **CSS/Styled Components**: Stylesheets for responsive design.

## Screenshots

to be uploaded later

## Scenarios (Given-When-Then)

**Feature 1: User Authentication**

- Scenario: User enters a chat room
  - Given the user opens the app
  - When the user enters their name and chooses a background color
  - Then the user should be taken to the chat room.

**Feature 2: Send and Receive Messages**

- Scenario: User sends a message
  - Given the user is in the chat room
  - When the user types a message and clicks send
  - Then the message should appear in the chat.

**Feature 3: Image Sharing**

- Scenario: User sends an image
  - Given the user selects an image from their library
  - When the user clicks send
  - Then the image should be displayed in the chat.

**Feature 4: Location Sharing**

- Scenario: User shares their location
  - Given the user has allowed location access
  - When the user shares their location
  - Then the location should be sent and displayed on a map.

**Feature 5: Offline Access**

- Scenario: User accesses messages offline
  - Given the user has previously opened the app while online
  - When the user opens the app without an internet connection
  - Then the user should be able to read previously received messages.

**Feature 6: Screen Reader Compatibility**

- Scenario: User engages with the chat interface using a screen reader
  - Given the user is using a screen reader
  - When the user navigates through the chat interface
  - Then the screen reader should read aloud the text and buttons.

## Development Status

🚧 This project is under development

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

## License

This project is licensed under the MIT License.
