import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ArrowLeft, Calendar, ChevronRight, Receipt } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebaseConfig';

const TABS = [
    { id: 'today', label: "Aujourd'hui" },
    { id: 'week', label: 'Semaine' },
    { id: 'month', label: 'Mois' },
];

export default function SalesHistoryScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('today');
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "sales"),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const salesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSales(salesData);
            } catch (err) {
                console.error("Error processing sales snapshots:", err);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Error fetching sales history:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const parseDate = (ts) => {
        if (!ts) return null;
        if (ts.toDate) return ts.toDate();
        if (ts.seconds) return new Date(ts.seconds * 1000);
        const d = new Date(ts);
        return isNaN(d) ? null : d;
    };

    const filteredSales = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const day = now.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return sales.filter(sale => {
            const saleDate = parseDate(sale.timestamp);
            if (!saleDate) return false;

            if (activeTab === 'today') return saleDate >= startOfToday;
            if (activeTab === 'week') return saleDate >= startOfWeek;
            if (activeTab === 'month') return saleDate >= startOfMonth;
            return true;
        });
    }, [activeTab, sales]);

    const formatTime = (ts) => {
        const date = parseDate(ts);
        return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
    };

    const formatDate = (ts) => {
        const date = parseDate(ts);
        return date ? date.toLocaleDateString() : "";
    };

    const calculateTotal = (data) => {
        return data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    };

    const currentTabLabel = TABS.find(t => t.id === activeTab)?.label || "Sélection";

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-green-700 px-5 pt-4 pb-8 rounded-b-[32px] shadow-lg">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/10 p-2 rounded-full mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Historique des ventes</Text>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-white/10 p-1.5 rounded-2xl">
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 items-center rounded-xl ${activeTab === tab.id ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Text className={`font-bold ${activeTab === tab.id ? 'text-green-800' : 'text-white/70'}`}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Summary Info */}
            <View className="px-5 -mt-4 mb-4">
                <View className="bg-white p-5 rounded-3xl shadow-xl flex-row justify-between items-center border border-gray-100">
                    <View className="flex-1">
                        <Text className="text-gray-500 font-medium mb-1">Total {currentTabLabel}</Text>
                        <Text className="text-2xl font-black text-green-700">{calculateTotal(filteredSales).toLocaleString()} DH</Text>
                    </View>
                    <View className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                        <Text className="text-green-700 font-bold">{filteredSales.length} ventes</Text>
                    </View>
                </View>
            </View>

            {/* List */}
            <View className="flex-1 px-5">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#15803d" />
                        <Text className="text-gray-500 mt-4">Chargement de l'historique...</Text>
                    </View>
                ) : filteredSales.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <View className="bg-gray-100 p-8 rounded-full mb-4">
                            <Calendar size={48} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-400 text-lg font-bold">Aucune vente trouvée</Text>
                        <Text className="text-gray-400 text-sm mt-1">Les ventes pour cette période s'afficheront ici.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredSales}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row items-center border border-gray-50 mb-3 shadow-sm active:bg-gray-50">
                                <View className="bg-green-50 p-3 rounded-xl mr-4">
                                    <Receipt size={22} color="#15803d" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="font-bold text-gray-900 text-base">Vente #{item.id ? item.id.slice(-6).toUpperCase() : '???'}</Text>
                                        <Text className="text-green-700 font-black text-lg">{Number(item.total || 0).toLocaleString()} DH</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-gray-500 text-xs mr-2">{item.items?.length || 0} articles</Text>
                                        <View className="w-1 h-1 bg-gray-300 rounded-full mr-2" />
                                        <Text className="text-gray-400 text-xs">{formatDate(item.timestamp)} • {formatTime(item.timestamp)}</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color="#D1D5DB" />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
