import { useRouter } from 'expo-router';
import { ArrowLeft, Barcode, Menu, Plus, Search, SlidersHorizontal } from 'lucide-react-native';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductsHeader() {
    const router = useRouter();

    return (
        <View className="bg-green-700 px-4 pt-4 pb-6 rounded-b-[32px]">
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center flex-1">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>
                        Gestion des Prod...
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity className="p-2">
                        <Plus size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 ml-2">
                        <Menu size={28} color="white" />
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
                    />
                </View>

                <TouchableOpacity
                    className="bg-green-800 w-14 h-14 items-center justify-center rounded-2xl shadow-sm border border-green-600/30"
                >
                    <Barcode size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white w-14 h-14 items-center justify-center rounded-2xl shadow-sm border border-gray-100"
                >
                    <SlidersHorizontal size={26} color="#374151" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
