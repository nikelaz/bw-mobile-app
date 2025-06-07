import Container from '@/src/components/container';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import { useStore } from '@/src/stores/store';
import { useState } from 'react';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { ChangePasswordSchema } from '@/src/validation-schemas/user-schemas';
import TouchableBox from '@/src/components/touchable-box';
import FeedbackBox from '@/src/components/feedback-box';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const changePassword = useStore(state => state.changePassword);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const changePasswordHandler = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      if (data.newPassword !== data.repeatPassword) throw new Error('The new passwords do not match');
      await changePassword(data.password, data.newPassword, data.repeatPassword);
      setSuccessMessage('Password changed successfully.');
      reset();
    } catch (error) {
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View>
      <Stack.Screen options={{
        title: 'Change Password',
        headerBackTitle: 'Settings',
      }} />
      <Container>
        <ColLayout spacing="l">
          <View>
            <GroupLabel>Current Password</GroupLabel>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextBox secureTextEntry={true} value={value} onChangeText={onChange} />
              )}
            />
          </View>
          <View>
            <GroupLabel>New Password</GroupLabel>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <TextBox secureTextEntry={true} value={value} onChangeText={onChange} />
              )}
            />
          </View>
          <View>
            <GroupLabel>Repeat New Password</GroupLabel>
            <Controller
              control={control}
              name="repeatPassword"
              render={({ field: { onChange, value } }) => (
                <TextBox secureTextEntry={true} value={value} onChangeText={onChange} />
              )}
            />
          </View>
          <TouchableBox isLoading={isLoading} icon='save-outline' center={true} color="primary" onPress={changePasswordHandler}>Save Changes</TouchableBox>
          { successMessage ? (
            <FeedbackBox color="success">{successMessage}</FeedbackBox>
          ) : null }
        </ColLayout>
      </Container>
    </View>
  );
}
