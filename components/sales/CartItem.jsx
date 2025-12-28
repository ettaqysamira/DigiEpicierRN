import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    const imageUrl = item.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200';

    return (
        <View className="bg-white p-3 rounded-2xl shadow-sm mb-3 flex-row items-center border border-gray-100">
            <Image
                source={{ uri: imageUrl }}
                className="w-16 h-16 rounded-xl bg-gray-50 mr-4"
            />

            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1" numberOfLines={1}>{item.name}</Text>
                <Text className="text-green-700 font-bold text-base">{item.price.toFixed(2)} DH</Text>
            </View>

            <View className="items-end">
                <View className="flex-row items-center bg-gray-100 rounded-xl p-1 mb-2">
                    <TouchableOpacity
                        onPress={onDecrement}
                        className="bg-white w-7 h-7 rounded-lg items-center justify-center shadow-sm"
                    >
                        <Minus size={14} color="#374151" />
                    </TouchableOpacity>
                    <Text className="mx-3 font-bold text-gray-800 text-sm">{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={onIncrement}
                        className="bg-green-700 w-7 h-7 rounded-lg items-center justify-center shadow-sm"
                    >
                        <Plus size={14} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onRemove} className="mr-1">
                    <Trash2 size={18} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
