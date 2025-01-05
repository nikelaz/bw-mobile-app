import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserModelContextProvider } from '@/view-models/user-view-model';
import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaView, View, Text, Button } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

const ErrorFallbackComponent = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View>
        <Text>Oops!</Text>
        <Text>An unexpected error occured.</Text>
        <Button
          color={useThemeColor({}, 'primary')}
          onPress={() => router.navigate('/')}
          title="Try again"
        />
      </View>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <UserModelContextProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(login)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </UserModelContextProvider>
    </ErrorBoundary>
  );
}
