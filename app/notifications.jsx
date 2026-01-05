import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCircle, Clock, Package, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationCard from '../components/notifications/NotificationCard';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function NotificationsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [counts, setCounts] = useState({ all: 0, stock: 0, expired: 0, expiring: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "products"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            const tenDaysFromNow = new Date();
            tenDaysFromNow.setDate(now.getDate() + 10);
            tenDaysFromNow.setHours(23, 59, 59, 999);

            const alerts = [];
            let stockAlerts = 0;
            let expiredAlerts = 0;
            let expiringAlerts = 0;

            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const productId = docSnap.id;

                if (data.quantity <= 5) {
                    alerts.push({
                        id: `${productId}_stock`,
                        productId: productId,
                        type: 'low_stock',
                        title: 'Stock faible',
                        time: 'Maintenant',
                        description: `Le produit "${data.name}" arrive bientôt en rupture de stock.`,
                        product: data.name,
                        detail: `Stock restant: ${data.quantity} unités`,
                        isUnread: true,
                    });
                    stockAlerts++;
                }

                if (data.expirationDate) {
                    const [day, month, year] = data.expirationDate.split('/');
                    const expDate = new Date(year, month - 1, day);

                    if (expDate < now) {
                        alerts.push({
                            id: `${productId}_expired`,
                            productId: productId,
                            type: 'expired',
                            title: 'Produit expiré',
                            time: 'Urgent',
                            description: `Le produit "${data.name}" a dépassé sa date de péremption.`,
                            product: data.name,
                            detail: `Expiré le ${data.expirationDate}`,
                            isUnread: true,
                        });
                        expiredAlerts++;
                    } else if (expDate <= tenDaysFromNow) {
                        alerts.push({
                            id: `${productId}_soon`,
                            productId: productId,
                            type: 'expiring_soon',
                            title: 'Expire bientôt',
                            time: 'Attention',
                            description: `Le produit "${data.name}" va bientôt expirer.`,
                            product: data.name,
                            detail: `Expire le ${data.expirationDate}`,
                            isUnread: true,
                        });
                        expiringAlerts++;
                    }
                }
            });

            setNotifications(alerts);
            setCounts({
                all: alerts.length,
                stock: stockAlerts,
                expired: expiredAlerts,
                expiring: expiringAlerts
            });
            setLoading(false);
        }, (error) => {
            console.error("Notifications snapshot error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredNotifications = notifications.filter(n =>
        filter === 'all' ||
        (filter === 'stock' && n.type === 'low_stock') ||
        (filter === 'expired' && n.type === 'expired') ||
        (filter === 'expiring' && n.type === 'expiring_soon')
    );

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-green-700">
            <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="bg-green-700 px-5 pb-10 pt-4 mb-4 rounded-b-[40px] shadow-2xl">
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={() => router.back()} className="mr-4">
                                <ArrowLeft size={24} color="white" />
                            </TouchableOpacity>
                            <View>
                                <View className="flex-row items-center">
                                    <Text className="text-white text-2xl font-bold mr-2">Notifications</Text>
                                    {counts.all > 0 && (
                                        <View className="bg-red-500 rounded-full px-2 py-0.5">
                                            <Text className="text-white text-xs font-bold">{counts.all}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text className="text-white/70 text-[10px] ml-1 mt-0.5 font-medium uppercase tracking-widest">Espace Gestion</Text>
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
                </View>

                <View className="px-4 -mt-8 mb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            onPress={() => setFilter('all')}
                            className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'all' ? 'bg-green-800' : 'border border-gray-200 bg-white'}`}
                        >
                            <Bell size={18} color={filter === 'all' ? 'white' : '#4B5563'} strokeWidth={filter === 'all' ? 3 : 2} />
                            <Text className={`ml-2 font-bold ${filter === 'all' ? 'text-white' : 'text-gray-500'}`}>Toutes</Text>
                            <View className={`ml-2 rounded-full px-2 py-0.5 ${filter === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <Text className={`text-[10px] font-bold ${filter === 'all' ? 'text-white' : 'text-gray-500'}`}>{counts.all}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('stock')}
                            className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'stock' ? 'bg-orange-600' : 'border border-gray-200 bg-white'}`}
                        >
                            <Package size={18} color={filter === 'stock' ? 'white' : '#F57C00'} strokeWidth={3} />
                            <Text className={`ml-2 font-bold ${filter === 'stock' ? 'text-white' : 'text-gray-500'}`}>Stock faible</Text>
                            <View className={`ml-2 rounded-full px-2 py-0.5 ${filter === 'stock' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <Text className={`text-[10px] font-bold ${filter === 'stock' ? 'text-white' : 'text-orange-600'}`}>{counts.stock}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('expiring')}
                            className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'expiring' ? 'bg-yellow-600' : 'border border-gray-200 bg-white'}`}
                        >
                            <Clock size={18} color={filter === 'expiring' ? 'white' : '#ca8a04'} strokeWidth={3} />
                            <Text className={`ml-2 font-bold ${filter === 'expiring' ? 'text-white' : 'text-gray-500'}`}>Expire bientôt</Text>
                            <View className={`ml-2 rounded-full px-2 py-0.5 ${filter === 'expiring' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <Text className={`text-[10px] font-bold ${filter === 'expiring' ? 'text-white' : 'text-yellow-600'}`}>{counts.expiring}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFilter('expired')}
                            className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full ${filter === 'expired' ? 'bg-red-600' : 'border border-gray-200 bg-white'}`}
                        >
                            <Clock size={18} color={filter === 'expired' ? 'white' : '#EF4444'} strokeWidth={3} />
                            <Text className={`ml-2 font-bold ${filter === 'expired' ? 'text-white' : 'text-gray-500'}`}>Expirés</Text>
                            <View className={`ml-2 rounded-full px-2 py-0.5 ${filter === 'expired' ? 'bg-white/20' : 'bg-gray-100'}`}>
                                <Text className={`text-[10px] font-bold ${filter === 'expired' ? 'text-white' : 'text-red-600'}`}>{counts.expired}</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View className="px-4">
                    {loading ? (
                        <View className="flex-1 items-center justify-center mt-20">
                            <ActivityIndicator size="large" color="#15803d" />
                            <Text className="text-gray-500 mt-4">Chargement des alertes...</Text>
                        </View>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                            <NotificationCard key={notif.id} {...notif} />
                        ))
                    ) : (
                        <View className="flex-1 items-center justify-center mt-20">
                            <View className="bg-gray-100 p-8 rounded-full mb-4">
                                <Bell size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-900 font-bold text-lg">Aucune notification</Text>
                            <Text className="text-gray-500 text-center px-10 mt-2">
                                Votre stock est en bon état et aucun produit n'est proche de sa date d'expiration.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
