import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function Budget() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <ThemedText>Budget</ThemedText>
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
