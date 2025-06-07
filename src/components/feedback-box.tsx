import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface FeedbackBoxProps {
  children: React.ReactNode,
  color: 'success' | 'error',
}

const FeedbackBox = (props: FeedbackBoxProps) => {
  const iconColor = useThemeColor({}, 'text');
  const icon = props.color === 'success' ? 'checkmark-outline' : 'close-outline';
  const backgroundColor = props.color === 'success' ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255, 59, 48, 0.4)';
  const borderColor = props.color === 'success' ? 'rgba(52, 199, 89, 0.45)' : 'rgba(255, 59, 48, 0.45)';

  return (
    <View style={{ ...styles.successBox, backgroundColor, borderColor }}>
      <Ionicons name={icon} size={24} color={iconColor} />
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
    borderStyle: 'solid',
    borderWidth: 1,
  }
});

export default FeedbackBox;
