# Standby clock for Android

A React Native app that simulates an always-on display (AOD) clock feature for mobile devices. This project leverages JavaScript and familiar MERN-style technologies to provide a simple, dark-themed clock that keeps the device awake and locks the orientation to landscape—ideal for displaying time on a desk.

## Features

- **Always-On Display:** Keeps the screen active using `react-native-keep-awake` (or `expo-keep-awake` if using Expo).
- **Real-Time Clock:** Displays the current time updated every second.
- **Landscape Orientation:** Locks the screen orientation to landscape mode using `react-native-orientation-locker`.
- **Dark Theme:** Uses a minimal dark theme to reduce battery consumption on OLED screens.

## Tech Stack

- **React Native:** Framework for building native apps using JavaScript.
- **react-native-keep-awake:** Prevents the device from sleeping.
- **react-native-orientation-locker:** Manages screen orientation.

## Prerequisites

- **Node.js** installed on your machine.
- **React Native CLI** or **Expo CLI** (depending on your chosen setup).
- **Android Studio** (for Android devices/emulators) or **Xcode** (for iOS, if applicable).

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/always-on-display-clock.git
   cd always-on-display-clock

## Install Dependencies
To install the required dependencies, run:
```bash
npm install
```

## Link Native Dependencies (React Native CLI only)
If you are using React Native CLI, link the native dependencies:
```bash
npx react-native link
```

## Running the App
### Android
Start the app on an Android device or emulator:
```bash
npx react-native run-android
```

### iOS
If applicable, run the app on an iOS simulator or device:
```bash
npx react-native run-ios
```

## Usage
Once the app is running:
- The device screen remains active, preventing sleep.
- The clock displays the current time in a large, readable format.
- The orientation is locked to landscape, making it ideal for placing on a desk.

## Customization
### Clock Update
Adjust the interval or format by modifying the code in your main component (e.g., `App.js` or `AlwaysOnDisplay.js`).

### Styling
Tweak the styles in the `StyleSheet` to change colors, fonts, or layout.

### Orientation
Modify the orientation behavior by configuring `react-native-orientation-locker` as needed.

## Contributing
Contributions are welcome! If you have suggestions, improvements, or bug fixes, please submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

## Acknowledgements
This project makes use of the following libraries:
- [`react-native-keep-awake`](https://github.com/corbt/react-native-keep-awake)
- [`react-native-orientation-locker`](https://github.com/wonday/react-native-orientation-locker)

---
Feel free to update the repository URL and any other details to suit your project specifics. Happy coding!

