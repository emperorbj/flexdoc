import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AuthLayout () {

    const router = useRouter()
    const segments = useSegments()
    const  isAuthenticated = useAuthStore((state)=>state.isAuthenticated)

    useEffect(()=>{
        const inAuthGroup = segments[0] === '(auth)'
        if(inAuthGroup && isAuthenticated){
            router.replace('/(tabs)')
        }
    },[isAuthenticated,router,segments])


    return (
        <Stack
        screenOptions={{
            headerShown:false,
            animation:'slide_from_right'
        }}
        >

        <Stack.Screen name='login'/>
        <Stack.Screen name='signup'/>
        <Stack.Screen name='onboarding'/>

        </Stack>
    )
}