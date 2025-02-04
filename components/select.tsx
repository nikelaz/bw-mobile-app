import RNPickerSelect from 'react-native-picker-select';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './themed-text';
import { useColorScheme } from 'react-native';
import { styles as touchableBoxStyleSheet } from './touchable-box';

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = Readonly<{
  items: SelectItem[],
  onValueChange: (value: SelectItem) => void,
  selectedItem: SelectItem,
}>;

const Select = (props: SelectProps) => {
  const colorScheme = useColorScheme() || 'light';
  const [selectedItem, setSelectedItem] = useState(props.selectedItem || props.items[0]);
  const [isActive, setIsActive] = useState(false);
  const bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({light: 'white'}, 'systemGrey6');

  const handleChange = (selectedValue: string) => {
    if (selectedValue === null) return;
    const selectedItem = props.items.find(item => item.value.toString() === selectedValue.toString());
    if (!selectedItem) return;
    setSelectedItem(selectedItem);
    props.onValueChange(selectedItem);
  };

  return (
    <RNPickerSelect
      onValueChange={handleChange}
      items={props.items}
      value={selectedItem.value}
      darkTheme={colorScheme === 'dark'}
      touchableWrapperProps={{
        style: {
          backgroundColor: bgColor,
          ...touchableBoxStyleSheet.touchableBox
        },
        onPressIn: () => setIsActive(true),
        onPressOut: () => setIsActive(false),
      }}
    >
      <ThemedText style={{lineHeight: 17}}>{selectedItem.label}</ThemedText>
    </RNPickerSelect>
  );
}

export default Select;
