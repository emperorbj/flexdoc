

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  Layout,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { theme } from '../../constants/colors';
import {
  CONVERSION_METADATA,
  ConversionMetadata,
  getConversionsByCategory,
  getAllConversions,
} from '../../constants/conversionTypes';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type CategoryType = 'all' | 'pdf' | 'document' | 'data' | 'media' | 'archive';

const categories: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'pdf', label: 'PDF', icon: 'document-text' },
  { id: 'document', label: 'Documents', icon: 'document' },
  { id: 'data', label: 'Data', icon: 'analytics' },
  { id: 'media', label: 'Media', icon: 'images' },
  { id: 'archive', label: 'Archive', icon: 'archive' },
];

interface ConversionCardProps {
  conversion: ConversionMetadata;
  index: number;
  onPress: (conversion: ConversionMetadata) => void;
}

const ConversionCard: React.FC<ConversionCardProps> = ({ conversion, index, onPress }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Extract color from Tailwind class (e.g., 'bg-green-500' -> '#10B981')
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

  const accentColor = getColorFromClass(conversion.color);

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(15)}
      layout={Layout.springify()}
      style={[
        animatedStyle,
        {
          width: CARD_WIDTH,
          marginBottom: 16,
        },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(conversion)}
      activeOpacity={0.9}
    >
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Icon Section */}
        <View
          className="p-5 items-center justify-center"
          style={{
            backgroundColor: accentColor + '15',
            height: 120,
          }}
        >
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
            style={{
              backgroundColor: accentColor + '25',
            }}
          >
            <MaterialCommunityIcons name={conversion.icon as any} size={32} color={accentColor} />
          </View>

          {/* Format Badge */}
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: isDark ? colors.background : 'rgba(255,255,255,0.9)' }}
          >
            <Text className="text-xs font-semibold" style={{ color: accentColor }}>
              {conversion.sourceFormat} → {conversion.targetFormat}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="p-4">
          <Text
            className="text-base font-bold mb-1"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {conversion.label}
          </Text>
          <Text
            className="text-xs leading-4"
            style={{ color: colors.textSecondary }}
            numberOfLines={2}
          >
            {conversion.description}
          </Text>
        </View>

        {/* Action Footer */}
        <View
          className="flex-row items-center justify-between px-4 pb-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="flash" size={14} color={accentColor} />
            <Text className="text-xs ml-1 font-medium" style={{ color: accentColor }}>
              Fast
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={20} color={accentColor} />
        </View>
      </View>
    </AnimatedTouchable>
  );
};

interface CategoryChipProps {
  category: { id: CategoryType; label: string; icon: string };
  isActive: boolean;
  onPress: (id: CategoryType) => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive, onPress }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  return (
    <TouchableOpacity
      onPress={() => onPress(category.id)}
      className="mr-3 px-4 py-2.5 rounded-full flex-row items-center"
      style={{
        backgroundColor: isActive ? colors.primary : isDark ? colors.surface : '#F3F4F6',
        borderWidth: isActive ? 0 : 1,
        borderColor: colors.border,
      }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={category.icon as any}
        size={16}
        color={isActive ? '#FFFFFF' : colors.text}
      />
      <Text
        className="text-sm font-semibold ml-2"
        style={{ color: isActive ? '#FFFFFF' : colors.text }}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );
};

export default function ConvertScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;

  // Get conversions based on selected category
  const getFilteredConversions = (): ConversionMetadata[] => {
    let conversions: ConversionMetadata[] = [];

    if (selectedCategory === 'all') {
      conversions = getAllConversions();
    } else {
      conversions = getConversionsByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      conversions = conversions.filter(
        (conv) =>
          conv.label.toLowerCase().includes(query) ||
          conv.description.toLowerCase().includes(query) ||
          conv.sourceFormat.toLowerCase().includes(query) ||
          conv.targetFormat.toLowerCase().includes(query)
      );
    }

    return conversions;
  };

  const filteredConversions = getFilteredConversions();

  const handleConversionPress = (conversion: ConversionMetadata) => {
    // Navigate to file picker modal with conversion type
    router.push({
      pathname: '/(modals)/file-picker',
      params: { type: conversion.id },
    });
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
              Convert Files
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Choose your conversion tool
            </Text>
          </View>
          <TouchableOpacity
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
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
            placeholder="Search conversions..."
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

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              isActive={selectedCategory === category.id}
              onPress={setSelectedCategory}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Conversions Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
        }}
      >
        {filteredConversions.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {filteredConversions.map((conversion, index) => (
              <ConversionCard
                key={conversion.id}
                conversion={conversion}
                index={index}
                onPress={handleConversionPress}
              />
            ))}
          </View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="items-center justify-center py-20"
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
              No results found
            </Text>
            <Text className="text-sm text-center px-8" style={{ color: colors.textSecondary }}>
              Try adjusting your search or filter to find what you're looking for
            </Text>
            <TouchableOpacity
              className="mt-6 px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text className="text-white font-semibold">Clear Filters</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Results Count Badge */}
      {filteredConversions.length > 0 && (
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="absolute bottom-6 self-center px-4 py-2 rounded-full flex-row items-center"
          style={{
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text className="text-sm font-medium ml-2" style={{ color: colors.text }}>
            {filteredConversions.length} tool{filteredConversions.length !== 1 ? 's' : ''} available
          </Text>
        </Animated.View>
      )}
    </View>
  );
}