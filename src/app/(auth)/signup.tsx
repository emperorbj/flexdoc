
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';

export default function SignupScreen() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const isDark = useThemeStore(state => state.isDark);
  const { signup, isLoading, error, clearError } = useAuthStore();
  
  const colors = isDark ? theme.dark : theme.light;
  

  const validateEmail = (email: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(email);
  };
  

  const validatePassword = (password: string): boolean => {
    return VALIDATION.PASSWORD_REGEX.test(password);
  };
  

  const validateName = (name: string): boolean => {
    return (
      name.trim().length >= VALIDATION.NAME_MIN_LENGTH &&
      name.trim().length <= VALIDATION.NAME_MAX_LENGTH
    );
  };

  const isFormValid = (): boolean => {
    return (
      validateName(firstName) &&
      validateName(lastName) &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword
    );
  };
  

  const getPasswordStrength = (): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Too short';
    if (!validatePassword(password)) return 'Weak';
    return 'Strong';
  };
  

  const getPasswordStrengthColor = (): string => {
    const strength = getPasswordStrength();
    if (strength === 'Too short' || strength === 'Weak') return colors.error;
    if (strength === 'Strong') return colors.success;
    return colors.textSecondary;
  };
  

  const handleSignup = async () => {
    clearError();
    
    // Validate all fields
    if (!validateName(firstName)) {
      Alert.alert('Invalid Name', 'First name must be 2-50 characters');
      return;
    }
    
    if (!validateName(lastName)) {
      Alert.alert('Invalid Name', 'Last name must be 2-50 characters');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
      );
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }
    
    try {

      await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      
    } catch (err: any) {
      Alert.alert(
        'Signup Failed',
        err?.detail || 'Unable to create account. Please try again.'
      );
      return
    }

      Toast.show({
      type: 'success',
      text1: 'Account Created! 🎉',
      text2: 'Please login to continue',
      position: 'top',
      visibilityTime: 4000,
      topOffset: 60,
    });
    
    // Navigate to login after short delay
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 1500);
  };


  

  return (
     <View 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        // enableOnAndroid={true}
        // extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 0}
      >
    {/* //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   className="flex-1"
    //   style={{ backgroundColor: colors.background }}
    // 
    //   <ScrollView
    //     contentContainerStyle={{ flexGrow: 1 }}
    //     keyboardShouldPersistTaps="handled"
    //   > */}
        <View className="flex-1 px-6 justify-center py-8">

          <View className="mb-8">
            <Text
              className="text-4xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Create Account
            </Text>
            <Text
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              Sign up to get started with FlexDoc
            </Text>
          </View>
          

          {error && (
            <View
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: colors.error + '20' }}
            >
              <Text style={{ color: colors.error }}>{error}</Text>
            </View>
          )}
          
          <View className="mb-4">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              First Name
            </Text>
            <TextInput
              className="p-4 rounded-lg text-base"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              returnKeyType="next"
              placeholder="John"
              placeholderTextColor={colors.placeholder}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>
        
          
          <View className="mb-4">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Last Name
            </Text>
            <TextInput
              className="p-4 rounded-lg text-base"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              placeholder="Doe"
              returnKeyType="next"
              placeholderTextColor={colors.placeholder}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>
          
     
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
              placeholder="john.doe@example.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              returnKeyType="next"
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
                placeholder="Create a strong password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!isLoading}
              />
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
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <Text
                className="text-xs mt-1"
                style={{ color: getPasswordStrengthColor() }}
              >
                Password strength: {getPasswordStrength()}
              </Text>
            )}
          </View>
          
          
          <View className="mb-6">
            <Text
              className="text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Confirm Password
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
                placeholder="Re-enter your password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="next"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <Text style={{ color: colors.primary }}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text className="text-xs mt-1" style={{ color: colors.error }}>
                Passwords do not match
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            className="p-4 rounded-lg items-center mb-6"
            style={{
              backgroundColor: isFormValid() && !isLoading
                ? colors.primary
                : colors.disabled,
            }}
            onPress={handleSignup}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
          
          <View className="flex-row justify-center items-center">
            <Text
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={isLoading}>
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.primary }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          
        </View>
        </KeyboardAwareScrollView>
    </View>
    
  );
}