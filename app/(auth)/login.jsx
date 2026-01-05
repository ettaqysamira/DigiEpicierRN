import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('samira.ettaqy@gmail.com');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (email && password) {
            setIsLoading(true);
            const adminEmails = ['ettaqy.samira@gmail.com', 'admin@hanooty.com', 'samira.ettaqy@gmail.com'];
            const isAdminEmail = adminEmails.includes(email.toLowerCase());

            try {
                let userCredential;
                try {
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                } catch (error) {
                    if (isAdminEmail && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
                        try {
                            console.log("Attempting to auto-provision admin account...");
                            userCredential = await createUserWithEmailAndPassword(auth, email, password);
                            await updateProfile(userCredential.user, { displayName: "Administrateur" });
                        } catch (signupError) {
                            if (signupError.code === 'auth/email-already-in-use') {
                                throw error;
                            }
                            throw signupError;
                        }
                    } else {
                        throw error;
                    }
                }

                if (isAdminEmail) {
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        name: "Administrateur",
                        email: email.toLowerCase(),
                        role: 'admin',
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                    router.replace('/admin');
                } else {
                    router.replace('/(tabs)');
                }
            } catch (error) {
                console.error("Login error:", error);
                let errorMessage = "Une erreur est survenue lors de la connexion.";

                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    errorMessage = "Email ou mot de passe incorrect.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Format d'email invalide.";
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = "Problème de connexion réseau. Veuillez vérifier votre accès internet.";
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = "Trop de tentatives échouées. Veuillez réessayer plus tard.";
                } else if (error.code === 'auth/configuration-not-found') {
                    errorMessage = "Le service d'authentification n'est pas configuré. Veuillez contacter le support.";
                }

                Alert.alert("Erreur de connexion", errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 px-8 justify-center">
                    <View className="items-center mb-10">
                        <View className="bg-green-700 w-full py-8 rounded-3xl items-center shadow-xl shadow-green-100">
                            <Image
                                source={require('../../assets/images/logo.png')}
                                className="w-64 h-16"
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-gray-500 mt-6 text-center text-base font-medium">
                            Portail de Gestion Épicier
                        </Text>
                    </View>

                    <View className="space-y-6">
                        <View>
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

                        *                        <View className="mt-4">
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

                        <TouchableOpacity className="mt-3 items-end">
                            <Text className="text-green-700 font-medium">Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`bg-green-700 h-16 rounded-2xl items-center justify-center mt-10 shadow-lg shadow-green-200 ${isLoading ? 'opacity-70' : 'active:bg-green-800'}`}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text className="text-white text-lg font-bold">
                                {isLoading ? 'Connexion...' : 'SE CONNECTER'}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View className="mt-12 items-center">
                        <Text className="text-gray-400 text-sm">
                            Propulsé par Hanooty Digital
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
