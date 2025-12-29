import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Bell, LogOut, PlusCircle, Scan } from 'lucide-react-native';
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';

import ActionButtons from '../../components/dashboard/ActionButtons';
import AlertCards from '../../components/dashboard/AlertCards';
import CategoryPieChart from '../../components/dashboard/CategoryPieChart';
import RecentSales from '../../components/dashboard/RecentSales';
import SalesChart from '../../components/dashboard/SalesChart';
import SummaryCard from '../../components/dashboard/SummaryCard';

export default function DashboardScreen() {
  const router = useRouter();

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
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
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
                <View className="absolute top-1 right-2 bg-red-500 rounded-full w-2.5 h-2.5 border border-white" />
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
            onPress={() => router.push('/add')}
            className="bg-white p-5 rounded-3xl shadow-xl border-2 border-green-500 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="bg-green-700 p-3 rounded-2xl mr-4">
                <Scan size={30} color="white" />
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-xl">Scanner un produit</Text>
                <Text className="text-gray-500 text-sm">Ajout rapide via code-barres</Text>
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
            <SummaryCard title="Chiffre d'affaires du jour" value="52030 DH" trend="8.2%" color="green" />
          </View>

          <RecentSales />

          <View className="mt-2">
            <SalesChart />
            <CategoryPieChart />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
