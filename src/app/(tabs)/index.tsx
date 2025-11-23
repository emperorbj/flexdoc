// src/app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Alert,
  RefreshControl
} from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { useFilesStore } from '../../../store/useFileStore';
import { theme } from '../../constants/colors';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ConversionType, CONVERSION_TYPES } from '../../constants/conversionTypes';
import { ConvertedFile } from '../../../types/api';

const { width } = Dimensions.get('window');

// Conversion tools data with Expo icons
const conversionTools = [
  { 
    id: CONVERSION_TYPES.PDF_TO_EXCEL,
    icon: 'file-excel', 
    label: 'PDF to Excel', 
    color: '#10B981', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.IMAGE_TO_PDF,
    icon: 'image-outline', 
    label: 'Image to PDF', 
    color: '#8B5CF6', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.PDF_TO_DOCX,
    icon: 'file-word', 
    label: 'PDF to Word', 
    color: '#3B82F6', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.DOCX_TO_PDF,
    icon: 'file-pdf-box', 
    label: 'Word to PDF', 
    color: '#EF4444', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.COMPRESS_PDF,
    icon: 'zip-box', 
    label: 'Compress PDF', 
    color: '#F59E0B', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.EXCEL_TO_JSON,
    icon: 'code-json', 
    label: 'Excel to JSON', 
    color: '#14B8A6', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: CONVERSION_TYPES.EXTRACT_PDF_TEXT,
    icon: 'text-box-outline', 
    label: 'Extract Text', 
    color: '#F97316', 
    library: 'MaterialCommunityIcons' 
  },
  { 
    id: 'all_tools',
    icon: 'dots-grid', 
    label: 'All Tools', 
    color: '#6366F1', 
    library: 'MaterialCommunityIcons' 
  },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ToolCardProps {
  item: typeof conversionTools[0];
  index: number;
  onPress: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ item, index, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const IconComponent = item.library === 'MaterialCommunityIcons' 
    ? MaterialCommunityIcons 
    : Ionicons;

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 100).springify()}
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
      className="items-center mb-6"
    >
      <View 
        className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
        style={{ 
          borderColor: item.color + '60',
          borderWidth: 2,
        }}
      >
        <IconComponent name={item.icon as any} size={28} color={item.color} />
      </View>
      <Text 
        className="text-xs text-center font-medium px-1"
        style={{ color: '#1F2937', maxWidth: 80 }}
        numberOfLines={2}
      >
        {item.label}
      </Text>
    </AnimatedTouchable>
  );
};

interface FileCardProps {
  file: ConvertedFile;
  index: number;
  onPress: (file: ConvertedFile) => void;
  onShare: (file: ConvertedFile) => void;
  onMore: (file: ConvertedFile) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, index, onPress, onShare, onMore }) => {
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
    };
    return iconMap[conversionType] || { name: 'file-document', color: '#6B7280' };
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

  return (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 150).springify()}
      className="flex-row items-center p-4 rounded-2xl mb-3"
      style={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
      onPress={() => onPress(file)}
    >
      {/* File Icon */}
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: fileIcon.color + '15' }}
      >
        <MaterialCommunityIcons 
          name={fileIcon.name as any} 
          size={24} 
          color={fileIcon.color} 
        />
      </View>

      {/* File Info */}
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1" style={{ color: colors.text }} numberOfLines={1}>
          {file.converted_filename}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-xs mr-3" style={{ color: colors.textSecondary }}>
            {formatDate(file.created_at)}
          </Text>
          <Text className="text-xs" style={{ color: colors.placeholder }}>
            {file.conversion_type.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center">
        <TouchableOpacity 
          className="w-9 h-9 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: colors.background }}
          onPress={() => onShare(file)}
        >
          <Feather name="share-2" size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.background }}
          onPress={() => onMore(file)}
        >
          <Feather name="more-vertical" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const isDark = useThemeStore(state => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  
  // Files store
  const { files, fetchFiles, deleteFile } = useFilesStore();

  // Get user's first name or fallback
  const firstName = user?.first_name || 'User';

  // Get recent files (first 3)
  const recentFiles = files.slice(0, 3);

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFiles();
    setIsRefreshing(false);
  };

  const handleToolPress = (toolId: string) => {
    if (toolId === 'all_tools') {
      router.push('/(tabs)/convert');
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Opening Converter 🚀',
      text2: `Preparing ${toolId} conversion`,
      position: 'top',
      topOffset: 60,
    });

    // Navigate to convert screen with pre-selected type
    // router.push(`/(tabs)/convert?type=${toolId}`);
  };

  const handleFilePress = (file: ConvertedFile) => {
    router.push(`/file/${file._id}`);
  };

  const handleShare = (file: ConvertedFile) => {
    Toast.show({
      type: 'success',
      text1: 'Sharing File 📤',
      text2: file.converted_filename,
      position: 'top',
      topOffset: 60,
    });
  };

  const handleMore = (file: ConvertedFile) => {
    Alert.alert(
      file.converted_filename,
      'Choose an action',
      [
        { 
          text: 'Download', 
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Download Started',
              text2: file.converted_filename,
              position: 'top',
              topOffset: 60,
            });
          }
        },
        { 
          text: 'Delete', 
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
          style: 'destructive' 
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNewConversion = () => {
    router.push('/(tabs)/convert');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          className="px-6 pt-12 pb-6"
          style={{ backgroundColor: isDark ? colors.surface : '#FFFFFF' }}
        >
          {/* Top Bar */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-2xl">{user?.first_name.charAt(0)}</Text>
              </View>
              <View>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Welcome back,
                </Text>
                <Text className="text-xl font-bold" style={{ color: colors.text }}>
                  {firstName}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View 
            className="flex-row items-center px-4 rounded-2xl"
            style={{ 
              backgroundColor: isDark ? colors.background : '#F9FAFB',
              height: 52,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Search files, tools..."
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
        </Animated.View>

        {/* Quick Stats Card */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="mx-6 mt-4 p-5 rounded-3xl"
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-white text-sm opacity-90 mb-1">
                Total Conversions
              </Text>
              <Text className="text-white text-4xl font-bold">{files.length}</Text>
            </View>
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Ionicons name="document-text" size={28} color="#FFFFFF" />
            </View>
          </View>
          <View className="flex-row items-center pt-3" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' }}>
            <View className="flex-row items-center flex-1">
              <Feather name="zap" size={16} color="#10B981" />
              <Text className="text-white text-sm ml-2">
                {files.length === 0 ? 'Start converting now' : 'Keep going!'}
              </Text>
            </View>
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/(tabs)/files')}>
              <Text className="text-white text-sm mr-1">View All</Text>
              <Feather name="arrow-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Conversion Tools Grid */}
        <View className="px-6 mt-8">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Quick Tools
            </Text>
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/(tabs)/convert')}>
              <Text className="text-sm mr-1" style={{ color: colors.primary }}>See All</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View 
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {conversionTools.map((tool, index) => (
              <View 
                key={tool.id}
                style={{ width: (width - 72) / 4 }}
              >
                <ToolCard item={tool} index={index} onPress={handleToolPress} />
              </View>
            ))}
          </View>
        </View>

        {/* Recent Files Section */}
        <View className="px-6 mt-6 pb-24">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Recent Files
            </Text>
            <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/(tabs)/files')}>
              <Text className="text-sm mr-1" style={{ color: colors.primary }}>View All</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recentFiles.length > 0 ? (
            recentFiles.map((file, index) => (
              <FileCard 
                key={file._id} 
                file={file} 
                index={index}
                onPress={handleFilePress}
                onShare={handleShare}
                onMore={handleMore}
              />
            ))
          ) : (
            <View className="items-center py-12">
              <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
              <Text className="text-base mt-4" style={{ color: colors.textSecondary }}>
                No files yet
              </Text>
              <Text className="text-sm mt-2" style={{ color: colors.placeholder }}>
                Start by converting your first file
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInRight.delay(800).springify()}
        className="absolute bottom-8 right-6"
        style={{
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          className="w-16 h-16 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}
          onPress={handleNewConversion}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}