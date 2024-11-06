import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function Settings() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <ThemedText>Settings</ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%'
  }
});
