// src/app/file/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { useFilesStore } from '../../../store/useFileStore';
import { theme } from '../../constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ConvertedFile } from '../../../types/api';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  index: number;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, index }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      className="flex-row items-center justify-between py-4 border-b"
      style={{ borderColor: colors.border }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          {label}
        </Text>
      </View>
      <Text
        className="text-sm font-semibold flex-1 text-right"
        style={{ color: colors.text }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </Animated.View>
  );
};

interface ActionButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  index: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  color,
  onPress,
  index,
}) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 100).springify()}
      onPress={onPress}
      className="flex-1 rounded-2xl p-4 items-center mx-1"
      style={{
        backgroundColor: color + '15',
      }}
      activeOpacity={0.8}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: color + '25' }}
      >
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text className="text-xs font-semibold" style={{ color: colors.text }}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
};

export default function FileDetailScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const { files, deleteFile } = useFilesStore();

  const params = useLocalSearchParams();
  const fileId = params.id as string;

  const [file, setFile] = useState<ConvertedFile | null>(null);

  useEffect(() => {
    const foundFile = files.find((f) => f._id === fileId);
    if (foundFile) {
      setFile(foundFile);
    }
  }, [fileId, files]);

  const getFileIcon = (conversionType: string) => {
    const iconMap: Record<string, { name: string; color: string }> = {
      pdf_to_excel: { name: 'file-excel', color: '#10B981' },
      pdf_to_csv: { name: 'file-delimited', color: '#3B82F6' },
      pdf_to_docx: { name: 'file-word', color: '#2563EB' },
      docx_to_pdf: { name: 'file-pdf-box', color: '#EF4444' },
      excel_to_json: { name: 'code-json', color: '#EAB308' },
      image_to_pdf: { name: 'file-image', color: '#8B5CF6' },
      compress_pdf: { name: 'zip-box', color: '#F97316' },
      extract_zip: { name: 'folder-zip', color: '#14B8A6' },
    };
    return iconMap[conversionType] || { name: 'file-document', color: '#6B7280' };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = async () => {
    if (!file) return;

    try {
      await Linking.openURL(file.cloud_url);
      Toast.show({
        type: 'success',
        text1: 'Opening Download',
        text2: file.converted_filename,
        position: 'top',
        topOffset: 60,
      });
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

  const handleShare = async () => {
    if (!file) return;

    try {
      await Share.share({
        message: `Check out this file: ${file.converted_filename}\n${file.cloud_url}`,
        url: file.cloud_url,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: 'Could not share file',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  const handleCopyLink = async () => {
    if (!file) return;

    // In a real app, use Clipboard API
    // await Clipboard.setStringAsync(file.cloud_url);
    Toast.show({
      type: 'success',
      text1: 'Link Copied',
      text2: 'File URL copied to clipboard',
      position: 'top',
      topOffset: 60,
    });
  };

  const handleDelete = () => {
    if (!file) return;

    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.converted_filename}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFile(file._id);
              Toast.show({
                type: 'success',
                text1: 'File Deleted',
                position: 'top',
                topOffset: 60,
              });
              router.back();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: 'Please try again',
                position: 'top',
                topOffset: 60,
              });
            }
          },
        },
      ]
    );
  };

  if (!file) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
        <Text className="text-lg mt-4" style={{ color: colors.text }}>
          File not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fileIcon = getFileIcon(file.conversion_type);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="px-6 pt-12 pb-4"
        style={{
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            File Details
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.error + '15' }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* File Preview Card */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="mx-6 mt-6 rounded-3xl overflow-hidden"
          style={{
            backgroundColor: fileIcon.color + '15',
            
          }}
        >
          <View className="items-center py-12">
            <View
              className="w-24 h-24 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: fileIcon.color + '25' }}
            >
              <MaterialCommunityIcons
                name={fileIcon.name as any}
                size={56}
                color={fileIcon.color}
              />
            </View>
            <Text
              className="text-xl font-bold text-center px-6"
              style={{ color: colors.text }}
            >
              {file.converted_filename}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <View className="flex-row">
            <ActionButton
              icon="download-outline"
              label="Download"
              color={colors.primary}
              onPress={handleDownload}
              index={0}
            />
            <ActionButton
              icon="share-outline"
              label="Share"
              color={colors.success}
              onPress={handleShare}
              index={1}
            />
            <ActionButton
              icon="link-outline"
              label="Copy Link"
              color={colors.warning}
              onPress={handleCopyLink}
              index={2}
            />
          </View>
        </View>

        {/* File Information */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="mx-6 mt-6 rounded-2xl p-4"
          style={{
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            File Information
          </Text>

          <InfoRow
            icon="document-text-outline"
            label="Original Name"
            value={file.original_filename}
            index={0}
          />
          <InfoRow
            icon="swap-horizontal-outline"
            label="Conversion Type"
            value={file.conversion_type.replace(/_/g, ' ').toUpperCase()}
            index={1}
          />
          <InfoRow
            icon="folder-outline"
            label="File Size"
            value={formatFileSize(file.file_size || 0)}
            index={2}
          />
          <InfoRow
            icon="checkmark-circle-outline"
            label="Status"
            value={file.status.charAt(0).toUpperCase() + file.status.slice(1)}
            index={3}
          />
          <InfoRow
            icon="calendar-outline"
            label="Created"
            value={formatDate(file.created_at)}
            index={4}
          />
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}