import Container from '@/components/container';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import { useUserModel } from '@/view-models/user-view-model';
import { useState } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { ChangePasswordSchema } from '@/validation-schemas/user-schemas';
import TouchableBox from '@/components/touchable-box';
import SuccessBox from '@/components/success-box';

export default function ChangePassword() {
  const userModel = useUserModel();
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
      await userModel.changePassword(parsedInput.password, parsedInput.newPassword, parsedInput.repeatPassword);
      setSuccessMessage('Password changed successfully.');
    } catch (error) {
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
          <TouchableBox isLoading={isLoading} icon='save' onPress={changePassword}>Save Changes</TouchableBox>
          { successMessage ? (
            <SuccessBox>{successMessage}</SuccessBox>
          ) : null }
        </ColLayout>
      </Container>
    </View>
    
      
  );
}
