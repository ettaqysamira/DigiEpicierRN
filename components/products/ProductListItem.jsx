import { Image, Text, View } from 'react-native';

const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const getStatusColor = (quantity, expirationDate) => {
    if (quantity < 5) return 'bg-orange-100 text-orange-700';
    const today = new Date();
    const exp = parseDate(expirationDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
};

const getStatusText = (quantity, expirationDate) => {
    if (quantity < 5) return 'Stock faible';
    const today = new Date();
    const exp = parseDate(expirationDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return 'Expire bientôt';
    return 'En stock';
};

export default function ProductListItem({ product }) {
    const statusClass = getStatusColor(product.quantity, product.expirationDate);
    const statusText = getStatusText(product.quantity, product.expirationDate);

    const bgClass = statusClass.split(' ')[0];
    const textClass = statusClass.split(' ')[1];

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center border border-gray-100">
            <Image
                source={{ uri: product.image || 'https://via.placeholder.com/100' }}
                className="w-16 h-16 rounded-lg bg-gray-100 mr-4"
            />

            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1">{product.name}</Text>
                <Text className="text-gray-500 text-xs mb-2">{product.category}</Text>

                <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center">
                        <Text className="text-green-700 font-bold text-lg mr-3">{product.price} DH</Text>
                        <View className="bg-gray-100 px-2 py-1 rounded-md">
                            <Text className="text-gray-600 text-xs font-semibold">Qté: {product.quantity}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="items-end justify-between h-full pl-2">
                <View className={`px-2 py-1 rounded-full mb-4 ${bgClass}`}>
                    <Text className={`text-[10px] font-bold ${textClass}`}>{statusText}</Text>
                </View>

                <Text className="text-gray-400 text-[10px]">Exp: {product.expirationDate}</Text>
            </View>
        </View>
    );
}
