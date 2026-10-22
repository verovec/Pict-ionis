# Architecture

Pict-ionis is a single Expo managed app: no native code, no server of its own. Firebase
provides authentication and the real-time database, and every screen reads and writes Firestore
directly.

## Layers

```
App.js                  renders <Providers />
app.json                Expo manifest: name pictlonis_app, portrait, icon, splash, adaptive icon
babel.config.js         babel-preset-expo
navigation/
  index.js              Providers: PaperProvider > AuthProvider > Routes
  AuthProvider.js       AuthContext: user, setUser, login, register, logout (Firebase Auth)
  AuthContext.js        a stray duplicate of the context, not imported anywhere
  Routes.js             listens to onAuthStateChanged, shows Loading, then AuthStack or HomeStack
  AuthStack.js          Signup (initial), Login; Dashboard, Draw and Chat also registered but unused
  HomeStack.js          modal stack: ChatApp (Home, PasswordRoom, Room) and AddRoom
components/
  signup.js, login.js   email and password forms with the wordmark on top
  loading.js            ActivityIndicator
  dashboard.js          Home: live list of rooms
  AddRoomScreen.js      create a room (name, password)
  passwordRoom.js       check the password before entering a room
  RoomScreen.js         the game: Draw canvas + GiftedChat, both synced through Firestore
  draw.js, chat.js      earlier iterations, unreachable
database/
  firebase.js           initializeApp(firebaseConfig) once, exports the firebase namespace
assets/                 icon.png, splash.png, adaptive-icon.png, favicon.png, pictlonis_logo.png
```

## Providers and navigation

```
  <PaperProvider>                       react-native-paper theme and icons
    <AuthProvider>                      AuthContext { user, setUser, login, register, logout }
      <Routes>                          firebase.auth().onAuthStateChanged -> setUser
        <Loading />                     until the first auth event
        <NavigationContainer>
          user ? <HomeStack /> : <AuthStack />
```

`AuthStack` starts on **Signup** and links to **Login**; both call the context functions, which
wrap `createUserWithEmailAndPassword` and `signInWithEmailAndPassword`. Errors are only logged
to the console. As soon as Firebase reports a user, `Routes` swaps in `HomeStack`.

`HomeStack` is a modal stack with two screens: `ChatApp`, itself a stack (Home, PasswordRoom,
Room), and `AddRoom`, presented as a modal from the `message-plus` icon of the Home header. The
`logout-variant` icon on the left calls `logout`, which brings `AuthStack` back.

Header colour is `#33C7FF` everywhere; the stroke colour of the canvas is `#B644D0`.

## Firestore data model

```
THREADS/{roomId}
  name            string      room name
  password        string      room password, stored in clear
  latestMessage   { text, createdAt }   shown under the name on Home, used for ordering

THREADS/{roomId}/MESSAGES/{messageId}
  text            string
  createdAt       number      Date.now()
  user            { _id: uid, email }   absent on system messages
  system          true        only on the welcome message written at room creation

THREADS/{roomId}/DRAW/{strokeId}
  userId          string      uid of the drawer
  color, opacity, thickness   brush settings of the stroke
  path            string      SVG path produced by react-native-draw
  data            [{ data: [...] }]     the points of the stroke
```

Collection and field names are those used in the code, in upper case for the collections.
No security rules are committed; the Firebase console holds them.

## Screen by screen

| Screen | Reads | Writes |
|--------|-------|--------|
| Home (`dashboard.js`) | `THREADS` ordered by `latestMessage.createdAt` desc, live | nothing |
| AddRoom | nothing | one `THREADS` document, then one system message in its `MESSAGES` |
| PasswordRoom | the room document, live; compares `password` with the input | nothing; navigates to Room or back Home |
| Room | `MESSAGES` ordered by `createdAt` desc, live; `DRAW`, live | a `MESSAGES` document per message and `latestMessage` on the room; a `DRAW` document per stroke |

## Drawing sync

`RoomScreen` mounts a `Draw` canvas (`@benjeau/react-native-draw`, 400 x 450) with
`onPathsChange` and keeps a `ref` on it.

1. **Who draws.** `getDraws` subscribes to the `DRAW` sub-collection. The `userId` of the first
   stroke becomes `drawerId`. While the collection is empty anyone can draw.
2. **Sending strokes.** `onPathsChange` fires with the whole list of local paths. When the
   current user is the drawer (or no drawer exists yet), the last path is written to `DRAW`
   with its colour, opacity, thickness, SVG path and points.
3. **Receiving strokes.** On every snapshot, a non-drawer replays the strokes with
   `drawRef.current.addPath`: all of them on first load, then only the newest one.
4. **Guessing.** `GiftedChat` sits under the canvas. `handleSend` writes the message and
   updates `latestMessage` on the room, which reorders the Home list for everyone.

There is no word to guess, no score and no turn rotation in the code: the drawer is whoever
drew first, and the chat is free text. The game rules are played by the people in the room.

## Configuration

| Setting | Where | Notes |
|---------|-------|-------|
| Firebase project | `database/firebase.js`, `firebaseConfig` | API key, project id `pictlonis2p0`, app id; replace with yours |
| App name and slug | `app.json` (`pictlonis_app`) | used by Expo Go and the store builds |
| Icons and splash | `app.json` -> `assets/` | portrait only, tablet supported on iOS |
