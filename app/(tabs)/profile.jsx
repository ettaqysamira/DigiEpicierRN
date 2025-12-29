import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Bell, ChevronRight, HelpCircle, LogOut, Settings, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';

export default function ProfileScreen() {
    const router = useRouter();
    const user = auth.currentUser;

    const handleLogout = async () => {
        console.log("PROFILE LOGOUT BUTTON PRESSED");

        const performLogout = async () => {
            try {
                console.log("Starting Profile signOut...");
                await signOut(auth);
                console.log("Profile signOut successful");
                router.replace('/(auth)/login');
            } catch (error) {
                console.error("Profile Logout error:", error);
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

    const ProfileItem = ({ icon: Icon, title, subtitle, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100"
        >
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-50 mr-4">
                <Icon size={20} color="#374151" />
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 font-semibold">{title}</Text>
                {subtitle && <Text className="text-gray-500 text-xs">{subtitle}</Text>}
            </View>
            <ChevronRight size={18} color="#9ca3af" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-5 pt-4">
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-green-700 rounded-full items-center justify-center shadow-lg shadow-green-200 mb-4">
                        <User size={50} color="white" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800">{user?.email?.split('@')[0] || 'Épicier'}</Text>
                    <Text className="text-gray-500">{user?.email}</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-2">Compte & Sécurité</Text>
                    <ProfileItem icon={Settings} title="Paramètres du magasin" subtitle="Informations sur votre boutique" />
                    <ProfileItem icon={Shield} title="Sécurité" subtitle="Changer le mot de passe" />
                    <ProfileItem icon={Bell} title="Notifications" subtitle="Gérer vos alertes" />
                </View>

                <View className="mb-8">
                    <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-2">Assistance</Text>
                    <ProfileItem icon={HelpCircle} title="Aide & Support" subtitle="Centre d'aide Hanooty" />
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center justify-center bg-red-50 p-4 rounded-2xl border border-red-100 mb-10"
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-red-500 font-bold text-lg ml-2">Se déconnecter</Text>
                </TouchableOpacity>

                <View className="items-center mb-10">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        className="w-24 h-6 opacity-30"
                        resizeMode="contain"
                    />
                    <Text className="text-gray-300 text-[10px] mt-2">Propulsé par Hanooty Digital</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
