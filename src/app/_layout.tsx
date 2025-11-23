import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';

import '../../global.css';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({

  })

  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth)
  const loadStoredTheme = useThemeStore((state) => state.loadStoredTheme)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    async function prepare() {
      try {
        await loadStoredAuth()
        await loadStoredTheme()
      } catch (error) {
        console.error("error in initialization", error)
      }
    }
    prepare()
  }, [])


  useEffect(() => {
    if ((fontsError || fontsLoaded) && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [fontsError, fontsLoaded, isLoading])

  if (!fontsError && !fontsLoaded) {
    return null
  }

  // if (isLoading) {
  //   return (
  //     <>

  //     </>
  //   )
  // }
  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right"
        }}
      >
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='(modals)' options={{
          presentation: "modal"
        }} />
        <Stack.Screen name='file/[id]' />

      </Stack>
      <Toast />
    </KeyboardProvider>
  )
}