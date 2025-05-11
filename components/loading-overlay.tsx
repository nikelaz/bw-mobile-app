import { View, StyleSheet, Modal } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Loader } from './loader'; 

type LoadingOverlayProps = Readonly<{
  isVisible: boolean,
}>;

const LoadingOverlay = (props: LoadingOverlayProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  const foregroundColor = useThemeColor({}, 'text');

  if (!props.isVisible) return null;
 
  return (
    <Modal
      transparent
      visible={props.isVisible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[styles.overlay, backgroundColor]}>
        <Loader 
          width={80}
          height={80}
          color={foregroundColor}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    zIndex: 10,
  },
});

export default LoadingOverlay;
