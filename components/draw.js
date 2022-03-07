import React from 'react';
import { Draw, DrawRef } from "@benjeau/react-native-draw";
import { View, StyleSheet } from 'react-native';
import Chat from './chat'

export default function App() {

  const removeLastPath = () => {
    DrawRef.current.undo();
  }

  const clearDrawing = () => {
    DrawRef.current.clear();
  }

  return (
    <View style={styles.container}>
        <Draw
        ref={DrawRef}
        height={600}
        width={400}
        initialValues={{
            color: "#B644D0",
            thickness: 10,
            opacity: 0.5,
            paths: []
        }}
        brushPreview="none"
        canvasStyle={{ elevation: 0, backgroundColor: "white" }}
        />
        <Chat/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      justifyContent: 'center',
      alignItems: 'center',
      padding: 35,
      backgroundColor: '#fff'
    }
  });