import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaView, View, Text, Platform } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { Provider } from '@ant-design/react-native';
import { useEffect } from 'react';
import LinkButton from '@/src/components/link-button';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from '@/src/stores/store';

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
  const loginFromStorage = useStore((state) => state.loginFromStorage);
  
  useEffect(() => {
    loginFromStorage();
  }, []);

  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === 'ios';
  const bgColor = useThemeColor({}, 'background');

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Provider
        theme={colorScheme === 'dark' ? antDesignDarkTheme : undefined}
      >
        <GestureHandlerRootView>
          <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
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
          </ErrorBoundary>
        </GestureHandlerRootView>
      </Provider>
    </View>
  );
}
