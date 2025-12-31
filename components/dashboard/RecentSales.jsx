import { useRouter } from 'expo-router';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Receipt } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function RecentSales() {
    const router = useRouter();
    const [recentSales, setRecentSales] = useState([]);
    const [todayCount, setTodayCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query for the 5 most recent sales
        const recentQuery = query(
            collection(db, "sales"),
            orderBy("timestamp", "desc"),
            limit(5)
        );

        const unsubscribeRecent = onSnapshot(recentQuery, (snapshot) => {
            const salesData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    items: data.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
                    amount: `${data.total || 0} DH`,
                    time: formatRelativeTime(data.timestamp),
                    rawTimestamp: data.timestamp
                };
            });
            setRecentSales(salesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching recent sales:", error);
            setLoading(false);
        });

        // Query for today's sales count
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayQuery = query(
            collection(db, "sales"),
            where("timestamp", ">=", startOfDay)
        );

        const unsubscribeToday = onSnapshot(todayQuery, (snapshot) => {
            setTodayCount(snapshot.size);
        });

        return () => {
            unsubscribeRecent();
            unsubscribeToday();
        };
    }, []);

    const formatRelativeTime = (timestamp) => {
        if (!timestamp) return "...";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "À l'instant";
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)}min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <View className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-gray-100 items-center justify-center">
                <ActivityIndicator color="#15803d" />
                <Text className="text-gray-500 mt-2 text-sm">Chargement des ventes...</Text>
            </View>
        );
    }

    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">Ventes récentes</Text>
                <TouchableOpacity
                    onPress={() => router.push('/sales-history')}
                    className="bg-green-50 px-4 py-2 rounded-xl"
                >
                    <Text className="text-green-700 font-bold text-xs">Voir tout</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-green-800 text-lg font-bold mb-4">
                {todayCount} {todayCount > 1 ? 'ventes aujourd\'hui' : 'vente aujourd\'hui'}
            </Text>

            {recentSales.length === 0 ? (
                <View className="py-6 items-center">
                    <Text className="text-gray-400">Aucune vente enregistrée</Text>
                </View>
            ) : (
                recentSales.map((sale, index) => (
                    <View key={sale.id} className={`flex-row items-center py-3 ${index !== recentSales.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <View className="bg-green-50 p-3 rounded-xl mr-3">
                            <Receipt size={20} color="#2E7D32" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800">Vente #{sale.id.slice(-4).toUpperCase()}</Text>
                            <Text className="text-gray-500 text-xs">{sale.items} articles</Text>
                        </View>
                        <View className="items-end">
                            <Text className="font-bold text-green-700">{sale.amount}</Text>
                            <Text className="text-gray-400 text-xs">{sale.time}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}
