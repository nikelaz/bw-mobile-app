import { View, StyleSheet } from 'react-native';

type ColLayoutProps = Readonly<{
  children: React.ReactNode,
  spacing?: 's' | 'm' | 'l' | 'xl',
}>;

/**
 * Available spacing options for the column layout
 */
export type Spacing = 's' | 'm' | 'l' | 'xl';

/**
 * Spacing values in pixels mapped to their respective keys
 */
const SPACING_VALUES: Record<Spacing, number> = {
  s: 10,
  m: 15,
  l: 30,
  xl: 35,
};

const ColLayout = (props: ColLayoutProps) => {
  const spacing = props.spacing || 'xl';

  return (
    <View style={{
      ...styles.col,
      gap: SPACING_VALUES[spacing]
    }}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
});

export default ColLayout;
