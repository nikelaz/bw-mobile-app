import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Select from '../../components/select';

export default function Settings() {
  const onChange = (obj: any) => {
    console.log('change', obj);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <ThemedText>Settings</ThemedText>
          <Select
            onValueChange={onChange}
            items={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },              
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingLeft: 20,
  }
});
