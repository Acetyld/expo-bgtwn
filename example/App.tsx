import { StyleSheet, Text, View } from 'react-native';

import * as ExpoBgtwn from 'expo-bgtwn';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoBgtwn.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
