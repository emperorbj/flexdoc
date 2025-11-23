// src/app/(modals)/_layout.tsx

import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        animation: 'fade',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen 
        name="file-picker" 
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen 
        name="conversion-success"
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen 
        name="all-tools"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}