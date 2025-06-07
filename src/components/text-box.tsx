import { forwardRef, useState } from 'react';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { styles as touchableBoxStyleSheet } from './touchable-box';
import { TextInput, TextInputProps } from 'react-native';

type TextBoxProps = TextInputProps & {
  isInvalid?: boolean;
}

const TextBox = forwardRef<TextInput, TextBoxProps>((props, ref) => {
  const [isActive] = useState(false);
  
  const colorGrey5 = useThemeColor({}, 'systemGrey5');
  const colorWhiteOrGrey6 = useThemeColor({light: 'white'}, 'systemGrey6');
  const colorBlackOrBg = useThemeColor({ dark: 'black', light: 'background' }, 'background'); 
  const colorInvalid = useThemeColor({}, 'red');
  
  let bgColor = isActive ? colorGrey5 : colorWhiteOrGrey6;

  if (props.editable === false) {
    bgColor = colorBlackOrBg;
  }

  return (
    <TextInput
      ref={ref}
      style={{
        backgroundColor: bgColor,
        color: useThemeColor({}, 'text'),
        ...touchableBoxStyleSheet.touchableBox,
        fontSize: 16,
        borderColor: props.isInvalid ? colorInvalid : bgColor,
        borderWidth: 1,
      }}
      placeholderTextColor={useThemeColor({}, 'systemGrey')}
      {...props}
    />
  );
});

export default TextBox;

