import { BarChart2 } from 'lucide-react-native';
import { Dimensions, Text, View } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function SalesChart() {
    const maxValue = 816;
    const data = [
        { label: "Lun", value: 250, color: "#2E7D32" },
        { label: "Mar", value: 320, color: "#81C784" }, 
        { label: "Mer", value: 180, color: "#FFA726" }, 
        { label: "Jeu", value: 400, color: "#2E7D32" }, 
        { label: "Ven", value: 500, color: "#81C784" }, 
        { label: "Sam", value: 700, color: "#81C784" }, 
        { label: "Dim", value: 300, color: "#A5D6A7" }, 
    ];

    const MAX_BAR_HEIGHT = 140;
    const getHeight = (value) => (value / maxValue) * MAX_BAR_HEIGHT;

    return (
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100">
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-lg font-bold text-gray-800">Ventes de la semaine</Text>
                    <Text className="text-gray-500 font-medium mt-1">816 DH</Text>
                </View>
                <View className="mt-1">
                    <BarChart2 size={24} color="#2E7D32" />
                </View>
            </View>
            <View className="flex-row items-end h-[180px] w-full pt-2">
                <View className="absolute left-0 top-0 bottom-6 justify-between h-full z-10 w-full">
                    <View className="border-b border-gray-100 w-full mb-auto"><Text className="text-gray-400 text-xs mb-1">816 DH</Text></View>
                    <View className="border-b border-gray-100 w-full mb-auto"><Text className="text-gray-400 text-xs mb-1">408  DH</Text></View>
                    <View className="border-b border-gray-100 w-full"><Text className="text-gray-400 text-xs mb-1">0 DH</Text></View>
                </View>

                <View className="flex-row justify-between w-full h-full items-end pl-8 pb-6 z-20">
                    {data.map((item, index) => (
                        <View key={index} className="items-center flex-1 h-full justify-end">
                            <View
                                style={{
                                    height: getHeight(item.value),
                                    backgroundColor: item.color,
                                    width: 18, 
                                    borderRadius: 6,
                                    marginBottom: 8
                                }}
                            />
                            <Text className="text-gray-500 text-[10px]">{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
