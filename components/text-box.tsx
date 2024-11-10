import { GenericChildrenProps } from '@/types/generics';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import { styles as touchableBoxStyleSheet } from './touchable-box';
import { TextInput } from 'react-native';

type TextBoxProps = Readonly<{
  value?: string,
}>;

const TextBox = (props: TextBoxProps) => {
  const [isActive, setIsActive] = useState(false);
  const bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({}, 'systemGrey6');

  return (
    <TextInput
      style={{
        backgroundColor: bgColor,
        color: useThemeColor({}, 'text'),
        ...touchableBoxStyleSheet.touchableBox
      }}
      value={props.value}
    />
  );
}

export default TextBox;
