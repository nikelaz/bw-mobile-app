import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface TouchableBoxProps {
  children: React.ReactNode,
}

const SuccessBox = (props: TouchableBoxProps) => {
  const iconColor = useThemeColor({}, 'text');

  return (
    <View style={styles.successBox}>
      <Ionicons name='checkmark-outline' size={24} color={iconColor} />
      <ThemedText>
        {props.children}
      </ThemedText>
    </View>
  );
}

export const styles = StyleSheet.create({
  successBox: {
    height: 'auto',
    borderRadius: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 11.5,
    paddingBottom: 11.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(52, 199, 89, 0.4)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.45)',
  }
});

export default SuccessBox;
