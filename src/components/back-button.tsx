import { Platform, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useMemo } from 'react';

export type BackButtonProps = Readonly<{
  onPress: ((event: GestureResponderEvent) => void);
  accessibilityLabel?: string;
}>;

const BackButton = ({
  onPress,
  accessibilityLabel = 'go back',
}: BackButtonProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const buttonProps = useMemo(() => {
    const isIOS = Platform.OS === 'ios';
    return {
      backIcon: isIOS ? 'chevron-back-outline' : 'arrow-back-outline',
      color: isIOS ? primaryColor : textColor,
      iconSize: isIOS ? 28 : 25,
    };
  }, [primaryColor, textColor]);

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.wrapper}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Ionicons 
        size={buttonProps.iconSize} 
        name={buttonProps.backIcon} 
        color={buttonProps.color} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
    paddingLeft: 2,
  },
});

export default BackButton;
