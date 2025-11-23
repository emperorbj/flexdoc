// src/app/(tabs)/profile.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { theme } from '../../constants/colors';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SettingItemProps {
  icon: string;
  iconLibrary?: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  label: string;
  description?: string;
  value?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  iconColor?: string;
  index: number;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconLibrary = 'Ionicons',
  label,
  description,
  value,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  onPress,
  onToggle,
  iconColor,
  index,
}) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  const IconComponent =
    iconLibrary === 'MaterialCommunityIcons'
      ? MaterialCommunityIcons
      : iconLibrary === 'Feather'
      ? Feather
      : Ionicons;

  return (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 100).springify()}
      className="flex-row items-center p-4 rounded-2xl mb-3"
      style={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={!showSwitch ? onPress : undefined}
      activeOpacity={showSwitch ? 1 : 0.7}
      disabled={showSwitch}
    >
      {/* Icon */}
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: iconColor ? iconColor + '15' : colors.primary + '15' }}
      >
        <IconComponent
          name={icon as any}
          size={22}
          color={iconColor || colors.primary}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-base font-semibold mb-0.5" style={{ color: colors.text }}>
          {label}
        </Text>
        {description && (
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {description}
          </Text>
        )}
        {value && (
          <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            {value}
          </Text>
        )}
      </View>

      {/* Action */}
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ) : null}
    </AnimatedTouchable>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, index }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 150).springify()}
      className="flex-1 rounded-2xl p-4 mr-3"
      style={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: color + '15' }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
        {value}
      </Text>
      <Text className="text-xs" style={{ color: colors.textSecondary }}>
        {label}
      </Text>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const colors = isDark ? theme.dark : theme.light;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'See you soon! 👋',
              position: 'top',
              topOffset: 60,
            });
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Profile editing will be available soon',
      position: 'top',
      topOffset: 60,
    });
  };

  const handleUpgradeToPro = () => {
    Toast.show({
      type: 'info',
      text1: 'Upgrade to Pro',
      text2: 'Unlock unlimited conversions and more!',
      position: 'top',
      topOffset: 60,
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="px-6 pt-12 pb-6"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          {/* Top Actions */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-white">Profile</Text>
            <TouchableOpacity
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View className="items-center">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-5xl">{user?.first_name.charAt(0)}</Text>
            </View>
            <Text className="text-2xl font-bold text-white mb-1">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-base text-white opacity-80 mb-4">{user?.email}</Text>

            
          </View>
        </Animated.View>

        {/* Stats */}
        <View className="px-6 -mt-8 mb-6">
          <View className="flex-row">
            <StatCard
              icon="document-text"
              label="Total Files"
              value={127}
              color={colors.primary}
              index={0}
            />
            <StatCard
              icon="cloud-upload"
              label="Total Size"
              value="2.4 GB"
              color={colors.success}
              index={1}
            />
            <View className="flex-1" />
          </View>
        </View>

        {/* Settings Sections */}
        <View className="px-6">

          {/* App Settings */}
          <Text
            className="text-sm font-semibold mb-3 ml-1 mt-6"
            style={{ color: colors.textSecondary }}
          >
            APP SETTINGS
          </Text>
          <SettingItem
            icon="moon-outline"
            label="Dark Mode"
            description={isDark ? 'Dark theme enabled' : 'Light theme enabled'}
            showSwitch
            switchValue={isDark}
            onToggle={toggleTheme}
            showArrow={false}
            iconColor={colors.secondary}
            index={3}
          />
          <SettingItem
            icon="notifications-outline"
            label="Notifications"
            description="Push notifications for updates"
            showSwitch
            switchValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            showArrow={false}
            iconColor={colors.warning}
            index={4}
          />
         
          <SettingItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                position: 'top',
                topOffset: 60,
              });
            }}
            iconColor="#F59E0B"
            index={6}
          />

          {/* Storage & Data */}
          <Text
            className="text-sm font-semibold mb-3 ml-1 mt-6"
            style={{ color: colors.textSecondary }}
          >
            STORAGE & DATA
          </Text>
          <SettingItem
            icon="trash-outline"
            label="Clear Cache"
            description="Free up storage space"
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'Are you sure you want to clear cache?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    onPress: () => {
                      Toast.show({
                        type: 'success',
                        text1: 'Cache Cleared',
                        position: 'top',
                        topOffset: 60,
                      });
                    },
                  },
                ]
              );
            }}
            iconColor={colors.error}
            index={8}
          />

          {/* Support */}
          <Text
            className="text-sm font-semibold mb-3 ml-1 mt-6"
            style={{ color: colors.textSecondary }}
          >
            SUPPORT
          </Text>
          <SettingItem
            icon="help-circle-outline"
            label="Help & Support"
            description="Get help with FlexDoc"
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                position: 'top',
                topOffset: 60,
              });
            }}
            iconColor="#8B5CF6"
            index={9}
          />
          <SettingItem
            icon="information-circle-outline"
            label="About FlexDoc"
            value="Version 1.0.0"
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'FlexDoc v1.0.0',
                text2: 'Built with ❤️ by Bolaji',
                position: 'top',
                topOffset: 60,
              });
            }}
            iconColor="#06B6D4"
            index={10}
          />


          {/* Logout Button */}
          <AnimatedTouchable
            entering={FadeInDown.delay(1300).springify()}
            className="rounded-2xl p-4 mt-6 mb-8 flex-row items-center justify-center"
            style={{
              backgroundColor: colors.error + '15',
            }}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text className="text-base font-bold ml-3" style={{ color: colors.error }}>
              Logout
            </Text>
          </AnimatedTouchable>

          {/* Footer */}
          <Text
            className="text-center text-xs mb-8"
            style={{ color: colors.placeholder }}
          >
            Made with ❤️ by FlexDoc Team
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}