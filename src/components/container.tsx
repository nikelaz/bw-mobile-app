import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContainerProps = Readonly<{
  children: React.ReactNode,
  topInset?: Boolean,
}>;

const Container = (props: ContainerProps) => {
  const insets = useSafeAreaInsets();
  const paddingTop = props.topInset ? insets.top : 0; 
  const paddingBottom = Platform.OS === 'ios' ? insets.bottom + 40 : insets.bottom + 100; 
 
  return (
    <View style={{ paddingTop: paddingTop, backgroundColor: useThemeColor({}, 'background') }}>
      <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.scrollWrapper}>
        <View style={{
          paddingBottom,
        }}>
          <View
            style={{
              ...styles.container,
              ...props.style,
            }}
          >
            {props.children}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
