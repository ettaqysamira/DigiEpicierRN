import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Bell, LogOut, Package, PlusCircle, Scan, ShoppingCart, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig';

import ActionButtons from '../../components/dashboard/ActionButtons';
import AlertCards from '../../components/dashboard/AlertCards';
import CategoryPieChart from '../../components/dashboard/CategoryPieChart';
import RecentSales from '../../components/dashboard/RecentSales';
import SalesChart from '../../components/dashboard/SalesChart';
import SummaryCard from '../../components/dashboard/SummaryCard';

export default function DashboardScreen() {
  const router = useRouter();
  const [dailyTurnover, setDailyTurnover] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [weeklySales, setWeeklySales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      setDailyTurnover(0);
      setTotalRevenue(0);
      setWeeklySales([]);
      setCategorySales([]);
      setTotalStock(0);
      return;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const q = query(collection(db, "sales"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      let todayTotal = 0;
      const daysMap = {};
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dateKey = d.toDateString();
        daysMap[dateKey] = {
          label: dayNames[d.getDay()],
          value: 0,
          rawDate: d
        };
      }

      const categoryTotals = {};
      let grandTotal = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== userId) return;

        const saleTimestamp = data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date(0));
        const saleAmount = Number(data.total || 0);

        if (saleTimestamp >= startOfToday) {
          todayTotal += saleAmount;
        }

        const saleDateReset = new Date(saleTimestamp);
        saleDateReset.setHours(0, 0, 0, 0);
        const dateKey = saleDateReset.toDateString();
        if (daysMap[dateKey]) {
          daysMap[dateKey].value += saleAmount;
        }

        grandTotal += saleAmount;
        if (data.items && Array.isArray(data.items)) {
          data.items.forEach(item => {
            const itemValue = Number(item.price || 0) * Number(item.quantity || 0);
            const rawCat = item.category || 'Autre';
            const itemCat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
            categoryTotals[itemCat] = (categoryTotals[itemCat] || 0) + itemValue;
          });
        }
      });

      const chartData = Object.values(daysMap)
        .sort((a, b) => a.rawDate - b.rawDate)
        .map((item, index) => ({
          label: item.label,
          value: item.value,
          color: index === 6 ? "#2E7D32" : (item.value > 0 ? "#81C784" : "#E8F5E9")
        }));

      const colors = ["#2E7D32", "#FFA726", "#66BB6A", "#9C27B0", "#FFB74D", "#9CA3AF"];
      const pieData = Object.keys(categoryTotals).map((name, index) => {
        const value = categoryTotals[name];
        const percentage = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
        return {
          name,
          population: Number(percentage.toFixed(1)),
          color: colors[index % colors.length],
          legendFontColor: "#4B5563",
          legendFontSize: 10
        };
      }).filter(item => item.population > 0).sort((a, b) => b.population - a.population);

      setDailyTurnover(todayTotal);
      setTotalRevenue(grandTotal);
      setWeeklySales(chartData);
      setCategorySales(pieData);
    }, (error) => {
      console.error("Dashboard sales snapshot error:", error);
    });

    const productQ = query(
      collection(db, "products"),
      where("userId", "==", currentUserId)
    );

    const unsubscribeProducts = onSnapshot(productQ, (snapshot) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      setTotalStock(snapshot.size); // Count of unique products
    });

    return () => {
      unsubscribe();
      unsubscribeProducts();
    };
  }, [auth.currentUser]);

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      setNotifCount(0);
      return;
    }

    const q = query(
      collection(db, "products"),
      where("userId", "==", currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const tenDaysFromNow = new Date();
      tenDaysFromNow.setDate(now.getDate() + 10);
      tenDaysFromNow.setHours(23, 59, 59, 999);

      let totalAlerts = 0;

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        let hasAlert = false;

        if (data.quantity <= 5) {
          hasAlert = true;
        }

        if (data.expirationDate) {
          const [day, month, year] = data.expirationDate.split('/');
          const expDate = new Date(year, month - 1, day);
          if (expDate <= tenDaysFromNow) {
            hasAlert = true;
          }
        }

        if (hasAlert) totalAlerts++;
      });

      setNotifCount(totalAlerts);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleLogout = async () => {
    console.log("🖱️ LOGOUT BUTTON PRESSED");

    const performLogout = async () => {
      try {
        console.log("⏳ Starting signOut...");
        await signOut(auth);
        console.log("✅ signOut successful");
        router.replace('/(auth)/login');
      } catch (error) {
        console.error("❌ Logout error:", error);
        Alert.alert("Erreur", "Impossible de se déconnecter");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
        await performLogout();
      }
    } else {
      Alert.alert(
        "Déconnexion",
        "Êtes-vous sûr de vouloir vous déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se déconnecter", style: "destructive", onPress: performLogout }
        ]
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-green-700">
      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="bg-green-700 px-5 pb-10 pt-4 mb-4 rounded-b-[40px] shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Image
                source={require('../../assets/images/logo.png')}
                className="w-40 h-10"
                resizeMode="contain"
              />
              <Text className="text-white/70 text-[10px] ml-1 mt-0.5 font-medium uppercase tracking-widest">Espace Gestion</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                className="relative mr-3 bg-white/10 p-2 rounded-full"
              >
                <Bell size={20} color="white" />
                {notifCount > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center border-2 border-green-700">
                    <Text className="text-white text-[10px] font-bold">{notifCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-white/10 p-2 rounded-full"
              >
                <LogOut size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/add')}
            className="bg-white p-4 rounded-2xl flex-row items-center shadow-lg active:bg-gray-50"
          >
            <View className="bg-green-100 p-3 rounded-xl mr-4">
              <Scan size={28} color="#15803d" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">Nouveau Produit</Text>
              <Text className="text-gray-500 text-sm">Scanner ou saisir manuellement</Text>
            </View>
            <View className="bg-green-600 p-2 rounded-full">
              <PlusCircle size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-4 -mt-8 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/sales')}
            className="bg-white p-5 rounded-3xl shadow-xl border-2 border-green-500 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="bg-green-700 p-3 rounded-2xl mr-4">
                <ShoppingCart size={30} color="white" />
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-xl">Scanner un produit</Text>
                <Text className="text-gray-500 text-sm">Vente rapide via code-barres</Text>
              </View>
            </View>
            <View className="bg-gray-100 p-2 rounded-full">
              <PlusCircle size={24} color="#15803d" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          <AlertCards />

          <Text className="text-lg font-bold text-gray-800 mb-3">Actions rapides</Text>
          <ActionButtons />

          <View className="mt-6">
            <View className="flex-row justify-between">
              <View className="w-[48%]">
                <SummaryCard
                  title="Ventes Totales"
                  value={`${totalRevenue.toLocaleString()} DH`}
                  color="green"
                  Icon={TrendingUp}
                />
              </View>
              <View className="w-[48%]">
                <SummaryCard
                  title="Total Produits"
                  value={`${totalStock.toLocaleString()}`}
                  color="orange"
                  Icon={Package}
                />
              </View>
            </View>
            <SummaryCard
              title="Ventes du jour"
              value={`${dailyTurnover.toLocaleString()} DH`}
              color="green"
              Icon={TrendingUp}
            />
          </View>

          <RecentSales />

          <View className="mt-2">
            <SalesChart data={weeklySales} />
            <CategoryPieChart data={categorySales} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
