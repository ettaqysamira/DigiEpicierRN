import { ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function SummaryCard({ title, value, trend, color = "green", Icon }) {
    const isGreen = color === 'green';
    return (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 w-full">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-500 font-medium">{title}</Text>{Icon && <Icon size={20} color={isGreen ? "#2E7D32" : "#F57C00"} />}
            </View>
            <Text className="text-3xl font-bold text-gray-900">{value}</Text>
            {trend && (
                <View className="flex-row items-center mt-2 bg-green-50 self-start px-2 py-1 rounded-md">
                    <ArrowUpRight size={14} color="#2E7D32" />
                    <Text className="text-green-700 font-bold ml-1 text-xs">{trend}</Text>
                    <Text className="text-gray-400 text-xs ml-1">vs hier</Text>
                </View>
            )}
        </View>
    );
}
