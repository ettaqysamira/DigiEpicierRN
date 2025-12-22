import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCircle, Package, Receipt, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import NotificationCard from '../components/notifications/NotificationCard';

const NOTIFICATIONS = [
    {
        id: '1',
        type: 'expired',
        title: 'Produit expiré',
        time: '41j',
        description: 'Le yaourt nature Danone a dépassé sa date de péremption.',
        product: 'Yaourt nature Danone 125g',
        detail: 'Expiré depuis 3 jours',
        isUnread: true,
    },
    {
        id: '2',
        type: 'low_stock',
        title: 'Stock faible',
        time: '41j',
        description: "Le pain de mie Harry's arrive bientôt en rupture de stock.",
        product: "Pain de mie Harry's 500g",
        detail: 'Stock restant: 3 unités',
        isUnread: true,
    },
    {
        id: '3',
        type: 'expired',
        title: 'Produit expiré',
        time: '42j',
        description: 'Le jambon poly dépassé sa date de péremption.',
        product: 'Jambon poly 200g',
        detail: 'Expiré depuis 1 jour',
        isUnread: false,
    }
];

export default function NotificationsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="bg-green-700">
                <View className="px-5 pt-2 pb-6 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-row items-center">
                            <Text className="text-white text-2xl font-bold mr-2">Notifications</Text>
                            <View className="bg-red-500 rounded-full px-2 py-0.5">
                                <Text className="text-white text-xs font-bold">5</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity className="mr-5">
                            <CheckCircle size={24} color="white" opacity={0.9} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Settings size={22} color="white" opacity={0.9} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <View className="py-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                    <TouchableOpacity
                        onPress={() => setFilter('all')}
                        className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'all' ? 'bg-green-800' : 'border border-gray-200 bg-white'}`}
                    >
                        <Bell size={18} color={filter === 'all' ? 'white' : '#4B5563'} strokeWidth={filter === 'all' ? 3 : 2} />
                        <Text className={`ml-2 font-bold ${filter === 'all' ? 'text-white' : 'text-gray-500'}`}>Toutes</Text>
                        <View className={`ml-2 bg-gray-100/20 rounded-full px-2 py-0.5 ${filter === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <Text className={`text-[10px] font-bold ${filter === 'all' ? 'text-white' : 'text-gray-500'}`}>8</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setFilter('stock')}
                        className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'stock' ? 'bg-orange-600' : 'border border-gray-200 bg-white'}`}
                    >
                        <Package size={18} color={filter === 'stock' ? 'white' : '#F57C00'} strokeWidth={3} />
                        <Text className={`ml-2 font-bold ${filter === 'stock' ? 'text-white' : 'text-gray-500'}`}>Stock</Text>
                        <View className={`ml-2 bg-gray-100/20 rounded-full px-2 py-0.5 ${filter === 'stock' ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <Text className={`text-[10px] font-bold ${filter === 'stock' ? 'text-white' : 'text-orange-600'}`}>4</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setFilter('debt')}
                        className={`flex-row items-center mr-4 px-5 py-2.5 rounded-full ${filter === 'debt' ? 'bg-blue-600' : 'border border-gray-200 bg-white'}`}
                    >
                        <Receipt size={18} color={filter === 'debt' ? 'white' : '#2563EB'} strokeWidth={3} />
                        <Text className={`ml-2 font-bold ${filter === 'debt' ? 'text-white' : 'text-gray-500'}`}>Créances</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-4 mb-4" showsVerticalScrollIndicator={false}>
                {NOTIFICATIONS
                    .filter(n => filter === 'all' || (filter === 'stock' && n.type === 'low_stock') || (filter === 'expired' && n.type === 'expired'))
                    .map((notif) => (
                        <NotificationCard key={notif.id} {...notif} />
                    ))}
            </ScrollView>
        </View>
    );
}
