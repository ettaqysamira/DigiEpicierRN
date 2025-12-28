import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Home, Package, PlusCircle, ShoppingCart, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 10, paddingBottom: 5 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Stock',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color }) => <PlusCircle size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Vente',
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
