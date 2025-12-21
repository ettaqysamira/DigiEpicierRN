import { AlertTriangle, Package } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AlertCards() {
    return (
        <View className="flex-row justify-between mb-6">
            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 mr-2 relative">
                <View className="absolute top-3 right-3 bg-red-500 w-6 h-6 rounded-full items-center justify-center border border-white">
                    <Text className="text-white text-xs font-bold">3</Text>
                </View>

                <View className="bg-red-50 p-3 rounded-full self-start mb-3">
                    <AlertTriangle size={24} color="#D32F2F" />
                </View>

                <Text className="text-gray-600 font-medium mb-1">Produits expirés</Text>
                <Text className="text-red-600 font-bold text-lg">3 articles</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 ml-2 relative">
                <View className="absolute top-3 right-3 bg-orange-500 w-6 h-6 rounded-full items-center justify-center border border-white">
                    <Text className="text-white text-xs font-bold">7</Text>
                </View>

                <View className="bg-orange-50 p-3 rounded-full self-start mb-3">
                    <Package size={24} color="#F57C00" />
                </View>

                <Text className="text-gray-600 font-medium mb-1">Stock faible</Text>
                <Text className="text-orange-500 font-bold text-lg">7 articles</Text>
            </TouchableOpacity>
        </View>
    );
}
