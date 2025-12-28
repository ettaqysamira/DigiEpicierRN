import { DollarSign, Info, ShoppingCart } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function ProfitAnalysis() {
    return (
        <View className="bg-green-50 p-5 rounded-3xl mb-10">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-bold text-gray-900">Analyse des bénéfices</Text>
                <View className="bg-green-200 px-3 py-1 rounded-full flex-row items-center">
                    <View className="w-2 h-2 bg-green-700 rounded-full mr-1" />
                    <Text className="text-green-800 font-bold text-xs">30.3%</Text>
                </View>
            </View>

            <View className="flex-row justify-between mb-6">
                <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm">
                    <View className="bg-green-100 w-10 h-10 rounded-xl items-center justify-center mb-3">
                        <DollarSign size={20} color="#2E7D32" />
                    </View>
                    <Text className="text-gray-500 text-sm mb-1">Chiffre d'affaires</Text>
                    <Text className="text-green-800 font-bold text-xl">8450 DH</Text>
                </View>

                <View className="bg-white p-4 rounded-2xl w-[48%] shadow-sm">
                    <View className="bg-orange-100 w-10 h-10 rounded-xl items-center justify-center mb-3">
                        <ShoppingCart size={20} color="#F57C00" />
                    </View>
                    <Text className="text-gray-500 text-sm mb-1">Coûts d'achat</Text>
                    <Text className="text-orange-600 font-bold text-xl">5890 DH</Text>
                </View>
            </View>

            <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-900 font-bold text-base">Bénéfice net</Text>
                    <Text className="text-green-800 font-bold text-2xl">2560 DH</Text>
                </View>

                <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <View className="h-full bg-green-500 w-[30%]" />
                </View>

                <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-sm">Marge bénéficiaire</Text>
                    <Text className="text-gray-900 font-bold text-sm">30.3%</Text>
                </View>
            </View>

            <View className="flex-row items-start">
                <Info size={16} color="#4B5563" className="mt-1 mr-2" />
                <Text className="text-gray-500 text-xs flex-1 leading-5">Basé sur les ventes de ce mois. Marge recommandée : 25-35%</Text>
            </View>
        </View>
    );
}
