// src/app/(modals)/all-tools.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import Animated, {
  FadeInDown,
  SlideInRight,
  Layout,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { theme } from '../../constants/colors';
import {
  getAllConversions,
  ConversionMetadata,
} from '../../constants/conversionTypes';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ToolListItemProps {
  tool: ConversionMetadata;
  index: number;
  onPress: (tool: ConversionMetadata) => void;
}

const ToolListItem: React.FC<ToolListItemProps> = ({ tool, index, onPress }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    translateX.value = withSpring(5);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
  };

  // Extract color from Tailwind class
  const getColorFromClass = (className: string): string => {
    const colorMap: Record<string, string> = {
      'bg-green-500': '#10B981',
      'bg-blue-500': '#3B82F6',
      'bg-blue-600': '#2563EB',
      'bg-orange-500': '#F97316',
      'bg-purple-500': '#8B5CF6',
      'bg-gray-500': '#6B7280',
      'bg-red-500': '#EF4444',
      'bg-indigo-500': '#6366F1',
      'bg-yellow-500': '#EAB308',
      'bg-pink-500': '#EC4899',
      'bg-teal-500': '#14B8A6',
    };
    return colorMap[className] || '#3B82F6';
  };

  const accentColor = getColorFromClass(tool.color);

  return (
    <AnimatedTouchable
      entering={SlideInRight.delay(index * 50)
        .springify()
        .damping(15)}
      layout={Layout.springify()}
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(tool)}
      activeOpacity={1}
    >
      <View
        className="flex-row items-center p-4 rounded-2xl mb-3"
        style={{
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Icon */}
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
          style={{
            backgroundColor: accentColor + '15',
          }}
        >
          <MaterialCommunityIcons name={tool.icon as any} size={28} color={accentColor} />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-base font-bold flex-1" style={{ color: colors.text }}>
              {tool.label}
            </Text>
            <View
              className="px-2.5 py-1 rounded-full"
              style={{ backgroundColor: accentColor + '15' }}
            >
              <Text className="text-xs font-semibold" style={{ color: accentColor }}>
                {tool.category.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text
            className="text-sm mb-2"
            style={{ color: colors.textSecondary }}
            numberOfLines={2}
          >
            {tool.description}
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                {tool.sourceFormat}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={colors.placeholder} />
            <View className="flex-row items-center ml-4">
              <Ionicons name="document-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                {tool.targetFormat}
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color={accentColor} />
      </View>
    </AnimatedTouchable>
  );
};

interface CategorySectionProps {
  category: string;
  tools: ConversionMetadata[];
  onToolPress: (tool: ConversionMetadata) => void;
  startIndex: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  tools,
  onToolPress,
  startIndex,
}) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const [isExpanded, setIsExpanded] = useState(true);

  const getCategoryIcon = (cat: string): string => {
    const iconMap: Record<string, string> = {
      pdf: 'document-text',
      document: 'document',
      data: 'analytics',
      media: 'images',
      archive: 'archive',
    };
    return iconMap[cat] || 'folder';
  };

  const getCategoryColor = (cat: string): string => {
    const colorMap: Record<string, string> = {
      pdf: '#EF4444',
      document: '#3B82F6',
      data: '#10B981',
      media: '#8B5CF6',
      archive: '#F59E0B',
    };
    return colorMap[cat] || colors.primary;
  };

  const categoryColor = getCategoryColor(category);

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      className="mb-6"
    >
      {/* Category Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between mb-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: categoryColor + '15' }}
          >
            <Ionicons name={getCategoryIcon(category) as any} size={20} color={categoryColor} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold capitalize" style={{ color: colors.text }}>
              {category} Tools
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {tools.length} conversion{tools.length !== 1 ? 's' : ''} available
            </Text>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Tools List */}
      {isExpanded && (
        <View>
          {tools.map((tool, index) => (
            <ToolListItem
              key={tool.id}
              tool={tool}
              index={startIndex + index}
              onPress={onToolPress}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default function AllToolsModal() {
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  const allTools = getAllConversions();

  // Filter tools based on search
  const getFilteredTools = () => {
    if (!searchQuery.trim()) return allTools;

    const query = searchQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.label.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.sourceFormat.toLowerCase().includes(query) ||
        tool.targetFormat.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  };

  const filteredTools = getFilteredTools();

  // Group tools by category
  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ConversionMetadata[]>);

  const handleToolPress = (tool: ConversionMetadata) => {
    Toast.show({
      type: 'info',
      text1: 'Opening Converter 🚀',
      text2: `Preparing ${tool.label}`,
      position: 'top',
      topOffset: 60,
      visibilityTime: 2000,
    });

    // Close modal and navigate to convert screen
    router.back();
    setTimeout(() => {
      // router.push(`/(tabs)/convert?type=${tool.id}`);
    }, 500);
  };

  const handleClose = () => {
    router.back();
  };

  let currentIndex = 0;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500)}
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
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={handleClose}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.background }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                All Tools
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-4 rounded-2xl"
          style={{
            backgroundColor: isDark ? colors.background : '#F9FAFB',
            height: 48,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search tools, formats, categories..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base"
            style={{ color: colors.text }}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Tools List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {filteredTools.length > 0 ? (
          Object.entries(groupedTools).map(([category, tools]) => {
            const sectionStartIndex = currentIndex;
            currentIndex += tools.length;
            return (
              <CategorySection
                key={category}
                category={category}
                tools={tools}
                onToolPress={handleToolPress}
                startIndex={sectionStartIndex}
              />
            );
          })
        ) : (
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="items-center justify-center py-20"
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
              No tools found
            </Text>
            <Text
              className="text-sm text-center px-8"
              style={{ color: colors.textSecondary }}
            >
              Try adjusting your search to find what you're looking for
            </Text>
            <TouchableOpacity
              className="mt-6 px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
              onPress={() => setSearchQuery('')}
            >
              <Text className="text-white font-semibold">Clear Search</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Info Card */}
        {filteredTools.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            className="rounded-2xl p-5 mt-4"
            style={{
              backgroundColor: colors.primary + '15',
              borderWidth: 1,
              borderColor: colors.primary + '30',
            }}
          >
            <View className="flex-row items-start">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Ionicons name="information-circle" size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
                  Need Help?
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Tap any tool to start converting. Your files are processed securely and stored safely in the cloud.
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}