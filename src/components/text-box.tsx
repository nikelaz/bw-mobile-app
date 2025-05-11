import { useState } from 'react';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { styles as touchableBoxStyleSheet } from './touchable-box';
import { TextInput, TextInputProps } from 'react-native';

const TextBox = (props: TextInputProps) => {
  const [isActive] = useState(false);
  
  const colorGrey5 = useThemeColor({}, 'systemGrey5');
  const colorWhiteOrGrey6 = useThemeColor({light: 'white'}, 'systemGrey6');
  const colorBlackOrBg = useThemeColor({ dark: 'black', light: 'background' }, 'background'); 
  
  let bgColor = isActive ? colorGrey5 : colorWhiteOrGrey6;

  if (props.editable === false) {
    bgColor = colorBlackOrBg;
  }

  return (
    <TextInput
      style={{
        backgroundColor: bgColor,
        color: useThemeColor({}, 'text'),
        ...touchableBoxStyleSheet.touchableBox,
        fontSize: 16
      }}
      placeholderTextColor={useThemeColor({}, 'systemGrey')}
      {...props}
    />
  );
}

export default TextBox;
