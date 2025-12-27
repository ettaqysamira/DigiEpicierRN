import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Lock, Mail, Store } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        if (email && password) {
            router.replace('/(tabs)');
        } else {
            alert('Veuillez remplir tous les champs');
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
                    {/* Logo / Branding Placeholder */}
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 bg-green-700 rounded-3xl items-center justify-center shadow-xl shadow-green-200">
                            <Store color="white" size={40} />
                        </View>
                        <Text className="text-3xl font-bold text-gray-800 mt-6 tracking-tight">
                           Hanooty
                        </Text>
                        <Text className="text-gray-500 mt-2 text-center text-base">
                            Simplifiez la gestion de votre épicerie
                        </Text>
                    </View>

                    <View className="space-y-6">
                        {/* Email Input */}
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

                        {/* Password Input */}
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

                        {/* Forgot Password */}
                        <TouchableOpacity className="mt-2 items-end">
                            <Text className="text-green-700 font-medium">Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            className="bg-green-700 h-16 rounded-2xl items-center justify-center mt-8 shadow-lg shadow-green-200 active:bg-green-800"
                            onPress={handleLogin}
                        >
                            <Text className="text-white text-lg font-bold">Se connecter</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Help Text */}
                    <View className="mt-12 items-center">
                        <Text className="text-gray-400 text-sm">
                            En vous connectant, vous acceptez nos
                        </Text>
                        <View className="flex-row">
                            <TouchableOpacity>
                                <Text className="text-green-700 text-sm font-medium">Conditions d'utilisation</Text>
                            </TouchableOpacity>
                            <Text className="text-gray-400 text-sm"> et </Text>
                            <TouchableOpacity>
                                <Text className="text-green-700 text-sm font-medium">Confidentialité</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
