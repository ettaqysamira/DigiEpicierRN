import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductListItem from '../../components/products/ProductListItem';
import ProductsHeader from '../../components/products/ProductsHeader';
import { db } from '../../firebaseConfig';

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                productsData.push({
                    id: doc.id,
                    ...data,
                    price: data.sellingPrice?.toString() || data.price || '0.00',
                });
            });
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Listen Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View className="flex-1 bg-gray-50">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <ProductsHeader />
            </SafeAreaView>

            <View className="flex-1 px-4 pt-4">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2E7D32" />
                        <Text className="text-gray-500 mt-4">Chargement du stock...</Text>
                    </View>
                ) : products.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-lg">Aucun produit en stock</Text>
                        <TouchableOpacity
                            className="bg-green-700 px-6 py-3 rounded-xl mt-4"
                            onPress={() => router.push('/add')}
                        >
                            <Text className="text-white font-bold">Ajouter mon premier produit</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <ProductListItem product={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>

            <TouchableOpacity
                onPress={() => router.push('/add')}
                className="absolute bottom-10 right-6 bg-green-700 w-16 h-16 rounded-full items-center justify-center shadow-2xl z-50 border-4 border-white"
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
