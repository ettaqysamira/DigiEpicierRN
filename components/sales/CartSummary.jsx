import { ArrowRight, ShoppingBag } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CartSummary({ total, tax, onCheckout }) {
    return (
        <View className="bg-white px-6 pt-8 pb-10 rounded-t-[40px] shadow-[0_-12px_30px_rgba(0,0,0,0.06)] absolute bottom-0 left-0 right-0 border-t border-gray-50">
            <View className="space-y-4 mb-8">
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-400 text-base font-medium">Sous-total</Text>
                    <Text className="text-gray-800 font-bold text-base">{(total - tax).toFixed(2)} €</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-400 text-base font-medium">TVA (20%)</Text>
                    <Text className="text-gray-800 font-bold text-base">{tax.toFixed(2)} €</Text>
                </View>

                <View className="h-[1px] bg-gray-100 my-2" />

                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-gray-900 font-extrabold text-xl">Total TTC</Text>
                        <Text className="text-gray-400 text-xs mt-0.5">Taxes incluses</Text>
                    </View>
                    <Text className="text-green-700 font-black text-3xl">{total.toFixed(2)} €</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onCheckout}
                activeOpacity={0.8}
                className="bg-green-700 py-5 rounded-[22px] flex-row justify-center items-center shadow-xl shadow-green-900/30"
            >
                <ShoppingBag size={22} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg mx-2">Valider la commande</Text>
                <ArrowRight size={22} color="white" />
            </TouchableOpacity>
        </View>
    );
}
