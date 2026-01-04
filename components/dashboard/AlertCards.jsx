import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AlertTriangle, Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function AlertCards() {
    const [lowStockCount, setLowStockCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);
    const [soonCount, setSoonCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        const qLowStock = query(
            collection(db, "products"),
            where("userId", "==", auth.currentUser.uid),
            where("quantity", "<=", 5)
        );

        const unsubscribeLowStock = onSnapshot(qLowStock, (snapshot) => {
            setLowStockCount(snapshot.size);
            setLoading(false);
        });

        const qAll = query(
            collection(db, "products"),
            where("userId", "==", auth.currentUser.uid)
        );

        const unsubscribeDates = onSnapshot(qAll, (snapshot) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start of today

            const tenDaysFromNow = new Date();
            tenDaysFromNow.setDate(now.getDate() + 10);
            tenDaysFromNow.setHours(23, 59, 59, 999);

            let expired = 0;
            let soon = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.expirationDate) {
                    const [day, month, year] = data.expirationDate.split('/');
                    const expDate = new Date(year, month - 1, day);

                    if (expDate < now) {
                        expired++;
                    } else if (expDate <= tenDaysFromNow) {
                        soon++;
                    }
                }
            });
            setExpiredCount(expired);
            setSoonCount(soon);
        });

        return () => {
            unsubscribeLowStock();
            unsubscribeDates();
        };
    }, []);

    if (loading) return null;

    return (
        <View className="flex-row justify-between mb-6">
            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 mr-2 relative">
                {(expiredCount + soonCount) > 0 && (
                    <View className={`absolute top-3 right-3 ${expiredCount > 0 ? 'bg-red-500' : 'bg-orange-500'} w-6 h-6 rounded-full items-center justify-center border border-white`}>
                        <Text className="text-white text-xs font-bold">{expiredCount + soonCount}</Text>
                    </View>
                )}

                <View className={`${expiredCount > 0 ? 'bg-red-50' : 'bg-orange-50'} p-3 rounded-full self-start mb-3`}>
                    <AlertTriangle size={24} color={expiredCount > 0 ? "#D32F2F" : "#F57C00"} />
                </View>

                <Text className="text-gray-600 font-medium mb-1">Alertes Dates</Text>
                <View>
                    <Text className={`${expiredCount > 0 ? 'text-red-600' : 'text-orange-600'} font-bold text-lg`}>
                        {expiredCount} {expiredCount > 1 ? 'expirés' : 'expiré'}
                    </Text>
                    {soonCount > 0 && (
                        <Text className="text-orange-500 font-medium text-[11px] mt-0.5">
                            {soonCount} bientôt {soonCount > 1 ? 'expirés' : 'expiré'}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 ml-2 relative">
                {lowStockCount > 0 && (
                    <View className="absolute top-3 right-3 bg-orange-500 w-6 h-6 rounded-full items-center justify-center border border-white">
                        <Text className="text-white text-xs font-bold">{lowStockCount}</Text>
                    </View>
                )}

                <View className="bg-orange-50 p-3 rounded-full self-start mb-3">
                    <Package size={24} color="#F57C00" />
                </View>

                <Text className="text-gray-600 font-medium mb-1">Stock faible</Text>
                <Text className="text-orange-500 font-bold text-lg">{lowStockCount} {lowStockCount > 1 ? 'articles' : 'article'}</Text>
            </TouchableOpacity>
        </View>
    );
}
