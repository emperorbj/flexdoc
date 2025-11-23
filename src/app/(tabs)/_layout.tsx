


    // const router = useRouter()
    // const segments = useSegments()
    // const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)

    // useEffect(()=>{
    //     const inTabsGroup = segments[0] === '(tabs)'
    //     if(inTabsGroup && !isAuthenticated){
    //         router.replace('(auth)/login')
    //     }
    // },[isAuthenticated,segments])

    // if(!isAuthenticated){
    //     return null
    // }
// src/app/(tabs)/_layout.tsx
// src/app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../../store/useThemeStore';
import { theme } from '../../constants/colors';
import { Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom animated tab bar icon
interface AnimatedTabIconProps {
  icon: string;
  library?: 'Ionicons' | 'MaterialCommunityIcons';
  color: string;
  focused: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ 
  icon, 
  library = 'Ionicons',
  color, 
  focused 
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.1, { damping: 10 });
      rotate.value = withTiming('360deg', { duration: 300 });
    } else {
      scale.value = withSpring(1);
      rotate.value = '0deg';
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: rotate.value }
    ],
  }));

  const IconComponent = library === 'MaterialCommunityIcons' 
    ? MaterialCommunityIcons 
    : Ionicons;

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent 
        name={icon as any} 
        size={24} 
        color={color}
      />
    </Animated.View>
  );
};

export default function TabsLayout() {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? theme.dark : theme.light;
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          // Dynamic height based on safe area
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="convert"
        options={{
          title: 'Convert',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={focused ? 'file-document-refresh' : 'file-document-refresh-outline'}
              library="MaterialCommunityIcons"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={focused ? 'folder' : 'folder-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={focused ? 'person' : 'person-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}