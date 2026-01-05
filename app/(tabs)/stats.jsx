import { useRouter } from 'expo-router';
import { AlignRight, ArrowLeft, Calendar, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfitAnalysis from '../../components/stats/ProfitAnalysis';
import StatsDonutChart from '../../components/stats/StatsDonutChart';
import StatsRevenueChart from '../../components/stats/StatsRevenueChart';
import TopProductsList from '../../components/stats/TopProductsList';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebaseConfig';


export default function StatsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Mois');
    const [loading, setLoading] = useState(true);

    const [revenueChartData, setRevenueChartData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [financials, setFinancials] = useState({ revenue: 0, costs: 0, profit: 0 });

    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);
        const q = query(
            collection(db, "sales"),
            where("userId", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            let filterDate;
            if (activeTab === 'Aujourd\'hui') filterDate = startOfToday;
            else if (activeTab === 'Semaine') filterDate = startOfWeek;
            else filterDate = startOfMonth;

            let periodRevenue = 0;
            let periodCosts = 0;
            const categoryMap = {};
            const productMap = {};
            const revenueHistoryMap = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date(0));

                if (timestamp >= filterDate) {
                    const saleTotal = Number(data.total || 0);
                    periodRevenue += saleTotal;

                    const dateKey = activeTab === 'Aujourd\'hui'
                        ? `${timestamp.getHours()}h`
                        : (activeTab === 'Semaine' ? timestamp.toLocaleDateString('fr-FR', { weekday: 'short' }) : `Sem ${Math.ceil(timestamp.getDate() / 7)}`);

                    revenueHistoryMap[dateKey] = (revenueHistoryMap[dateKey] || 0) + saleTotal;

                    if (data.items && Array.isArray(data.items)) {
                        data.items.forEach(item => {
                            const qty = Number(item.quantity || 0);
                            const itemRevenue = Number(item.price || 0) * qty;
                            const itemCost = Number(item.purchasePrice || 0) * qty;
                            periodCosts += itemCost;

                            const cat = item.category || 'Autre';
                            categoryMap[cat] = (categoryMap[cat] || 0) + itemRevenue;

                            if (!productMap[item.id]) {
                                productMap[item.id] = {
                                    id: item.id,
                                    name: item.name,
                                    sold: 0,
                                    revenue: 0,
                                    image: item.image
                                };
                            }
                            productMap[item.id].sold += qty;
                            productMap[item.id].revenue += itemRevenue;
                        });
                    }
                }
            });

            const formattedRevenue = Object.entries(revenueHistoryMap).map(([label, value]) => ({ label, value }));
            setRevenueChartData(formattedRevenue);
            setTotalRevenue(periodRevenue);

            const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#607D8B", "#F44336", "#00BCD4"];
            const formattedCategories = Object.entries(categoryMap).map(([name, val], index) => ({
                name,
                value: periodRevenue > 0 ? (val / periodRevenue) * 100 : 0,
                color: colors[index % colors.length]
            })).sort((a, b) => b.value - a.value);
            setCategoryData(formattedCategories);

            const formattedProducts = Object.values(productMap)
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5)
                .map(p => ({
                    ...p,
                    price: `${p.revenue.toLocaleString()}`
                }));
            setTopProducts(formattedProducts);

            setFinancials({
                revenue: periodRevenue,
                costs: periodCosts,
                profit: periodRevenue - periodCosts
            });

            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeTab, auth.currentUser]);

    return (
        <View className="flex-1 bg-gray-50">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <View className="px-4 pt-4 pb-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Statistiques</Text>
                    <View className="flex-row">
                        <TouchableOpacity className="mr-4">
                            <AlignRight size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Share2 size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row bg-white rounded-full p-1 border border-gray-200">
                        {['Aujourd\'hui', 'Semaine', 'Mois'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                disabled={loading}
                                onPress={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-green-700' : 'bg-transparent'}`}
                            >
                                <Text className={`font-semibold ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity className="bg-white p-3 rounded-full border border-gray-200">
                        <Calendar size={20} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#2E7D32" />
                        <Text className="text-gray-500 mt-4 font-medium">Analyse des données en cours...</Text>
                    </View>
                ) : (
                    <>
                        <StatsRevenueChart data={revenueChartData} totalRevenue={totalRevenue} />
                        <StatsDonutChart data={categoryData} />
                        <TopProductsList products={topProducts} />
                        <ProfitAnalysis
                            revenue={financials.revenue}
                            costs={financials.costs}
                            profit={financials.profit}
                        />
                    </>
                )}

            </ScrollView>
        </View>
    );
}
