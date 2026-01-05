import { useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { AlertTriangle, Clock, Package, Trash2, TrendingDown } from 'lucide-react-native';
import React from 'react';
import { Alert as RNAlert, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function NotificationCard({ type, id, productId, title, time, description, product, detail, isUnread }) {
    const router = useRouter();
    const isExpired = type === 'expired';
    const isExpiringSoon = type === 'expiring_soon';
    const isLowStock = type === 'low_stock';

    const isUrgent = isExpired;

    let iconColor, bgColor, borderColor, tagColor, dotColor;

    if (isExpired) {
        iconColor = '#EF4444';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-100';
        tagColor = 'bg-red-100 text-red-600';
        dotColor = 'bg-red-500';
    } else if (isExpiringSoon) {
        iconColor = '#ca8a04';
        bgColor = 'bg-yellow-50';
        borderColor = 'border-yellow-100';
        tagColor = 'bg-yellow-100 text-yellow-600';
        dotColor = 'bg-yellow-500';
    } else {
        iconColor = '#F57C00';
        bgColor = 'bg-orange-50';
        borderColor = 'border-orange-100';
        tagColor = 'bg-orange-100 text-orange-600';
        dotColor = 'bg-orange-500';
    }

    const tagLabel = isExpired ? 'Expiré' : (isExpiringSoon ? 'Bientôt' : 'Stock');

    const handleDelete = async () => {
        if (!productId) return;

        RNAlert.alert(
            "Supprimer le produit",
            "Voulez-vous vraiment supprimer ce produit expiré du stock ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "products", productId));
                            RNAlert.alert("Succès", "Produit supprimé du stock.");
                        } catch (error) {
                            console.error("Delete error:", error);
                            RNAlert.alert("Erreur", "Impossible de supprimer le produit.");
                        }
                    }
                }
            ]
        );
    };

    const handleGoToStock = () => {
        router.push('/(tabs)/products');
    };

    return (
        <View className={`${bgColor} border ${borderColor} rounded-[28px] p-5 mb-4 shadow-sm relative overflow-hidden`}>
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                    <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                        {isExpired ? (
                            <AlertTriangle size={24} color={iconColor} />
                        ) : isExpiringSoon ? (
                            <Clock size={24} color={iconColor} />
                        ) : (
                            <Package size={24} color={iconColor} />
                        )}
                    </View>
                    <View>
                        <Text className="text-gray-900 font-bold text-lg">{title}</Text>
                        <Text className="text-gray-400 text-xs">{time}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <View className={`${tagColor} px-3 py-1 rounded-full mr-2`}>
                        <Text className="text-[10px] font-bold uppercase">{tagLabel}</Text>
                    </View>
                    {isUnread && <View className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />}
                </View>
            </View>

            <Text className="text-gray-700 text-sm leading-5 mb-4 px-1">
                {description}
            </Text>

            <View className="bg-white/60 p-4 rounded-2xl space-y-2 mb-4">
                <View className="flex-row items-center">
                    <Package size={16} color="#4B5563" />
                    <Text className="text-gray-400 text-xs ml-2">Produit: <Text className="text-gray-600 font-medium">{product}</Text></Text>
                </View>
                <View className="flex-row items-center">
                    {isExpired ? <Clock size={16} color="#EF4444" /> : isExpiringSoon ? <Clock size={16} color="#ca8a04" /> : <TrendingDown size={16} color="#F57C00" />}
                    <Text className={`${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-600' : 'text-orange-600'} text-xs font-bold ml-2`}>{detail}</Text>
                </View>
            </View>

            <View className="flex-row justify-between space-x-3 gap-3">
                {isExpired ? (
                    <>
                        <TouchableOpacity
                            onPress={handleGoToStock}
                            className="flex-1 flex-row items-center justify-center bg-white border border-green-600 h-12 rounded-xl"
                        >
                            <Package size={18} color="#059669" />
                            <Text className="text-green-700 font-bold ml-2">Voir Stock</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="flex-1 flex-row items-center justify-center bg-white border border-red-600 h-12 rounded-xl"
                        >
                            <Trash2 size={18} color="#EF4444" />
                            <Text className="text-red-700 font-bold ml-2">Supprimer</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={handleGoToStock}
                        className={`flex-1 flex-row items-center justify-center ${isExpiringSoon ? 'bg-yellow-500 shadow-yellow-500/30' : 'bg-orange-500 shadow-orange-500/30'} h-12 rounded-xl shadow-lg`}
                    >
                        <Package size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Gérer Stock</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
