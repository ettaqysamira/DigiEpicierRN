import { BarChart2 } from 'lucide-react-native';
import { Dimensions, Text, View } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function SalesChart({ data = [] }) {
    const rawMax = Math.max(...data.map(d => d.value), 0);
    const maxValue = rawMax > 0 ? Math.ceil(rawMax * 1.2) : 500;

    const totalWeekly = data.reduce((acc, curr) => acc + curr.value, 0);

    const MAX_BAR_HEIGHT = 140;
    const getHeight = (value) => (value / maxValue) * MAX_BAR_HEIGHT;

    return (
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-4 border border-gray-100">
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-lg font-bold text-gray-800">Ventes de la semaine</Text>
                    <Text className="text-green-700 font-extrabold text-2xl mt-1">{totalWeekly.toLocaleString()} DH</Text>
                </View>
                <View className="bg-green-50 p-2 rounded-xl">
                    <BarChart2 size={24} color="#2E7D32" />
                </View>
            </View>

            <View className="flex-row items-end h-[180px] w-full pt-2">
                <View className="absolute left-0 top-0 bottom-6 justify-between h-full z-10 w-full">
                    <View className="border-b border-gray-50 w-full pb-1 flex-row justify-between items-end">
                        <Text className="text-gray-300 text-[10px] font-bold">{maxValue} DH</Text>
                    </View>
                    <View className="border-b border-gray-50 w-full pb-1 flex-row justify-between items-end">
                        <Text className="text-gray-300 text-[10px] font-bold">{Math.round(maxValue / 2)} DH</Text>
                    </View>
                    <View className="border-b border-gray-200 w-full pb-1 flex-row justify-between items-end">
                        <Text className="text-gray-400 text-[10px] font-bold">0 DH</Text>
                    </View>
                </View>
                <View className="flex-row justify-between w-full h-full items-end pl-10 pb-6 z-20">
                    {data.length > 0 ? data.map((item, index) => (
                        <View key={index} className="items-center flex-1 h-full justify-end">
                            {item.value > 0 && (
                                <View className="absolute -top-6 bg-gray-800 px-1.5 py-0.5 rounded-md mb-1">
                                    <Text className="text-white text-[8px] font-bold">{item.value}</Text>
                                </View>
                            )}
                            <View
                                style={{
                                    height: getHeight(item.value) || 2, 
                                    backgroundColor: item.color,
                                    width: 20,
                                    borderRadius: 6,
                                    marginBottom: 8
                                }}
                            />
                            <Text className={`text-[10px] font-bold ${index === 6 ? 'text-green-700' : 'text-gray-400'}`}>
                                {item.label}
                            </Text>
                        </View>
                    )) : (
                        <View className="flex-1 items-center justify-center pb-10">
                            <Text className="text-gray-300 italic">Aucune donnée cette semaine</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
