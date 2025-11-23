import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { theme } from '../../constants/colors';
import { VALIDATION } from '../../constants/config';
import Toast from 'react-native-toast-message';


export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter()
    const isDark = useThemeStore((state) => state.isDark)
    const colors = isDark ? theme.dark : theme.light

    const { login, isLoading, error ,clearError} = useAuthStore()


    const validateEmail = (email: string): boolean => {
        return VALIDATION.EMAIL_REGEX.test(email)
    }

    const validateForm = (): boolean => {
        return email.trim() !== '' && password.trim() !== ''
    }

    const handleLogin = async () => {
        clearError()

        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.')
            return
        }



        try {

            await login({ email, password })
            console.log('✅ login completed successfully!');



        } catch (error: any) {
            Alert.alert('Login Failed', error.detail || 'An error occurred during login.')
            return;
        }
               Toast.show({
              type: 'success',
              text1: 'You are in! 🎉',
              text2: 'you have successfully logged in.',
              position: 'top',
              visibilityTime: 4000,
              topOffset: 60,
            });
            
            // Navigate to login after short delay
            setTimeout(() => {
              router.replace('/(auth)/login');
            }, 1500);
    }



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
            style={{ backgroundColor: colors.background }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                }}
                keyboardShouldPersistTaps='handled'
            >
                <View className='flex-1 px-6 justify-center'>
                    <View className="mb-10">
                        <Text
                            className="text-4xl font-bold mb-2"
                            style={{ color: colors.text }}
                        >
                            Welcome Back
                        </Text>
                        <Text
                            className="text-base"
                            style={{ color: colors.textSecondary }}
                        >
                            Sign in to continue to FlexDoc
                        </Text>
                    </View>

                    {error && (
                        <View
                            className="mb-4 p-4 rounded-lg"
                            style={{ backgroundColor: colors.error + '20' }}
                        >
                            <Text style={{ color: colors.error }}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text
                            className="text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Email
                        </Text>
                        <TextInput
                            className="p-4 rounded-lg text-base"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                    </View>

                    <View className="mb-2">
                        <Text
                            className="text-sm font-medium mb-2"
                            style={{ color: colors.text }}
                        >
                            Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="p-4 rounded-lg text-base"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.placeholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                            />

                            {/* Show/Hide Password Button */}
                            <TouchableOpacity
                                className="absolute right-4 top-4"
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <Text style={{ color: colors.primary }}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="p-4 rounded-lg items-center mb-6"
                        style={{
                            backgroundColor: validateForm() && !isLoading
                                ? colors.primary
                                : colors.disabled,
                        }}
                        onPress={handleLogin}
                        disabled={!validateForm() || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>


                    <View className="flex-row justify-center items-center">
                        <Text
                            className="text-base"
                            style={{ color: colors.textSecondary }}
                        >
                            Don't have an account?{' '}
                        </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity disabled={isLoading}>
                                <Text
                                    className="text-base font-semibold"
                                    style={{ color: colors.primary }}
                                >
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    )
}