import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useShareIntent } from "expo-share-intent";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent({
    debug: true,
  });

  useEffect(() => {
    if (hasShareIntent) {
      router.replace({
        pathname: "/share-intent",
        params: { shareIntent: JSON.stringify(shareIntent) },
      });
      resetShareIntent();
    }
  }, [hasShareIntent]);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
