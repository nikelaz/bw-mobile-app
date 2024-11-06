import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function Transactions() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <ThemedText>Transactions</ThemedText>
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
