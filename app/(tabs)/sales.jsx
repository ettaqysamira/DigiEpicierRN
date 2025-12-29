import { Banknote, Barcode, CreditCard, Landmark, Search, ShoppingCart, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CartItem from '../../components/sales/CartItem';
import CartSummary from '../../components/sales/CartSummary';

const INITIAL_CART = [];

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Espèces', icon: Banknote },
    { id: 'card', label: 'Carte', icon: CreditCard },
    { id: 'wallet', label: 'Mobile', icon: Smartphone },
    { id: 'bank', label: 'Virement', icon: Landmark },
];

export default function SalesScreen() {
    const [cart, setCart] = useState(INITIAL_CART);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
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
                                placeholder="Chercher un produit..."
                                className="flex-1 ml-3 text-white text-base"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>
                        <TouchableOpacity className="bg-white ml-3 w-14 h-14 items-center justify-center rounded-2xl shadow-sm">
                            <Barcode size={24} color="#2E7D32" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <View className="flex-1 px-4 pt-6">
                <View className="flex-row justify-between items-center mb-4 px-1">
                    <Text className="text-gray-900 font-bold text-lg">Panier ({cart.length})</Text>
                    <TouchableOpacity onPress={() => setCart([])}>
                        <Text className="text-red-500 font-medium">Vider</Text>
                    </TouchableOpacity>
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
                            <Text className="text-gray-400 text-sm mt-1">Commencez par scanner un produit</Text>
                        </View>
                    }
                />
            </View>

            {cart.length > 0 && (
                <>
                    <View className="absolute bottom-[200px] left-0 right-0 px-4">
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

                    <CartSummary total={total} tax={tax} onCheckout={() => alert('Vente validée par ' + paymentMethod)} />
                </>
            )}
        </View>
    );
}
