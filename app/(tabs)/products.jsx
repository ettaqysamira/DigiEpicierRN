import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductDetailsModal from '../../components/products/ProductDetailsModal';
import ProductListItem from '../../components/products/ProductListItem';
import ProductsHeader from '../../components/products/ProductsHeader';
import { auth, db } from '../../firebaseConfig';

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();

    const handleProductPress = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleDeleteProduct = async (productId) => {
        Alert.alert(
            "Supprimer le produit",
            "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "products", productId));
                            setIsModalVisible(false);
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("Erreur", "Impossible de supprimer le produit");
                        }
                    }
                }
            ]
        );
    };

    const handleEditProduct = (product) => {
        setIsModalVisible(false);
        router.push({
            pathname: '/add',
            params: { id: product.id }
        });
    };

    useEffect(() => {
        const q = query(collection(db, "products"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = [];
            const currentUserId = auth.currentUser?.uid;

            if (!currentUserId) {
                setLoading(false);
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === currentUserId) {
                    productsData.push({
                        id: doc.id,
                        ...data,
                        price: data.sellingPrice?.toString() || data.price || '0.00',
                    });
                }
            });
            productsData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
                return dateB - dateA;
            });
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Listen Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const categories = ['Tous', ...new Set(products.map(p => p.category).filter(Boolean))].filter(c => c !== 'Tous');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.barcode?.includes(searchQuery);
        const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="light" />
            <SafeAreaView edges={['top']} className="bg-green-700">
                <ProductsHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                />
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
                ) : filteredProducts.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-400 text-base">Aucun produit ne correspond à vos filtres</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setSelectedCategory('Tous');
                            }}
                            className="mt-4"
                        >
                            <Text className="text-green-700 font-bold">Réinitialiser les filtres</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ProductListItem
                                product={item}
                                onPress={handleProductPress}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
                    />
                )}
            </View>

            <ProductDetailsModal
                visible={isModalVisible}
                product={selectedProduct}
                onClose={() => setIsModalVisible(false)}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
            />

            <TouchableOpacity
                onPress={() => router.push('/add')}
                className="absolute bottom-6 right-6 bg-green-800 w-16 h-16 rounded-2xl items-center justify-center shadow-lg z-50 border-2 border-green-600/20"
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
