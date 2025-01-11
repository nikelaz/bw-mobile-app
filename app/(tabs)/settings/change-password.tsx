import Container from '@/components/container';
import { Stack } from 'expo-router';
import { View, Button } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import { useUserModel } from '@/view-models/user-view-model';
import { useState } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { ThemedText } from '@/components/themed-text';

export default function ChangePassword() {
  const userModel = useUserModel();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const errorBoundary = useErrorBoundary();

  const changePassword = async () => {
    try {
      await userModel.changePassword(currentPassword, newPassword, repeatNewPassword);
      setSuccessMessage('Password changed successfully.');
    } catch (error) {
      errorBoundary(error);
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
          <View style={{ alignItems: 'flex-start' }}>
            <Button title="Change Password" onPress={changePassword} />
            <ThemedText>{successMessage}</ThemedText>
          </View>
        </ColLayout>
      </Container>
    </View>
    
      
  );
}
