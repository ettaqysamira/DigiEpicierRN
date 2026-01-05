import { PieChart as LucidePie } from 'lucide-react-native';
import { Dimensions, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function CategoryPieChart({ data = [] }) {
    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-8 border border-gray-100">
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-lg font-bold text-gray-800">Ventes par catégorie</Text>
                    <Text className="text-gray-400 text-xs mt-1">Répartition globale des ventes</Text>
                </View>
                <View className="bg-green-50 p-2 rounded-xl">
                    <LucidePie size={20} color="#2E7D32" />
                </View>
            </View>

            {data.length > 0 ? (
                <View className="items-center">
                    <PieChart
                        data={data}
                        width={screenWidth - 60}
                        height={180}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"0"}
                        center={[10, 0]}
                        absolute={false}
                        hasLegend={true}
                    />
                </View>
            ) : (
                <View className="h-[220px] items-center justify-center">
                    <Text className="text-gray-300 italic">Aucune donnée de vente par catégorie</Text>
                </View>
            )}
        </View>
    );
}
