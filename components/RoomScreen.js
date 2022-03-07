import React, { useRef, useState, useContext, useEffect } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Draw, DrawRef } from "@benjeau/react-native-draw";
import { AuthContext } from '../navigation/AuthProvider';
import firebase from '../database/firebase';
import { ScrollView } from 'react-native-gesture-handler';

export default function RoomScreen({ route }) {

  const [messages, setMessages] = useState([]);
  const [draws, setDraws] = useState([]);
  const { thread } = route.params;
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const drawRef = useRef(DrawRef);
  const [setupDrawing, setSetupDrawing] = useState(false);
  const [drawerId, setDrawerId] = useState(null);

  const drawing = (tmpPaths) => {
    if (tmpPaths.length && (drawerId == currentUser.uid || !drawerId)) {
      // const enable = draws.length ? Boolean(tmpPaths[tmpPaths.length - 1].path != draws[draws.length -1].path) : true
      // if(enable) {
        const paths = tmpPaths[tmpPaths.length - 1]
        firebase.firestore()
          .collection('THREADS')
          .doc(thread._id)
          .collection('DRAW')
          .add({
            userId: currentUser.uid,
            color: paths.color,
            data: paths.data.map((vector) => { return { data: vector.map((v) => v) } }),
            opacity: paths.opacity,
            path: paths.path,
            thickness: paths.thickness
          });
      // }
    }
    // if(tmpPaths.length && drawerId && (drawerId != currentUser.uid)) {
    //   drawRef?.current?.undo()
    // }
  }

  async function handleSend(messages) {
    const text = messages[0].text;

    firebase.firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email
        }
      });

    await firebase.firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  function getData(drws) {
    const array = [];
    drws.forEach(element => {
      element.data.forEach(element2 => {
        array.push(element2.data);
      });
    });
    return (array)
  }

  async function getDraws() {

      firebase.firestore()
        .collection('THREADS')
        .doc(thread._id)
        .collection('DRAW').onSnapshot((doc) => {
          const d = doc.docs.map(docs => docs.data());
          const newData = d.map((v) => { return { ...v, data: getData([v]) } })
          console.log(newData)
          if(newData.length && drawRef.current && newData[0].userId != currentUser.uid) {
            if(!setupDrawing) {
              newData.map((data) => {
                drawRef.current.addPath(data);
              })
              setSetupDrawing(true);
            }
            else{
              drawRef.current.addPath(newData[newData.length - 1]);
            
            } 

              setDraws(newData);
            
          }
           
            if(newData.length) {
              setDrawerId(newData[0].userId)
            }
          
        })
  }


  // arr.push(snapshot.docs.map(doc => doc.data()))


  //     arr[0].forEach(element => {
  //       element.data = getData([element])
  //     });
  //     console.log(arr[0])
  //     setDraws(arr[0])

  useEffect(() => {
    getDraws();

    const messagesListener = firebase.firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email
            };
          }

          return data;
        });
        setMessages(messages);
      });

    return () => messagesListener();
  }, []);

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#33C7FF' />
      </View>
    );
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#5BE167'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#33C7FF' />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#33C7FF' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function getInitialValue() {
    if(draws.length && draws[0].userId != currentUser.uid) {
      return {
        color: "#B644D0",
        thickness: 10,
        opacity: 0.5,
        paths: draws
      }
    }
    return {
      color: "#B644D0",
      thickness: 10,
      opacity: 0.5
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => 100
        })()}>
        <ScrollView contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
          <Draw
            ref={drawRef}
            height={450}
            width={400}
            initialValues={getInitialValue()}
            brushPreview="none"
            canvasStyle={{ elevation: 0, backgroundColor: "white" }}
            autoDismissColorPicker={true}
            onPathsChange={drawing}
          />
          <GiftedChat
            style={styles.chat}
            messages={messages}
            onSend={handleSend}
            user={{ _id: currentUser.uid }}
            renderBubble={renderBubble}
            placeholder='Ecrivez votre message ici...'
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottomComponent={scrollToBottomComponent}
            scrollToBottom
            showUserAvatar
            renderLoading={renderLoading}
            renderSystemMessage={renderSystemMessage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: '#fff'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  chat: {

  }
});