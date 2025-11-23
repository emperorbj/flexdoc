

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { useFilesStore } from '../../../store/useFileStore';
import { theme } from '../../constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ConversionSuccessModal() {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const { files } = useFilesStore();

  const params = useLocalSearchParams();
  const fileId = params.fileId as string;

  // Find the converted file
  const convertedFile = files.find((f) => f._id === fileId);

  const handleDownload = async () => {
    if (!convertedFile) return;

    try {
      await Linking.openURL(convertedFile.cloud_url);
      Toast.show({
        type: 'success',
        text1: 'Opening Download',
        text2: 'Your file is ready',
        position: 'top',
        topOffset: 60,
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: 'Could not open file',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  const handleViewFile = () => {
    router.back();
    router.push(`/file/${fileId}`);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={handleClose}
      />

      <Animated.View
        entering={SlideInDown.springify()}
        className="rounded-t-3xl overflow-hidden"
        style={{
          backgroundColor: colors.background,
        }}
      >
        {/* Success Animation Container */}
        <View className="items-center pt-8 pb-6">
          {/* Success Checkmark */}
          <Animated.View
            entering={BounceIn.delay(200).springify()}
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: colors.success + '20',
            }}
          >
            <Animated.View
              entering={ZoomIn.delay(400).springify()}
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.success }}
            >
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>

          {/* Success Text Placeholder - Replace with Lottie later */}
          <Animated.View entering={FadeIn.delay(600)} className="items-center">
            <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
              🎉 Success!
            </Text>
            <Text className="text-base text-center px-6" style={{ color: colors.textSecondary }}>
              Your file has been converted successfully
            </Text>
          </Animated.View>
        </View>

        {/* File Info */}
        {convertedFile && (
          <Animated.View
            entering={FadeIn.delay(800)}
            className="mx-6 mb-6 p-4 rounded-2xl"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '15' }}
              >
                <Ionicons name="document-text" size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-semibold mb-1"
                  style={{ color: colors.text }}
                  numberOfLines={1}
                >
                  {convertedFile.converted_filename}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  {convertedFile.conversion_type.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.success + '20' }}
              >
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              </View>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View className="px-6 pb-8">
          {/* Download Button */}
          <AnimatedTouchable
            entering={FadeIn.delay(1000)}
            onPress={handleDownload}
            className="rounded-2xl p-4 items-center flex-row justify-center mb-3"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
          >
            <Ionicons name="download-outline" size={22} color="#FFFFFF" />
            <Text className="text-white text-base font-bold ml-2">
              Download Now
            </Text>
          </AnimatedTouchable>

          {/* View Details Button */}
          <AnimatedTouchable
            entering={FadeIn.delay(1100)}
            onPress={handleViewFile}
            className="rounded-2xl p-4 items-center flex-row justify-center mb-3"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={22} color={colors.text} />
            <Text className="text-base font-bold ml-2" style={{ color: colors.text }}>
              View Details
            </Text>
          </AnimatedTouchable>

          {/* Close Button */}
          <AnimatedTouchable
            entering={FadeIn.delay(1200)}
            onPress={handleClose}
            className="items-center py-3"
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
              Done
            </Text>
          </AnimatedTouchable>
        </View>

        {/* Bottom Safe Area */}
        <View style={{ height: 20 }} />
      </Animated.View>
    </View>
  );
}