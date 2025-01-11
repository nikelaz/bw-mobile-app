import { Platform, Alert } from 'react-native';

class Dialog {
  static confirm(title: string, body: string, confirmBtnTitle: string, onConfirm: Function) {
    if (Platform.OS === 'web') {
      const shouldConfirm = window.confirm(`${title} \n${body}`);
      if (shouldConfirm) onConfirm();
    } else {
      Alert.alert(title, body, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: confirmBtnTitle,
          onPress: () => onConfirm()
        },
      ]);
    }
  }
}

export default Dialog;
