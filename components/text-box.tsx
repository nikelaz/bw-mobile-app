import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { styles as touchableBoxStyleSheet } from './touchable-box';
import { TextInput, TextInputProps } from 'react-native';

const TextBox = (props: TextInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({light: 'white'}, 'systemGrey6');

  return (
    <TextInput
      style={{
        backgroundColor: bgColor,
        color: useThemeColor({}, 'text'),
        ...touchableBoxStyleSheet.touchableBox
      }}
      {...props}
    />
  );
}

export default TextBox;
