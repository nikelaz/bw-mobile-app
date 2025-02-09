import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const Container = (props: GenericChildrenProps) => (
  <SafeAreaView style={{ backgroundColor: useThemeColor({}, 'background') }}>
    <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.scrollWrapper}>
      <View style={styles.container}>
        {props.children}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    ...Platform.select({
      ios: {
        paddingTop: 30,
      },
      android: {
        paddingTop: 60,
      },
    }),
    paddingRight: 15,
    paddingBottom: 40,
    paddingLeft: 15,
  },
  scrollWrapper: {
    minHeight: '100%',
  }
});

export default Container;
