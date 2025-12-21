import { Receipt } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const sales = [
    { id: 1, customer: "Vente1", items: 2, amount: "400 DH", time: "Il y a 15min" },
    { id: 2, customer: "Vente2", items: 3, amount: "800 DH", time: "Il y a 32min" },
    { id: 3, customer: "Vente3", items: 2, amount: "800 DH", time: "Il y a 1h" },
];

export default function RecentSales() {
    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">Ventes récentes</Text>
                <TouchableOpacity className="bg-green-50 px-3 py-1 rounded-full">
                    <Text className="text-green-700 font-semibold text-xs">Voir tout</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-green-800 text-lg font-bold mb-4">24 ventes aujourd'hui</Text>

            {sales.map((sale, index) => (
                <View key={sale.id} className={`flex-row items-center py-3 ${index !== sales.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <View className="bg-green-50 p-3 rounded-xl mr-3">
                        <Receipt size={20} color="#2E7D32" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-800">{sale.customer}</Text>
                        <Text className="text-gray-500 text-xs">{sale.items} articles</Text>
                    </View>
                    <View className="items-end">
                        <Text className="font-bold text-green-700">{sale.amount}</Text>
                        <Text className="text-gray-400 text-xs">{sale.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}
