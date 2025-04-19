import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserModelContextProvider } from '@/view-models/user-view-model';
import ErrorBoundary from 'react-native-error-boundary';
import { SafeAreaView, View, Text } from 'react-native';
import LinkButton from '@/components/link-button';
import { Provider } from '@ant-design/react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from "@/hooks/useThemeColor";

const ErrorFallbackComponent = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Oops!</Text>
        <Text>An unexpected error occured.</Text>
        <LinkButton href="/(login)">
          Try again
        </LinkButton>
      </View>
    </SafeAreaView>
  );
};

const antDesignDarkTheme = {
  "fill_body": "#262629",
  "fill_base": "#1a1a1a",
  "fill_tap": "#2b2b2b",
  "fill_grey": "#0a0a0a",
  "color_text_base": "#e6e6e6",
  "color_text_placeholder": "#4d4d4d",
  "border_color_base": "#2b2b2b",
  "border_color_thin": "#2b2b2b",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === 'ios';
  const bgColor = useThemeColor({}, 'background');

  return (
    <Provider
      theme={colorScheme === 'dark' ? antDesignDarkTheme : undefined}
    >
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <UserModelContextProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {isIOS ? (
              <StatusBar style="auto" />
            ) : (
              <StatusBar style="auto" backgroundColor={bgColor} translucent={false} />
            )}
            <Stack>
              <Stack.Screen name="(login)/index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </UserModelContextProvider>
      </ErrorBoundary>
    </Provider>
  );
}
