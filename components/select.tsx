import RNPickerSelect from 'react-native-picker-select';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = Readonly<{
  items: SelectItem[],
  onValueChange: (value: SelectItem) => void,
}>;

const Select = (props: SelectProps) => {
  const [selectedItem, setSelectedItem] = useState(props.items[0]);
  const [isActive, setIsActive] = useState(false);
  const bgColor = isActive ? useThemeColor({}, 'systemGrey5') : useThemeColor({}, 'systemGrey6');
  const textColor = useThemeColor({}, 'text');

  const handleChange = (selectedValue: string) => {
    if (selectedValue === null) return;
    const selectedItem = props.items.find(item => item.value === selectedValue);
    if (!selectedItem) return;
    setSelectedItem(selectedItem);
    props.onValueChange(selectedItem);
  };

  return (
    <RNPickerSelect
      onValueChange={handleChange}
      items={props.items}
      value={selectedItem.value}
    >
      <TextInput
        style={{
          paddingTop: 15,
          paddingRight: 20,
          paddingBottom: 15,
          paddingLeft: 20,
          backgroundColor: bgColor,
          borderRadius: 10,
          color: textColor,
        }}
        value={selectedItem.label}
        onResponderStart={() => setIsActive(true)}
        onResponderRelease={() => setIsActive(false)}
      />
    </RNPickerSelect>
  );
}

export default Select;
