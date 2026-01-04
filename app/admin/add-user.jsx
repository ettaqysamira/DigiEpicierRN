import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function AdminAddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAddUser = async () => {
        if (!name || !email || !password) {
            Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name,
                email: email.toLowerCase(),
                role: 'epicier',
                createdAt: new Date().toISOString()
            });

            Alert.alert(
                "Utilisateur créé",
                `Le compte pour ${name} a été créé avec succès.`,
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error("Admin user creation error:", error);
            Alert.alert("Erreur", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="px-6 pt-6 pb-10">
                        <View className="flex-row items-center mb-10">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="bg-gray-100 p-2 rounded-full mr-4"
                            >
                                <ArrowLeft size={24} color="#374151" />
                            </TouchableOpacity>
                            <Text className="text-2xl font-bold text-gray-800">Ajouter un épicier</Text>
                        </View>

                        <View className="space-y-6">
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Nom Complet / Magasin</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <User size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="Nom de l'épicier"
                                        placeholderTextColor="#9ca3af"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View className="mt-4">
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Email (Login)</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <Mail size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="email@example.com"
                                        placeholderTextColor="#9ca3af"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="mt-4">
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Mot de passe provisoire</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <Lock size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="••••••••"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeOff size={22} color="#9ca3af" />
                                        ) : (
                                            <Eye size={22} color="#9ca3af" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                className={`bg-green-700 h-16 rounded-2xl items-center justify-center mt-12 shadow-lg shadow-green-200 ${isLoading ? 'opacity-70' : 'active:bg-green-800'}`}
                                onPress={handleAddUser}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-lg font-bold">
                                    {isLoading ? 'Création en cours...' : "CRÉER LE COMPTE"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-orange-50 p-6 rounded-3xl border border-orange-100 mt-10">
                            <Text className="text-orange-800 font-bold mb-2">Note Importante :</Text>
                            <Text className="text-orange-700 text-sm leading-5">
                                La création d'un utilisateur vous déconnectera temporairement de votre session admin pour des raisons de sécurité Firebase. Vous devrez peut-être vous reconnecter après l'opération.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
