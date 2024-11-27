import "../global.css";

import { useEffect } from 'react'
import { LightTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen } from 'expo-router'

import HomePage from './index.jsx'
import ProfilePage from "./screens/profileScreen.jsx";
import PostsPage from "./screens/posts.jsx";
import { SafeAreaView } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <ThemeProvider value={LightTheme}>
      <SafeAreaView className="flex-1">
        {/* <ProfilePage /> */}
        <PostsPage />
      </SafeAreaView>
    </ThemeProvider>
  )
}
