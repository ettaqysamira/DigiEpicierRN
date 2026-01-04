import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, Filter, Menu, Plus, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductsHeader({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories = []
}) {
    const router = useRouter();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const categoriesList = ['Tous', ...categories];

    return (
        <View className="bg-green-700 px-4 pt-4 pb-4 rounded-b-[32px]">
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center flex-1">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>
                        Gestion Stock
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push('/add')}
                        className="bg-white/10 p-2 rounded-full"
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 ml-2 bg-white/10 rounded-full">
                        <Menu size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row items-center space-x-3">
                <View className="flex-1 bg-white flex-row items-center rounded-2xl px-4 h-14 shadow-sm">
                    <Search size={22} color="#9CA3AF" />
                    <TextInput
                        placeholder="Rechercher par nom..."
                        className="flex-1 ml-3 text-gray-800 text-base"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => setIsDropdownVisible(true)}
                    className="bg-green-800 px-4 h-14 items-center justify-center rounded-2xl shadow-sm border border-green-600/30 flex-row"
                >
                    <Filter size={20} color="white" />
                    <Text className="text-white font-bold ml-2 text-sm" numberOfLines={1}>
                        {selectedCategory === 'Tous' ? 'Catégories' : selectedCategory}
                    </Text>
                    <ChevronDown size={16} color="white" className="ml-2" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    activeOpacity={1}
                    onPress={() => setIsDropdownVisible(false)}
                >
                    <View className="bg-white w-full max-h-[60%] rounded-[32px] overflow-hidden shadow-2xl">
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                            <Text className="text-gray-900 text-xl font-black">Filtrer par catégorie</Text>
                            <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-2">
                            {categoriesList.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedCategory(cat);
                                        setIsDropdownVisible(false);
                                    }}
                                    className={`p-4 rounded-2xl mb-1 flex-row items-center justify-between ${selectedCategory === cat ? 'bg-green-50' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-base ${selectedCategory === cat ? 'text-green-800 font-bold' : 'text-gray-600 font-medium'}`}>
                                        {cat}
                                    </Text>
                                    {selectedCategory === cat && (
                                        <View className="w-2 h-2 rounded-full bg-green-700" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {selectedCategory !== 'Tous' && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedCategory('Tous');
                                    setIsDropdownVisible(false);
                                }}
                                className="p-4 bg-gray-50 items-center justify-center"
                            >
                                <Text className="text-red-500 font-bold">Réinitialiser le filtre</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
