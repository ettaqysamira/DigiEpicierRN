import { ArrowUpRight } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const products = [
    { id: 1, name: 'Bananes Bio', sold: 156, price: '234 DH', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Pain de Campagne', sold: 142, price: '213 DH', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Lait Entier', sold: 119, price: '190 DH', image: 'https://images.unsplash.com/photo-1563636697336-398ec25f560e?auto=format&fit=crop&q=80&w=200' },
];

export default function TopProductsList() {
    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center px-1 mb-4">
                <Text className="text-lg font-bold text-gray-900">Produits les plus vendus</Text>
                <TouchableOpacity><Text className="text-green-600 font-medium">Voir tout</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-1">
                {products.map((item) => (
                    <View key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mr-4 w-40">
                        <Image source={{ uri: item.image }} className="w-full h-24 rounded-2xl mb-3 bg-gray-100" />
                        <Text className="font-bold text-gray-900 mb-1" numberOfLines={1}>{item.name}</Text>
                        <View className="flex-row items-center mb-1">
                            <ArrowUpRight size={14} color="#4CAF50" />
                            <Text className="text-gray-500 text-xs ml-1">{item.sold} vendus</Text>
                        </View>
                        <Text className="text-green-700 font-bold">{item.price}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
