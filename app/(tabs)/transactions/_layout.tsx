import { Stack } from 'expo-router/stack';
import { Button } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="create" />
    </Stack>
  );
}
