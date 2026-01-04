import { ChevronDown, ChevronUp, Info, Pencil, Scale, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsModal({ visible, product, onClose, onDelete, onEdit }) {
    const [isTableExpanded, setIsTableExpanded] = useState(true);

    if (!product) return null;

    const nutriscoreData = {
        'a': {
            logo: 'https://static.openfoodfacts.org/images/attributes/nutriscore-a.png',
            label: 'Nutri-Score A',
            desc: 'Très bonne qualité nutritionnelle',
            color: 'bg-green-50',
            borderColor: 'border-green-100',
            textColor: 'text-green-800'
        },
        'b': {
            logo: 'https://static.openfoodfacts.org/images/attributes/nutriscore-b.png',
            label: 'Nutri-Score B',
            desc: 'Bonne qualité nutritionnelle',
            color: 'bg-green-50/50',
            borderColor: 'border-green-100',
            textColor: 'text-green-700'
        },
        'c': {
            logo: 'https://static.openfoodfacts.org/images/attributes/nutriscore-c.png',
            label: 'Nutri-Score C',
            desc: 'Qualité nutritionnelle moyenne',
            color: 'bg-yellow-50',
            borderColor: 'border-yellow-100',
            textColor: 'text-yellow-800'
        },
        'd': {
            logo: 'https://static.openfoodfacts.org/images/attributes/nutriscore-d.png',
            label: 'Nutri-Score D',
            desc: 'Qualité nutritionnelle médiocre',
            color: 'bg-orange-50',
            borderColor: 'border-orange-100',
            textColor: 'text-orange-800'
        },
        'e': {
            logo: 'https://static.openfoodfacts.org/images/attributes/nutriscore-e.png',
            label: 'Nutri-Score E',
            desc: 'Mauvaise qualité nutritionnelle',
            color: 'bg-red-50',
            borderColor: 'border-red-100',
            textColor: 'text-red-800'
        },
    };

    const currentNutri = nutriscoreData[product.nutriscore?.toLowerCase()] || null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View className="flex-1 bg-white">
                <SafeAreaView className="bg-white border-b border-gray-100">
                    <View className="flex-row justify-between items-center px-4 py-3">
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={onClose} className="mr-4">
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                            <Text className="text-gray-900 text-xl font-bold">Détails du produit</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => onEdit(product)}
                            className="bg-green-50 p-2 rounded-full"
                        >
                            <Pencil size={20} color="#2E7D32" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="bg-gray-50 h-72 items-center justify-center p-4">
                        <Image
                            source={{ uri: product.image || 'https://via.placeholder.com/300' }}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>

                    <View className="p-6">
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1">
                                <Text className="text-2xl font-black text-gray-900 leading-tight">{product.name}</Text>
                                <View className="flex-row items-center mt-2">
                                    <View className="bg-gray-100 px-2 py-1 rounded-md mr-3">
                                        <Text className="text-gray-500 font-bold text-[10px] uppercase tracking-tighter">Marque</Text>
                                    </View>
                                    <Text className="text-gray-500 font-bold tracking-wider text-sm">{product.brand || 'Marque inconnue'}</Text>
                                </View>
                            </View>
                            <View className="bg-green-700 px-4 py-2 rounded-xl shadow-sm">
                                <Text className="text-white font-bold text-lg">{product.price} DH</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center mb-6 pt-6 border-t border-gray-100">
                            <Info size={20} color="#374151" />
                            <Text className="text-lg font-bold text-gray-800 ml-2">Nutrition et Ingrédients</Text>
                        </View>

                        <Text className="text-gray-900 font-bold mb-4">Nutri-Score</Text>

                        {currentNutri ? (
                            <View className={`${currentNutri.color} p-4 rounded-2xl flex-row items-center mb-8 border ${currentNutri.borderColor}`}>
                                <Image
                                    source={{ uri: currentNutri.logo }}
                                    className="w-20 h-12 mr-4"
                                    resizeMode="contain"
                                />
                                <View className="flex-1">
                                    <Text className={`font-black text-lg ${currentNutri.textColor}`}>{currentNutri.label}</Text>
                                    <Text className="text-gray-600 text-xs font-medium mt-0.5">{currentNutri.desc}</Text>
                                </View>
                            </View>
                        ) : (
                            <View className="bg-gray-50 p-4 rounded-2xl flex-row items-center mb-8 border border-gray-100 border-dashed">
                                <View className="w-12 h-12 bg-gray-200 rounded-xl items-center justify-center mr-4">
                                    <Text className="text-gray-400 font-bold">?</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-gray-400">Nutri-Score non disponible</Text>
                                    <Text className="text-gray-400 text-xs">Données insuffisantes</Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => setIsTableExpanded(!isTableExpanded)}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 overflow-hidden"
                        >
                            <View className="flex-row justify-between items-center p-4 border-b border-gray-50">
                                <View className="flex-row items-center">
                                    <Scale size={20} color="#D97706" />
                                    <Text className="font-bold text-gray-800 ml-3">Tableau nutritionnel</Text>
                                </View>
                                {isTableExpanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
                            </View>

                            {isTableExpanded && product.nutriments && (
                                <View className="p-4 bg-white">
                                    <View className="bg-gray-50 flex-row p-3 rounded-t-xl">
                                        <Text className="flex-1 font-bold text-gray-500 text-xs uppercase">Tableau nutritionnel</Text>
                                        <Text className="font-bold text-gray-500 text-xs uppercase">Pour 100g</Text>
                                    </View>

                                    {[
                                        { label: 'Énergie', val: `${product.nutriments.energy_100g || 0} kj (${Math.round((product.nutriments.energy_100g || 0) / 4.184)} kcal)` },
                                        { label: 'Matières grasses', val: `${product.nutriments.fat_100g || 0} g` },
                                        { label: 'Acides gras saturés', val: `${product.nutriments['saturated-fat_100g'] || 0} g` },
                                        { label: 'Glucides', val: `${product.nutriments.carbohydrates_100g || 0} g` },
                                        { label: 'Sucres', val: `${product.nutriments.sugars_100g || 0} g` },
                                        { label: 'Protéines', val: `${product.nutriments.proteins_100g || 0} g` },
                                        { label: 'Sel', val: `${product.nutriments.salt_100g || 0} g` },
                                    ].map((item, index) => (
                                        <View key={index} className="flex-row justify-between p-4 border-b border-gray-50">
                                            <Text className="text-gray-700 font-medium">{item.label}</Text>
                                            <Text className="font-bold text-gray-900">{item.val}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text className="text-gray-900 font-bold mb-4">Ingrédients</Text>
                        <View className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
                            <Text className="text-gray-600 leading-relaxed text-sm italic">
                                {product.ingredients || "Liste d'ingrédients non disponible."}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => onDelete(product.id)}
                            className="bg-red-50 flex-row items-center justify-center p-4 rounded-2xl border border-red-100 mb-8"
                        >
                            <Trash2 size={20} color="#EF4444" />
                            <Text className="text-red-600 font-bold ml-2">Supprimer ce produit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
