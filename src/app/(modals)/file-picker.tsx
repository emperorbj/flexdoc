
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { useFilesStore } from '../../../store/useFileStore';
import { theme } from '../../constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { ConversionType } from '../../constants/conversionTypes';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function FilePickerModal() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const { convertFile, uploadProgress } = useFilesStore();

  // Get conversion type from params
  const params = useLocalSearchParams();
  const conversionType = params.type as ConversionType;

  const handleClose = () => {
    if (isConverting) {
      Alert.alert(
        'Conversion in Progress',
        'Are you sure you want to cancel?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);

      Toast.show({
        type: 'success',
        text1: 'File Selected',
        text2: file.name,
        position: 'top',
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick file',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      Toast.show({
        type: 'error',
        text1: 'No File Selected',
        text2: 'Please select a file first',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    try {
      setIsConverting(true);

      const fileData = {
        uri: selectedFile.uri,
        name: selectedFile.name,
        mimeType: selectedFile.mimeType || 'application/octet-stream',
      };

      const convertedFile = await convertFile(fileData, conversionType);

      // Close file picker
      router.back();

      // Show success modal
      router.push({
        pathname: '/(modals)/conversion-success',
        params: { fileId: convertedFile._id },
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Conversion Failed',
        text2: error?.detail || 'Please try again',
        position: 'top',
        topOffset: 60,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
          maxHeight: '80%',
        }}
      >
        {/* Handle Bar */}
        <View className="items-center py-3">
          <View
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </View>

        {/* Header */}
        <View className="px-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Select File
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Choose a file to convert to {conversionType?.replace(/_/g, ' ')}
          </Text>
        </View>

        {/* Content */}
        <View className="p-6">
          {/* Pick File Button */}
          {!selectedFile && (
            <AnimatedTouchable
              entering={FadeInDown.delay(200).springify()}
              onPress={handlePickFile}
              className="rounded-2xl p-8 items-center justify-center mb-4"
              style={{
                backgroundColor: colors.primary + '15',
                borderWidth: 2,
                borderColor: colors.primary,
                borderStyle: 'dashed',
              }}
              activeOpacity={0.8}
            >
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
              </View>
              <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
                Tap to Browse
              </Text>
              <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                Select a file from your device
              </Text>
            </AnimatedTouchable>
          )}

          {/* Selected File Card */}
          {selectedFile && (
            <Animated.View
              entering={FadeIn.duration(400)}
              className="rounded-2xl p-4 mb-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <MaterialCommunityIcons
                    name="file-document"
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold mb-1"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {selectedFile.name}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {formatFileSize(selectedFile.size || 0)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.error + '15' }}
                >
                  <Ionicons name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              {/* Change File Button */}
              <TouchableOpacity
                onPress={handlePickFile}
                className="mt-3 py-2 rounded-lg items-center"
                style={{ backgroundColor: colors.background }}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Change File
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <Animated.View
              entering={FadeInDown.springify()}
              className="rounded-2xl p-4 mb-4"
              style={{
                backgroundColor: colors.primary + '15',
                borderWidth: 1,
                borderColor: colors.primary + '30',
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                  {uploadProgress.status === 'uploading' && 'Uploading...'}
                  {uploadProgress.status === 'converting' && 'Converting...'}
                  {uploadProgress.status === 'success' && 'Success!'}
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                  {uploadProgress.progress}%
                </Text>
              </View>
              <View
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: colors.primary,
                    width: `${uploadProgress.progress}%`,
                  }}
                />
              </View>
            </Animated.View>
          )}

          {/* Convert Button */}
          <TouchableOpacity
            onPress={handleConvert}
            disabled={!selectedFile || isConverting}
            className="rounded-2xl p-4 items-center flex-row justify-center"
            style={{
              backgroundColor:
                selectedFile && !isConverting ? colors.primary : colors.disabled,
            }}
            activeOpacity={0.8}
          >
            {isConverting ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-white text-base font-bold ml-2">Converting...</Text>
              </>
            ) : (
              <>
                <Ionicons name="swap-horizontal" size={22} color="#FFFFFF" />
                <Text className="text-white text-base font-bold ml-2">
                  Convert File
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text className="text-xs ml-2 flex-1" style={{ color: colors.textSecondary }}>
                Your file will be processed securely and stored in the cloud. You can download
                it anytime from your files.
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}