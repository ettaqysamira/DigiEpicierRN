import { AlertTriangle, HelpCircle } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const getStatusStyles = (quantity, expirationDate) => {
    const today = new Date();
    const exp = parseDate(expirationDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return {
            bg: 'bg-red-50',
            text: 'text-red-600',
            label: 'Expiré'
        };
    }

    if (diffDays < 7) {
        return {
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            label: 'Expire bientôt'
        };
    }

    return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'En stock'
    };
};

export default function ProductListItem({ product, onPress }) {
    const { bg, text, label } = getStatusStyles(product.quantity, product.expirationDate);

    return (
        <TouchableOpacity
            onPress={() => onPress && onPress(product)}
            activeOpacity={0.7}
            className="bg-white p-3 rounded-2xl mb-3 flex-row items-center border border-gray-100 shadow-sm"
        >
            <Image
                source={{ uri: product.image || 'https://via.placeholder.com/100' }}
                className="w-20 h-20 rounded-xl bg-gray-100 mr-4"
                resizeMode="cover"
            />

            <View className="flex-1 justify-center">
                <Text className="text-gray-900 font-bold text-lg leading-tight mb-0.5" numberOfLines={1}>
                    {product.name}
                </Text>
                <Text className="text-gray-400 text-sm mb-2">{product.category}</Text>

                <View className="flex-row items-center">
                    <Text className="text-green-700 font-bold text-xl mr-3">
                        {parseFloat(product.price).toFixed(2)} DH
                    </Text>
                    <View className="bg-green-50 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-bold">
                            Qté: {product.quantity}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="items-end justify-between self-stretch py-1">
                <View className={`flex-row items-center px-2 py-1 rounded-full ${bg}`}>
                    {label === 'En stock' ? (
                        <HelpCircle size={14} color="#15803d" />
                    ) : (
                        <AlertTriangle size={14} color={label === 'Expiré' ? '#dc2626' : '#ea580c'} />
                    )}
                    <Text className={`ml-1 text-[11px] font-bold ${text}`}>{label}</Text>
                </View>

                <Text className="text-gray-400 text-[11px] font-medium">
                    Exp: {product.expirationDate}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
