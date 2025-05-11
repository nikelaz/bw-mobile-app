import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

type HeadingProps = Readonly<{
  children: React.ReactNode,
  level?: 1 | 2,
}>;

const Heading = (props: HeadingProps) => {
  const headingStyle = props.level === 2 ? styles.heading2 : styles.heading1;
  
  return (
    <ThemedText style={headingStyle}>
      {props.children}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  heading1: {
    fontSize: 28,
    lineHeight: 34, 
    fontWeight: 600,
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 600,
  },
});

Heading.defaultProps = {
  level: 1,
};

export default Heading;
