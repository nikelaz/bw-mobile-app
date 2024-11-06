import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function Reporting() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <ThemedText>Reporting</ThemedText>
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
