import Container from '@/src/components/container';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/src/components/group-label';
import TextBox from '@/src/components/text-box';
import ColLayout from '@/src/components/col-layout';
import { useUserStore } from '@/src/stores/user-store';
import { useState } from 'react';
import useErrorBoundary from '@/src/hooks/useErrorBoundary';
import { ChangePasswordSchema } from '@/src/validation-schemas/user-schemas';
import TouchableBox from '@/src/components/touchable-box';
import SuccessBox from '@/src/components/success-box';

export default function ChangePassword() {
  const userStore = useUserStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorBoundary = useErrorBoundary();

  const changePassword = async () => {
    setIsLoading(true);
    try {
      const parsedInput = ChangePasswordSchema.parse({
        password: currentPassword,
        newPassword,
        repeatPassword: repeatNewPassword
      });
      if (newPassword !== repeatNewPassword) throw new Error('The new passwords do not match');
      await userStore.changePassword(parsedInput.password, parsedInput.newPassword, parsedInput.repeatPassword);
      setSuccessMessage('Password changed successfully.');
    } catch (error) {
      console.log('error');
      errorBoundary(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <TextBox secureTextEntry={true} value={currentPassword} onChangeText={setCurrentPassword} />
          </View>
          <View>
            <GroupLabel>New Password</GroupLabel>
            <TextBox secureTextEntry={true} value={newPassword} onChangeText={setNewPassword} />
          </View>
          <View>
            <GroupLabel>Repeat New Password</GroupLabel>
            <TextBox secureTextEntry={true} value={repeatNewPassword} onChangeText={setRepeatNewPassword} />
          </View>
          <TouchableBox isLoading={isLoading} icon='save-outline' center={true} color="primary" onPress={changePassword}>Save Changes</TouchableBox>
          { successMessage ? (
            <SuccessBox>{successMessage}</SuccessBox>
          ) : null }
        </ColLayout>
      </Container>
    </View>
    
      
  );
}
