import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';
import type { GenericChildrenProps } from '@/types/generics';

const GroupLabel = (props: GenericChildrenProps) => (
  <ThemedText style={styles.groupLabel}>
    {props.children}
  </ThemedText>
);

const styles = StyleSheet.create({
  groupLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    // color: useThemeColor({}, 'systemGrey'),
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
});

export default GroupLabel;
