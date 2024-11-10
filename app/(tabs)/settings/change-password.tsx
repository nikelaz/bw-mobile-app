import Container from '@/components/container';
import { Stack } from 'expo-router';
import { View, Button } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';

export default function ChangePassword() {
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
            <TextBox />
          </View>
          <View>
            <GroupLabel>New Password</GroupLabel>
            <TextBox />
          </View>
          <View>
            <GroupLabel>Repeat New Password</GroupLabel>
            <TextBox />
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Button title="Change Password" />
          </View>
        </ColLayout>
      </Container>
    </View>
    
      
  );
}
