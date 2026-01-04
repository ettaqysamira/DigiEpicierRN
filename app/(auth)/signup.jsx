import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
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

const { width } = Dimensions.get('window');

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'les mots de passe ne correspondent pas.');
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

            const adminEmails = ['ettaqy.samira@gmail.com', 'admin@hanooty.com', 'samira.ettaqy@gmail.com'];
            const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'epicier';
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name,
                email: email.toLowerCase(),
                role: role,
                createdAt: new Date().toISOString()
            });

            Alert.alert(
                "Compte créé !",
                "Votre espace épicier est prêt.",
                [{ text: "Commencer", onPress: () => router.replace('/(tabs)') }]
            );
        } catch (error) {
            console.error("Signup error:", error);
            let errorMessage = "Une erreur est survenue lors de l'inscription.";

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Cet email est déjà utilisé.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Format d'email invalide.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Le mot de passe est trop faible.";
            }

            Alert.alert("Erreur d'inscription", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="px-8 pt-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-gray-50 w-10 h-10 rounded-full items-center justify-center mb-6 border border-gray-100"
                        >
                            <ArrowLeft size={20} color="#374151" />
                        </TouchableOpacity>

                        <View className="items-center mb-10">
                            <View className="bg-green-700 w-full py-8 rounded-3xl items-center shadow-xl shadow-green-100">
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    className="w-64 h-16"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-gray-800 mt-6 text-2xl font-bold">
                                Créer un compte
                            </Text>
                            <Text className="text-gray-500 mt-2 text-center text-base">
                                Rejoignez le réseau des épiciers connectés
                            </Text>
                        </View>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Nom du magasin / Nom complet</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <User size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="Ex: Épicerie Samira"
                                        placeholderTextColor="#9ca3af"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View className="mt-4">
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Email</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <Mail size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="votre@email.com"
                                        placeholderTextColor="#9ca3af"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="mt-4">
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Mot de passe</Text>
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

                            <View className="mt-4">
                                <Text className="text-gray-700 font-semibold mb-2 ml-1">Confirmer le mot de passe</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 h-16 shadow-sm">
                                    <Lock size={22} color="#9ca3af" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-gray-800 text-lg"
                                        placeholder="••••••••"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                className={`bg-green-700 h-16 rounded-2xl items-center justify-center mt-10 shadow-lg shadow-green-200 ${isLoading ? 'opacity-70' : 'active:bg-green-800'}`}
                                onPress={handleSignup}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-lg font-bold">
                                    {isLoading ? 'Création...' : "S'INSCRIRE"}
                                </Text>
                            </TouchableOpacity>

                            <View className="flex-row justify-center mt-8">
                                <Text className="text-gray-500">Déjà un compte ? </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text className="text-green-700 font-bold">Se connecter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mt-12 items-center">
                            <Text className="text-gray-400 text-sm">
                                Propulsé par Hanooty Digital
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
