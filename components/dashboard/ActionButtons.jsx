import { Link } from 'expo-router';
import { Plus, Scan, ShoppingCart } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

const ActionButton = ({ icon: Icon, label, color, href }) => (
    <Link href={href} asChild>
        <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 mx-1 items-center justify-center h-28">
            <View className={`p-3 rounded-full mb-2 ${color} bg-opacity-10`}>
                <Icon size={28} color={color === 'bg-green-100' ? '#2E7D32' : color === 'bg-blue-100' ? '#1976D2' : '#F57C00'} />
            </View>
            <Text className="font-semibold text-gray-700">{label}</Text>
        </TouchableOpacity>
    </Link>
);

export default function ActionButtons() {
    return (
        <View className="flex-row justify-between mt-2 mb-6">
            <Link href="/sales" asChild>
                <TouchableOpacity className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex-1 mr-2 items-center justify-center py-6">
                    <View className="bg-green-100 p-3 rounded-full mb-2">
                        <ShoppingCart size={24} color="#2E7D32" />
                    </View>
                    <Text className="font-bold text-gray-800">Vendre</Text>
                </TouchableOpacity>
            </Link>

            <Link href="/products" asChild>
                <TouchableOpacity className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex-1 mx-2 items-center justify-center py-6">
                    <View className="bg-blue-100 p-3 rounded-full mb-2">
                        <Scan size={24} color="#1976D2" />
                    </View>
                    <Text className="font-bold text-gray-800">Scanner</Text>
                </TouchableOpacity>
            </Link>

            <Link href="/products" asChild>
                <TouchableOpacity className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex-1 ml-2 items-center justify-center py-6">
                    <View className="bg-orange-100 p-3 rounded-full mb-2">
                        <Plus size={24} color="#F57C00" />
                    </View>
                    <Text className="font-bold text-gray-800">Ajouter</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
