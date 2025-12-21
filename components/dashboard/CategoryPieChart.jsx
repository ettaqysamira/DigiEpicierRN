import { PieChart as LucidePie } from 'lucide-react-native';
import { Dimensions, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function CategoryPieChart() {
    const data = [
        {
            name: "Produits laitiers",
            population: 35.2,
            color: "#2E7D32", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
        },
        {
            name: "Boulangerie",
            population: 28.7,
            color: "#66BB6A", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
        },
        {
            name: "Fruits & Légumes",
            population: 18.5,
            color: "#FFA726", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
        },
        {
            name: "Épicerie",
            population: 12.3,
            color: "#FFB74D", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
        },
        {
            name: "Boissons",
            population: 5.3,
            color: "#8E24AA", 
            legendFontColor: "#7F7F7F",
            legendFontSize: 12
        }
    ];

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">Ventes par catégorie</Text>
                <LucidePie size={20} color="#2E7D32" />
            </View>

            <PieChart
                data={data}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute={false} 
                hasLegend={true}
            />
        </View>
    );
}
