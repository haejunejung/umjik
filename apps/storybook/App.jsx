import { LogBox, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

LogBox.ignoreAllLogs();

function App() {
  return (
    <View style={styles.container}>
      <Text>umjik Storybook</Text>
      <Text>Run with STORYBOOK_ENABLED=true to view stories</Text>
    </View>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig?.extra?.storybookEnabled === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppEntryPoint;
