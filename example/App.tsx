import { Pressable, StyleSheet, Text, View } from "react-native";

import * as ExpoBgtwn from "expo-bgtwn";
import { addExpirationListener } from "expo-bgtwn";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function App() {

  const testIt = async () => {
    const indt = await ExpoBgtwn.startForegroundAction();
    const list = addExpirationListener((event) => {
      console.log(event);
    });
    try {
      await sleep(1000);
      for(let i = 0; i < 40; i++) {
        console.log(i, await ExpoBgtwn.getBackgroundTimeRemaining());
        await sleep(1000);
      }
    } finally {
      list.remove();
      await ExpoBgtwn.stopForegroundAction(indt);
    }


  };
  return (
    <View style={styles.container}>
      <Pressable onPress={testIt} style={({pressed})=>({
        opacity: pressed ? 0.5 : 1,
        backgroundColor:'red',
        padding:10,
        borderRadius:10,
      })}><Text>Hey</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
