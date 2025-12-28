import { useRouter } from 'expo-router';
import { Camera, ChevronDown, List, Save, Scan, X } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <View className="px-4 pt-2 pb-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Ajouter un produit</Text>
                    <TouchableOpacity>
                        <Text className="text-white font-bold text-base">Enregistrer</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                <Text className="text-gray-900 font-bold text-base mb-2">Photo du produit</Text>
                <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl h-48 items-center justify-center mb-6 shadow-sm border-dashed">
                    <View className="bg-green-50 p-4 rounded-full mb-3">
                        <Camera size={32} color="#2E7D32" />
                    </View>
                    <Text className="text-green-700 font-bold text-lg">Ajouter une photo</Text>
                    <Text className="text-gray-400 text-sm mt-1">Touchez pour sélectionner une image</Text>
                </TouchableOpacity>

                <Text className="text-gray-900 font-bold text-base mb-2">Nom du produit *</Text>
                <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <View className="bg-gray-400 w-5 h-5 rounded-sm mr-3 items-center justify-center">
                            <Text className="text-white text-[10px]"></Text>
                            <List size={14} color="white" />
                        </View>
                        <TextInput
                            placeholder="Ex: Pommes Golden"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Catégorie *</Text>
                <TouchableOpacity className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center justify-between mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <View className="bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
                            <List size={18} color="#2E7D32" />
                        </View>
                        <Text className="text-gray-500 text-base">Sélectionner une catégorie</Text>
                    </View>
                    <ChevronDown size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View className="flex-row justify-between mb-5">
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Prix d'achat *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">DH</Text>
                            <TextInput
                                placeholder="0,00"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Prix de vente *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">DH</Text>
                            <TextInput
                                placeholder="0,00"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between mb-5">
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Quantité *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">#</Text>
                            <TextInput
                                placeholder="0"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Date d'expiration *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center justify-between shadow-sm">
                            <Text className="text-gray-800">19/01/2026</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Code-barres</Text>
                <View className="flex-row space-x-2 mb-5">
                    <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center shadow-sm">
                        <TextInput
                            placeholder="Saisir ou scanner le code-barres"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <TouchableOpacity className="bg-green-700 w-14 h-14 items-center justify-center rounded-xl">
                        <Scan size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Description (optionnel)</Text>
                <View className="bg-green-50 border border-green-700 rounded-xl p-4 h-32 mb-6 shadow-sm border-dashed">
                    <TextInput
                        placeholder="Informations supplémentaires sur le produit..."
                        multiline
                        numberOfLines={4}
                        className="text-base text-gray-800"
                        style={{ textAlignVertical: 'top' }}
                        placeholderTextColor="#6B7280"
                    />
                </View>

            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <TouchableOpacity className="bg-gray-200 py-4 rounded-xl items-center flex-row justify-center">
                    <Save size={20} color="#6B7280" className="mr-2" />
                    <Text className="text-gray-500 font-bold text-lg ml-2">Enregistrer le produit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
