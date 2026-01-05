import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, Filter, Menu, Plus, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductsHeader({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    categories = []
}) {
    const router = useRouter();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const categoriesList = ['Tous', ...categories];
    const statusList = ['Tous', 'Expiré', 'Expire bientôt', 'En stock'];

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

            <View className="flex-row items-center space-x-4">
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
                        Filtres
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
                    className="flex-1 bg-black/50 justify-center items-center px-4"
                    activeOpacity={1}
                    onPress={() => setIsDropdownVisible(false)}
                >
                    <View className="bg-white w-full max-h-[85%] rounded-[32px] overflow-hidden shadow-2xl">
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                            <Text className="text-gray-900 text-xl font-black">Filtres avancés</Text>
                            <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-4">
                            <Text className="text-gray-400 font-bold uppercase text-[12px] tracking-widest mb-3 ml-2">État du produit</Text>
                            <View className="flex-row flex-wrap mb-6">
                                {statusList.map((status, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedStatus(status)}
                                        className={`px-4 py-2 rounded-xl mr-2 mb-2 border ${selectedStatus === status ? 'bg-green-700 border-green-700' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        <Text className={`font-bold text-sm ${selectedStatus === status ? 'text-white' : 'text-gray-600'}`}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text className="text-gray-400 font-bold uppercase text-[12px] tracking-widest mb-3 ml-2">Catégorie</Text>
                            <View className="flex-row flex-wrap">
                                {categoriesList.map((cat, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-xl mr-2 mb-2 border ${selectedCategory === cat ? 'bg-green-700 border-green-700' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        <Text className={`font-bold text-sm ${selectedCategory === cat ? 'text-white' : 'text-gray-600'}`}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View className="p-4 bg-gray-50 border-t border-gray-100 flex-row space-x-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedCategory('Tous');
                                    setSelectedStatus('Tous');
                                    setIsDropdownVisible(false);
                                }}
                                className="flex-1 p-4 rounded-2xl items-center justify-center border border-red-100"
                            >
                                <Text className="text-red-500 font-bold">Réinitialiser</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsDropdownVisible(false)}
                                className="flex-1 p-4 bg-green-700 rounded-2xl items-center justify-center"
                            >
                                <Text className="text-white font-bold">Appliquer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
