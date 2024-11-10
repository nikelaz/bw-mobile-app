import { View, StyleSheet } from 'react-native';

type Spacing = 's' | 'm' | 'l' | 'xl';

type ColLayoutProps = Readonly<{
  children: React.ReactNode,
  spacing?: 's' | 'm' | 'l' | 'xl',
}>;

const getGap = (spacing: Spacing | undefined) => { 
  switch (spacing) {
    case 's':
      return 10;
    case 'm':
      return 15;
    case 'l':
      return 30;
    default:
      return 35;
  }
}

const ColLayout = (props: ColLayoutProps) => (
   <View style={{
    ...styles.col,
    gap: getGap(props.spacing)
   }}>
    {props.children}
   </View>
);

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
});

export default ColLayout;
