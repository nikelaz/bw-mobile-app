import { ThemedText } from './themed-text';
import { StyleSheet } from 'react-native';

type HeadingProps = Readonly<{
  children: React.ReactNode,
  level?: 1 | 2,
}>;

const Heading = (props: HeadingProps) => (
  <ThemedText style={{
    ...styles.heading,
    fontSize: props.level && props.level === 2 ? 22 : 28,
  }}>
    {props.children}
  </ThemedText>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: 600,
  },
});

export default Heading;
