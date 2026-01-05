import { Text, View } from 'react-native';

const MAX_HEIGHT = 150;

export default function StatsRevenueChart({ data = [], totalRevenue = 0 }) {
    const maxValue = Math.max(...data.map(d => d.value), 1000);
    const getHeight = (val) => (val / maxValue) * MAX_HEIGHT;

    return (
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-6 border border-gray-100">
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Chiffre d'affaires</Text>
                    <Text className="text-gray-400 text-sm">Période sélectionnée</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-lg">
                    <Text className="text-green-800 font-bold text-lg">{totalRevenue.toLocaleString()} DH</Text>
                </View>
            </View>

            <View className="flex-row h-[180px]">
                <View className="justify-between h-[150px] mr-4 min-w-[60px]">
                    <Text className="text-gray-400 text-[10px] text-right">{maxValue.toLocaleString()} DH</Text>
                    <Text className="text-gray-400 text-[10px] text-right">{(maxValue * 0.75).toLocaleString()} DH</Text>
                    <Text className="text-gray-400 text-[10px] text-right">{(maxValue * 0.5).toLocaleString()} DH</Text>
                    <Text className="text-gray-400 text-[10px] text-right">{(maxValue * 0.25).toLocaleString()} DH</Text>
                    <Text className="text-gray-400 text-[10px] text-right">0 DH</Text>
                </View>

                <View className="flex-1 flex-row items-end justify-around h-[150px] pr-2 relative">
                    <View className="absolute inset-0 justify-between z-0 w-full">
                        {[1, 2, 3, 4, 5].map((_, i) => <View key={i} className="h-[1px] bg-gray-100 w-full" />)}
                    </View>

                    {data.length > 0 ? data.map((item, index) => (
                        <View key={index} className="items-center z-10 mx-1">
                            <View
                                style={{ height: getHeight(item.value), width: data.length > 10 ? 10 : 20 }}
                                className="bg-green-600 rounded-t-lg"
                            />
                            <Text className="text-gray-400 text-[10px] mt-2">{item.label}</Text>
                        </View>
                    )) : (
                        <View className="flex-1 items-center justify-center -mt-10">
                            <Text className="text-gray-300 italic text-sm">Aucune donnée</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
