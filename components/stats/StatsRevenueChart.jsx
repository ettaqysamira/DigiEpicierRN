import { Text, View } from 'react-native';

const MAX_HEIGHT = 150;
const MAX_VALUE = 8640;

export default function StatsRevenueChart() {
    const data = [
        { label: 'S1', value: 4000 },
        { label: 'S2', value: 5800 },
        { label: 'S3', value: 6500 },
        { label: 'S4', value: 7200 },
    ];

    const getHeight = (val) => (val / MAX_VALUE) * MAX_HEIGHT;

    return (
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-6 border border-gray-100">
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Chiffre d'affaires</Text>
                    <Text className="text-gray-400 text-sm">Ce mois</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-lg">
                    <Text className="text-green-800 font-bold text-lg">23700 €</Text>
                </View>
            </View>

            <View className="flex-row h-[180px]">
                <View className="justify-between h-[150px] mr-4">
                    <Text className="text-gray-400 text-xs">8640€</Text>
                    <Text className="text-gray-400 text-xs">7200€</Text>
                    <Text className="text-gray-400 text-xs">5400€</Text>
                    <Text className="text-gray-400 text-xs">3600€</Text>
                    <Text className="text-gray-400 text-xs">1800€</Text>
                    <Text className="text-gray-400 text-xs">0€</Text>
                </View>

                <View className="flex-1 flex-row items-end justify-between h-[150px] pr-4 relative">
                    <View className="absolute inset-0 justify-between z-0 w-full">
                        {[1, 2, 3, 4, 5, 6].map((_, i) => <View key={i} className="h-[1px] bg-gray-100 w-full" />)}
                    </View>

                    {data.map((item, index) => (
                        <View key={index} className="items-center z-10">
                            <View
                                style={{ height: getHeight(item.value), width: 24 }}
                                className="bg-green-600 rounded-t-lg"
                            />
                            <Text className="text-gray-400 text-xs mt-2">{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
