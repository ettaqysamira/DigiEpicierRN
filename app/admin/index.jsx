import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { ArrowLeft, LogOut, Plus, Search, Trash2, User, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "epicier")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteUser = (userId, userName) => {
        Alert.alert(
            "Supprimer l'accès",
            `Voulez-vous vraiment supprimer l'accès pour ${userName} ? L'utilisateur ne sera plus visible dans l'administration.`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "users", userId));
                        } catch (error) {
                            console.error("Error deleting user doc:", error);
                            Alert.alert("Erreur", "Impossible de supprimer l'utilisateur.");
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error("Admin Logout error:", error);
            Alert.alert("Erreur", "Impossible de se déconnecter.");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUserItem = ({ item }) => (
        <View className="bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100 flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center mr-4">
                <User size={24} color="#15803d" />
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 font-bold text-lg">{item.name || 'Épicier sans nom'}</Text>
                <Text className="text-gray-500 text-sm">{item.email}</Text>
                <Text className="text-gray-400 text-xs mt-1">Inscrit le : {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Inconnu'}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteUser(item.id, item.name)}
                className="p-2 bg-red-50 rounded-xl"
            >
                <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-green-700 px-5 pt-4 pb-8 rounded-b-[32px] shadow-lg">
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/10 p-2 rounded-full mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Gestion des Épiciers</Text>
                            <Text className="text-green-100 text-sm">{users.length} utilisateurs enregistrés</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} className="bg-red-500/20 p-2 rounded-xl flex-row items-center px-4">
                        <LogOut size={18} color="white" />
                        <Text className="text-white font-bold ml-2 text-xs">QUITTER</Text>
                    </TouchableOpacity>
                </View>
                <View className="bg-white/10 flex-row items-center rounded-2xl px-4 h-14 border border-white/20">
                    <Search size={20} color="white" opacity={0.6} />
                    <TextInput
                        className="flex-1 ml-3 text-white text-base"
                        placeholder="Rechercher un épicier..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View className="flex-1 px-5 pt-6">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#15803d" />
                        <Text className="text-gray-500 mt-4">Chargement des utilisateurs...</Text>
                    </View>
                ) : filteredUsers.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <View className="bg-gray-100 p-8 rounded-full mb-4">
                            <Users size={48} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-400 text-lg font-bold">Aucun épicier trouvé</Text>
                        <Text className="text-gray-400 text-sm mt-1 text-center px-10">
                            Les épiciers inscrits sur la plateforme apparaîtront ici.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>

            <TouchableOpacity
                onPress={() => router.push('/admin/add-user')}
                className="absolute bottom-10 right-8 bg-green-700 w-16 h-16 rounded-3xl items-center justify-center shadow-xl shadow-green-900/20"
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
