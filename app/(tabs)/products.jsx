import { Plus } from 'lucide-react-native';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductListItem from '../../components/products/ProductListItem';
import ProductsHeader from '../../components/products/ProductsHeader';

const PRODUCTS = [
    { id: '1', name: 'Produits Frais', category: 'Lentilles', price: '2.80', quantity: 12, expirationDate: '28/12/2025', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Pâtes Spaghetti 500g', category: 'Épicerie', price: '1.50', quantity: 30, expirationDate: '18/12/2026', image: 'https://images.unsplash.com/photo-1551462147-37885db25f55?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Shampoing Doux', category: 'Hygiène & Beauté', price: '4.50', quantity: 8, expirationDate: '18/12/2027', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'Bananes', category: 'Fruits & Légumes', price: '1.90', quantity: 3, expirationDate: '20/12/2025', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=200' },
    { id: '5', name: 'Eau Minérale 6x1.5L', category: 'Boissons', price: '3.60', quantity: 18, expirationDate: '18/06/2026', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&q=80&w=200' },
    { id: '6', name: 'Riz Basmati 1kg', category: 'Épicerie', price: '3.20', quantity: 15, expirationDate: '10/05/2026', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
];

export default function ProductsScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <ProductsHeader />
            </SafeAreaView>

            <View className="flex-1 px-4 pt-4">
                <FlatList
                    data={PRODUCTS}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ProductListItem product={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>

            <TouchableOpacity className="absolute bottom-6 right-6 bg-green-700 w-14 h-14 rounded-full items-center justify-center shadow-lg z-50">
                <Plus size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
