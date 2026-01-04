import { CameraView, useCameraPermissions } from 'expo-camera';
import { addDoc, collection, doc, getDocs, increment, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Banknote, Barcode, CreditCard, Landmark, Search, ShoppingCart, Smartphone, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Alert as RNAlert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig';

import CartItem from '../../components/sales/CartItem';
import CartSummary from '../../components/sales/CartSummary';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Espèces', icon: Banknote },
    { id: 'card', label: 'Carte', icon: CreditCard },
    { id: 'wallet', label: 'Mobile', icon: Smartphone },
    { id: 'bank', label: 'Virement', icon: Landmark },
];

export default function SalesScreen() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [searchQuery, setSearchQuery] = useState('');
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [isProcessing, setIsProcessing] = useState(false);

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                if (newQty > item.stock) {
                    RNAlert.alert("Stock insuffisant", `Il ne reste que ${item.stock} unités.`);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id);
            if (existingIndex !== -1) {
                const existingItem = prev[existingIndex];
                if (existingItem.quantity >= product.quantity) {
                    RNAlert.alert("Stock insuffisant", "Toute la quantité disponible est déjà dans le panier.");
                    return prev;
                }
                const newCart = [...prev];
                newCart[existingIndex] = { ...existingItem, quantity: existingItem.quantity + 1 };
                return newCart;
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: 1,
                stock: product.quantity,
                image: product.image
            }];
        });
    };

    const findProduct = async (code) => {
        try {
            const q = query(
                collection(db, "products"),
                where("barcode", "==", code),
                where("userId", "==", auth.currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                const product = { id: docSnap.id, ...docSnap.data() };
                product.price = product.sellingPrice || product.price || 0;
                addToCart(product);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Search Error:", error);
            return false;
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const found = await findProduct(searchQuery.trim());
        if (!found) {
            RNAlert.alert("Non trouvé", "Aucun produit trouvé avec ce code.");
        }
        setSearchQuery('');
    };

    const handleBarCodeScanned = async ({ data }) => {
        if (scanned) return;
        setScanned(true);
        setIsScannerVisible(false);
        const found = await findProduct(data);
        if (!found) {
            RNAlert.alert("Non trouvé", "Produit non répertorié dans le stock.");
        }
        setScanned(false);
    };

    const openScanner = async () => {
        if (!permission || !permission.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                RNAlert.alert("Erreur", "Accès à la caméra requis.");
                return;
            }
        }
        setScanned(false);
        setIsScannerVisible(true);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);
        try {
            const total = calculateTotal();
            const tax = total * 0.20;

            const saleData = {
                items: cart,
                total,
                tax,
                paymentMethod,
                timestamp: serverTimestamp(),
                userId: auth.currentUser.uid,
            };
            await addDoc(collection(db, "sales"), saleData);

            for (const item of cart) {
                const productRef = doc(db, "products", item.id);
                await updateDoc(productRef, {
                    quantity: increment(-item.quantity)
                });
            }

            RNAlert.alert("Succès", "La vente a été enregistrée avec succès !");
            setCart([]);
        } catch (error) {
            console.error("Checkout Error:", error);
            RNAlert.alert("Erreur", "Une erreur est survenue lors de la validation.");
        } finally {
            setIsProcessing(false);
        }
    };

    const total = calculateTotal();
    const tax = total * 0.20;

    return (
        <View className="flex-1 bg-gray-50">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <View className="px-5 pt-2 pb-6 rounded-b-[32px]">
                    <Text className="text-white text-2xl font-bold mb-5">Caisse / Vente</Text>

                    <View className="flex-row items-center">
                        <View className="flex-1 bg-white/10 flex-row items-center rounded-2xl px-4 h-14 border border-white/20">
                            <Search size={20} color="white" opacity={0.6} />
                            <TextInput
                                placeholder="Chercher par code..."
                                className="flex-1 ml-3 text-white text-base"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                keyboardType="numeric"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={openScanner}
                            className="bg-white ml-3 w-14 h-14 items-center justify-center rounded-2xl shadow-sm"
                        >
                            <Barcode size={24} color="#15803d" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <View className="flex-1 px-4 pt-6">
                <View className="flex-row justify-between items-center mb-4 px-1">
                    <Text className="text-gray-900 font-bold text-lg">Commande ({cart.length})</Text>
                    {cart.length > 0 && (
                        <TouchableOpacity onPress={() => setCart([])}>
                            <Text className="text-red-500 font-medium">Vider</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={cart}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <CartItem
                            item={item}
                            onIncrement={() => updateQuantity(item.id, 1)}
                            onDecrement={() => updateQuantity(item.id, -1)}
                            onRemove={() => removeItem(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 300 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20">
                            <View className="bg-gray-100 p-8 rounded-full mb-4">
                                <ShoppingCart size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-400 text-lg font-medium">Le panier est vide</Text>
                            <Text className="text-gray-400 text-sm mt-1">Scannez un produit pour l'ajouter</Text>
                        </View>
                    }
                />
            </View>

            {cart.length > 0 && (
                <View className="absolute bottom-0 left-0 right-0 bg-white shadow-2xl">
                    <View className="px-4 pt-4 pb-2">
                        <Text className="text-gray-900 font-bold text-sm mb-3 ml-1">Mode de paiement</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                            {PAYMENT_METHODS.map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    onPress={() => setPaymentMethod(method.id)}
                                    className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 border ${paymentMethod === method.id
                                        ? 'bg-green-700 border-green-700 shadow-md shadow-green-900/20'
                                        : 'bg-white border-gray-100 shadow-sm'
                                        }`}
                                >
                                    <method.icon size={18} color={paymentMethod === method.id ? 'white' : '#4B5563'} />
                                    <Text className={`ml-2 font-bold ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`}>
                                        {method.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <CartSummary
                        total={total}
                        tax={tax}
                        isProcessing={isProcessing}
                        onCheckout={handleCheckout}
                    />
                </View>
            )}

            <Modal visible={isScannerVisible} animationType="slide">
                <View className="flex-1 bg-black">
                    <SafeAreaView className="flex-1">
                        <View className="flex-row justify-between items-center p-6">
                            <Text className="text-white text-xl font-bold">Vente - Scan Produit</Text>
                            <TouchableOpacity onPress={() => setIsScannerVisible(false)} className="bg-white/20 p-2 rounded-full">
                                <X size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 justify-center items-center">
                            <View className="w-64 h-64 border-2 border-green-500 rounded-3xl overflow-hidden relative">
                                <CameraView
                                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                                    barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "code128"] }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                <View className="absolute top-0 left-0 right-0 bottom-0 border-[40px] border-black/50" />
                                <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500" />
                            </View>
                            <Text className="text-white mt-8 text-center px-10">Scannez le code-barres pour l'ajouter au panier.</Text>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
