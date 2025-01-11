import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles as touchableBoxStyleSheet } from './touchable-box';
import { TextInput, TextInputProps } from 'react-native';

const TextBox = (props: TextInputProps) => {
  const [isActive, setIsActive] = useState(false);
  let bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({light: 'white'}, 'systemGrey6');

  if (props.editable === false) {
    bgColor = useThemeColor({ dark: 'black', light: 'background' }, 'background');
  }

  return (
    <TextInput
      style={{
        backgroundColor: bgColor,
        color: useThemeColor({}, 'text'),
        ...touchableBoxStyleSheet.touchableBox,
        fontSize: 16
      }}
      {...props}
    />
  );
}

export default TextBox;
