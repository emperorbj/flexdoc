// src/app/(tabs)/files.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { useFilesStore } from '../../../store/useFileStore';
import { theme } from '../../constants/colors';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ConvertedFile } from '../../../types/api';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type SortOption = 'recent' | 'name' | 'size';
type ViewMode = 'list' | 'grid';

interface FileCardProps {
  file: ConvertedFile;
  index: number;
  viewMode: ViewMode;
  onPress: (file: ConvertedFile) => void;
  onDownload: (file: ConvertedFile) => void;
  onShare: (file: ConvertedFile) => void;
  onDelete: (file: ConvertedFile) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  index,
  viewMode,
  onPress,
  onDownload,
  onShare,
  onDelete,
}) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

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
      pdf_to_powerpoint: { name: 'file-powerpoint', color: '#F97316' },
      extract_pdf_text: { name: 'text-box', color: '#6B7280' },
      markdown_to_pdf: { name: 'markdown', color: '#6366F1' },
    };
    return iconMap[conversionType] || { name: 'file', color: '#6B7280' };
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: colors.success,
      processing: colors.warning,
      failed: colors.error,
      pending: colors.textSecondary,
    };
    return statusMap[status] || colors.textSecondary;
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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fileIcon = getFileIcon(file.conversion_type);

  if (viewMode === 'grid') {
    return (
      <AnimatedTouchable
        entering={FadeInDown.delay(index * 100).springify()}
        layout={Layout.springify()}
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          width: '48%',
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
        onPress={() => onPress(file)}
        activeOpacity={0.8}
      >
        {/* Icon Section */}
        <View
          className="items-center justify-center py-6"
          style={{ backgroundColor: fileIcon.color + '15' }}
        >
          <MaterialCommunityIcons name={fileIcon.name as any} size={48} color={fileIcon.color} />
          {file.status !== 'completed' && (
            <View
              className="absolute top-2 right-2 px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(file.status) }}
            >
              <Text className="text-xs font-semibold text-white capitalize">
                {file.status}
              </Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View className="p-3">
          <Text
            className="text-sm font-semibold mb-1"
            style={{ color: colors.text }}
            numberOfLines={2}
          >
            {file.converted_filename}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {formatFileSize(file.file_size || 0)}
            </Text>
            <Text className="text-xs" style={{ color: colors.placeholder }}>
              {formatDate(file.created_at)}
            </Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  }

  // List view
  return (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 100).springify()}
      layout={Layout.springify()}
      className="flex-row items-center p-4 rounded-2xl mb-3"
      style={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={() => onPress(file)}
      activeOpacity={0.8}
    >
      {/* File Icon */}
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: fileIcon.color + '15' }}
      >
        <MaterialCommunityIcons name={fileIcon.name as any} size={24} color={fileIcon.color} />
      </View>

      {/* File Info */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text
            className="text-base font-semibold flex-1"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {file.converted_filename}
          </Text>
          {file.status !== 'completed' && (
            <View
              className="px-2 py-0.5 rounded-full ml-2"
              style={{ backgroundColor: getStatusColor(file.status) + '20' }}
            >
              <Text
                className="text-xs font-semibold capitalize"
                style={{ color: getStatusColor(file.status) }}
              >
                {file.status}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs mr-3" style={{ color: colors.textSecondary }}>
            {formatFileSize(file.file_size || 0)}
          </Text>
          <Text className="text-xs" style={{ color: colors.placeholder }}>
            {formatDate(file.created_at)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center ml-2">
        <TouchableOpacity
          className="w-9 h-9 rounded-full items-center justify-center mr-1"
          style={{ backgroundColor: colors.background }}
          onPress={() => onDownload(file)}
        >
          <Feather name="download" size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.background }}
          onPress={() => onShare(file)}
        >
          <Feather name="share-2" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  const { files, isLoading, fetchFiles, deleteFile } = useFilesStore();

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter and sort files
  const getFilteredFiles = () => {
    let filtered = [...files];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.converted_filename.toLowerCase().includes(query) ||
          file.original_filename.toLowerCase().includes(query) ||
          file.conversion_type.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.converted_filename.localeCompare(b.converted_filename);
        case 'size':
          return (b.file_size || 0) - (a.file_size || 0);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  };

  const filteredFiles = getFilteredFiles();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFiles();
    setIsRefreshing(false);
    Toast.show({
      type: 'success',
      text1: 'Files Updated',
      position: 'top',
      topOffset: 60,
    });
  };

  const handleFilePress = (file: ConvertedFile) => {
    router.push(`/file/${file._id}`);
  };

  const handleDownload = async (file: ConvertedFile) => {
    try {
      // Open the cloud URL in browser for download
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

  const handleShare = (file: ConvertedFile) => {
    Toast.show({
      type: 'info',
      text1: 'Sharing File',
      text2: file.converted_filename,
      position: 'top',
      topOffset: 60,
    });
  };

  const handleDelete = (file: ConvertedFile) => {
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
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              My Files
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-11 h-11 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: colors.background }}
              onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              <Ionicons
                name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-4 rounded-2xl mb-4"
          style={{
            backgroundColor: isDark ? colors.background : '#F9FAFB',
            height: 48,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search files..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base"
            style={{ color: colors.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {(['recent', 'name', 'size'] as SortOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSortBy(option)}
              className="mr-3 px-4 py-2 rounded-full"
              style={{
                backgroundColor: sortBy === option ? colors.primary : colors.background,
              }}
            >
              <Text
                className="text-sm font-semibold capitalize"
                style={{ color: sortBy === option ? '#FFFFFF' : colors.text }}
              >
                {option === 'recent' ? 'Recent' : option === 'name' ? 'Name' : 'Size'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Files List/Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-sm mt-4" style={{ color: colors.textSecondary }}>
              Loading files...
            </Text>
          </View>
        ) : filteredFiles.length > 0 ? (
          <View
            style={{
              flexDirection: viewMode === 'grid' ? 'row' : 'column',
              flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap',
              justifyContent: viewMode === 'grid' ? 'space-between' : 'flex-start',
            }}
          >
            {filteredFiles.map((file, index) => (
              <FileCard
                key={file._id}
                file={file}
                index={index}
                viewMode={viewMode}
                onPress={handleFilePress}
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ))}
          </View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="items-center justify-center py-20"
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="folder-open-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
              No files found
            </Text>
            <Text
              className="text-sm text-center px-8"
              style={{ color: colors.textSecondary }}
            >
              {searchQuery
                ? 'Try adjusting your search'
                : 'Start by converting your first file'}
            </Text>
            <TouchableOpacity
              className="mt-6 px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
              onPress={() => router.push('/(tabs)/convert')}
            >
              <Text className="text-white font-semibold">Convert File</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}