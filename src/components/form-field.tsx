import { View } from 'react-native';
import GroupLabel from './group-label';
import InputError from './input-error';

type FormFieldProps = Readonly<{
  children?: React.ReactNode;
  label?: string;
  error?: string;
}>;

const FormField = (props: FormFieldProps) => {
  return (
    <View>
      {Boolean(props.label) ? <GroupLabel>{props.label}</GroupLabel> : null}
      {props.children}
      <InputError>
        {props.error || ''}
      </InputError>
    </View>
  );
};

export default FormField;
