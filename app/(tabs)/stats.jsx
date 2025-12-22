import { useRouter } from 'expo-router';
import { AlignRight, ArrowLeft, Calendar, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfitAnalysis from '../../components/stats/ProfitAnalysis';
import StatsDonutChart from '../../components/stats/StatsDonutChart';
import StatsRevenueChart from '../../components/stats/StatsRevenueChart';
import TopProductsList from '../../components/stats/TopProductsList';

export default function StatsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Mois');

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

                <StatsRevenueChart />

                <StatsDonutChart />

                <TopProductsList />

                <ProfitAnalysis />

            </ScrollView>
        </View>
    );
}
