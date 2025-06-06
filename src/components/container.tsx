import { View, StyleSheet, SafeAreaView, ScrollView, ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';

type ContainerProps = Readonly<{
  children: React.ReactNode,
  onScroll?: ScrollViewProps['onScroll'],
  scrollEventThrottle?: number,
  style?: any,
}>;

const Container = (props: ContainerProps) => (
  <SafeAreaView style={{ backgroundColor: useThemeColor({}, 'background') }}>
    <ScrollView 
      automaticallyAdjustKeyboardInsets={true} 
      style={styles.scrollWrapper}
      onScroll={props.onScroll}
      scrollEventThrottle={props.scrollEventThrottle}
    >
      <View
        style={{
          ...styles.container,
          ...props.style,
        }}
      >
        {props.children}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    paddingTop: 30,
    paddingRight: 15,
    paddingBottom: 40,
    paddingLeft: 15,
  },
  scrollWrapper: {
    minHeight: '100%',
  }
});

export default Container;
