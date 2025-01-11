import Container from '@/components/container';
import { View } from 'react-native';
import GroupLabel from '@/components/group-label';
import TextBox from '@/components/text-box';
import ColLayout from '@/components/col-layout';
import Logo from '@/components/logo';
import TouchableBox from '@/components/touchable-box';
import { useRouter } from 'expo-router';
import { useUserModel } from '@/view-models/user-view-model';
import { useState } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import LinkButton from '@/components/link-button';

export default function ChangePassword() {
  const router = useRouter();
  const userModel = useUserModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorBoundary = useErrorBoundary();

  const login = async () => {
    try {
      await userModel.login(email, password);
      router.navigate('/(tabs)/budget');
    } catch (error: any) {
      errorBoundary(error);
    }
  };

  return (
    <Container>
      <ColLayout spacing="l">
        <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 30}}>
          <Logo width={100} height={100} />
        </View>
        
        <View>
          <GroupLabel>Email</GroupLabel>
          <TextBox value={email} onChangeText={setEmail} />
        </View>
        <View>
          <GroupLabel>Password</GroupLabel>
          <TextBox value={password} onChangeText={setPassword} secureTextEntry={true} />
        </View>
        <View>
          <TouchableBox onPress={login} arrow={true}>Login</TouchableBox>
        </View>
        <LinkButton href="/(login)/sign-up">Sign Up</LinkButton>
      </ColLayout>
    </Container>
  );
}
