import { ArrowUpRight } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const products = [
    { id: 1, name: 'Bananes Bio', sold: 156, price: '234 DH', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Pain de Campagne', sold: 142, price: '213 DH', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Lait Entier', sold: 119, price: '190 DH', image: 'https://images.unsplash.com/photo-1563636697336-398ec25f560e?auto=format&fit=crop&q=80&w=200' },
];

export default function TopProductsList({ products = [] }) {
    if (products.length === 0) {
        return (
            <View className="mb-6 p-10 bg-white rounded-3xl items-center justify-center border border-dashed border-gray-200">
                <Text className="text-gray-400 font-medium">Aucun produit vendu sur cette période</Text>
            </View>
        );
    }

    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center px-1 mb-4">
                <Text className="text-lg font-bold text-gray-900">Produits les plus vendus</Text>
                <TouchableOpacity><Text className="text-green-600 font-medium">Voir tout</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-1">
                {products.map((item, index) => (
                    <View key={`${item.id}-${index}`} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mr-4 w-40">
                        <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} className="w-full h-24 rounded-2xl mb-3 bg-gray-50" resizeMode="contain" />
                        <Text className="font-bold text-gray-900 mb-1" numberOfLines={1}>{item.name}</Text>
                        <View className="flex-row items-center mb-1">
                            <ArrowUpRight size={14} color="#4CAF50" />
                            <Text className="text-gray-500 text-xs ml-1">{item.sold} vendus</Text>
                        </View>
                        <Text className="text-green-700 font-bold">{item.price} DH</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
