import { View, StyleSheet, Modal } from 'react-native';
import { Loader } from './loader'; 

type LoadingOverlayProps = Readonly<{
  isVisible: boolean,
}>;

const LoadingOverlay = (props: LoadingOverlayProps) => {
  if (!props.isVisible) return null;
 
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Loader 
          width={50}
          height={50}
          color="#fff"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.89)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default LoadingOverlay;
