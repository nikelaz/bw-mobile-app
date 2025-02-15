import { useState } from 'react';
import TouchableBox from './touchable-box';
import { Picker, PickerValue } from '@ant-design/react-native';

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = Readonly<{
  items: SelectItem[],
  onValueChange: (value: SelectItem) => void,
  selectedItem: SelectItem,
  title?: string,
}>;

const Select = (props: SelectProps) => {
  const [selectedItem, setSelectedItem] = useState(props.selectedItem || props.items[0]);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (selectedValue: PickerValue[]) => {
    if (selectedValue[0] === null) return;
    const selectedItem = props.items.find(item => item.value.toString() === selectedValue[0].toString());
    if (!selectedItem) return;
    props.onValueChange(selectedItem);
    setSelectedItem(selectedItem);
  };

  return (
    <>
      <TouchableBox onPress={() => setIsVisible(true)}>{selectedItem.label}</TouchableBox>
      <Picker
        data={props.items}
        title={props.title}
        value={[selectedItem.value]}
        okText="Done"
        dismissText="Cancel"
        onChange={handleChange}
        cols={1}
        onVisibleChange={v => setIsVisible(v)}
        visible={isVisible}
      />
    </>
  );
}

export default Select;
