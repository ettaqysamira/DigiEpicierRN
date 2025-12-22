import { Filter, Plus, Scan, Search } from 'lucide-react-native';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductsHeader() {
    return (
        <View className="bg-green-700 px-4 pt-2 pb-6 rounded-b-[24px]">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-bold">Gestion des Produits</Text>
                <View className="flex-row">
                    <TouchableOpacity className="bg-white/20 p-2 rounded-full mr-2">
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white/20 p-2 rounded-full">
                        <Filter size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row items-center space-x-2">
                <View className="flex-1 bg-white flex-row items-center rounded-xl px-4 h-12">
                    <Search size={20} color="gray" />
                    <TextInput
                        placeholder="Rechercher par nom..."
                        className="flex-1 ml-2 text-gray-800"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <TouchableOpacity className="bg-green-800 w-12 h-12 items-center justify-center rounded-xl border border-green-600">
                    <Scan size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
