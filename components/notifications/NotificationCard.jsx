import { AlertTriangle, CheckCircle2, Clock, Edit3, Package, TrendingDown } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function NotificationCard({ type, title, time, description, product, detail, isUnread }) {
    const isExpired = type === 'expired';
    const isLowStock = type === 'low_stock';

    const iconColor = isExpired ? '#EF4444' : '#F57C00';
    const bgColor = isExpired ? 'bg-red-50' : 'bg-orange-50';
    const borderColor = isExpired ? 'border-red-100' : 'border-orange-100';
    const tagColor = isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600';
    const tagLabel = isExpired ? 'Urgent' : 'Important';
    const dotColor = isExpired ? 'bg-red-500' : 'bg-orange-500';

    return (
        <View className={`${bgColor} border ${borderColor} rounded-[28px] p-5 mb-4 shadow-sm relative overflow-hidden`}>
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                    <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                        {isExpired ? <AlertTriangle size={24} color={iconColor} /> : <Package size={24} color={iconColor} />}
                    </View>
                    <View>
                        <Text className="text-gray-900 font-bold text-lg">{title}</Text>
                        <Text className="text-gray-400 text-xs">Il y a {time}</Text>
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
                    {isExpired ? <Clock size={16} color="#EF4444" /> : <TrendingDown size={16} color="#F57C00" />}
                    <Text className={`${isExpired ? 'text-red-500' : 'text-orange-600'} text-xs font-bold ml-2`}>{detail}</Text>
                </View>
            </View>

            <View className="flex-row justify-between space-x-3 gap-3">
                {isExpired ? (
                    <>
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-green-600 h-12 rounded-xl">
                            <CheckCircle2 size={18} color="#059669" />
                            <Text className="text-green-700 font-bold ml-2">Marquer vendu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-blue-600 h-12 rounded-xl">
                            <Edit3 size={18} color="#2563EB" />
                            <Text className="text-blue-700 font-bold ml-2">Modifier date</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-orange-500 h-12 rounded-xl shadow-lg shadow-orange-500/30">
                        <Plus size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Réapprovisionner</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const Plus = ({ size, color }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color, fontSize: 24, fontWeight: 'bold', lineHeight: 24 }}>+</Text>
    </View>
);
