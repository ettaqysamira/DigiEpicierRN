import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Bell, LogOut } from 'lucide-react-native';
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
        <View className="flex-row justify-between items-center bg-green-700 px-5 pb-6 pt-4 mb-4 rounded-b-[24px]">
          <View>
            <Image
              source={require('../../assets/images/logo.png')}
              className="w-40 h-10"
              resizeMode="contain"
            />
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="relative mr-4 bg-white/20 p-2 rounded-full"
            >
              <Bell size={20} color="white" />
              <View className="absolute top-1 right-2 bg-red-500 rounded-full w-3 h-3 justify-center items-center border border-white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white/20 p-2 rounded-full"
            >
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>
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
