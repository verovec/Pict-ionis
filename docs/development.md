# Development

## Toolchain

- Node.js and npm.
- Expo SDK 42 (`expo ~42.0.1`), which predates the `npx expo` CLI: install the legacy
  `expo-cli` globally, or use `npx expo-cli`.
- Expo Go on a phone, or an Android emulator / iOS simulator.
- A Firebase project with **Authentication > Email/Password** and **Cloud Firestore** enabled.
  The JS SDK is `firebase` 8.2.3 (namespaced API, `firebase.auth()`, `firebase.firestore()`).

## Recipes

```sh
npm install              # dependencies, including expo-draw from a git URL
npm start                # expo start: Metro bundler, QR code for Expo Go
npm run android          # expo start --android, opens on a connected device or emulator
npm run ios              # expo start --ios (macOS only)
npm run web              # expo start --web, limited: the drawing canvas targets native
npm run eject            # expo eject, not needed for this project
```

There are no tests and no lint configuration in the repository.

## Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com).
2. Enable **Email/Password** under Authentication > Sign-in method.
3. Create a **Firestore** database. The app creates the `THREADS` collection and its
   `MESSAGES` and `DRAW` sub-collections on first use ([architecture.md](architecture.md#firestore-data-model)).
4. Register a web app in the project settings and paste its config into `database/firebase.js`:

```js
const firebaseConfig = {
    apiKey: "...",
    authDomain: "<project>.firebaseapp.com",
    databaseURL: "https://<project>.firebaseio.com",
    projectId: "<project>",
    storageBucket: "<project>.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};
```

The config committed in the repository points to the original student project; a Firebase web
API key is not a secret by itself, but the project behind it is not maintained.

## Dependencies worth knowing

| Package | Version | Used for |
|---------|---------|----------|
| `expo` | ~42.0.1 | managed workflow, `node_modules/expo/AppEntry.js` is the entry point |
| `react-native` | Expo SDK 42 fork | the runtime |
| `@react-navigation/native`, `@react-navigation/stack` | 6.0 | AuthStack and HomeStack |
| `react-native-paper` | 4.9 | `List.Item`, `IconButton`, `Divider`, `Title`, the `PaperProvider` |
| `react-native-gifted-chat` | 0.16 | the chat of the room |
| `@benjeau/react-native-draw` | 0.3 | the canvas and the `addPath` / `undo` / `clear` ref API |
| `firebase` | 8.2.3 | Authentication and Firestore |
| `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context` | 1.10 / 3.4 / 3.2 | peers of React Navigation |

`expo-draw`, `react-canvas-draw`, `react-live-drawing-firebase`, `react-native-canvas`,
`react-native-webview`, `react-native-svg` and `@react-native-firebase/firestore` are listed in
`package.json` but not imported by the current screens; they are left over from the drawing
experiments that led to `@benjeau/react-native-draw`.

## Conventions

- Function components with hooks; the class-based `components/chat.js` is the only exception
  and is unused.
- Screens live in `components/`, navigators in `navigation/`, Firebase in `database/`.
- Firestore collections are named in upper case (`THREADS`, `MESSAGES`, `DRAW`).

## Cleaning up

```sh
rm -rf node_modules .expo .expo-shared    # dependencies and Expo caches
```

Rooms, messages and strokes stay in Firestore; delete the `THREADS` collection from the
Firebase console to reset the game.
