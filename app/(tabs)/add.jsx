import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Camera as CameraIcon, ChevronDown, List, Save, Scan, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [barcode, setBarcode] = useState('');
    const [description, setDescription] = useState('');
    const [productImage, setProductImage] = useState(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);

    const fetchProductFromOFF = async (code) => {
        setIsFetchingInfo(true);
        try {
            console.log("Fetching from Open Food Facts:", code);
            const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                setName(product.product_name || '');
                setCategory(product.categories_tags ? product.categories_tags[0].replace('en:', '').replace('fr:', '') : '');
                setProductImage(product.image_url || null);
                setDescription(product.generic_name_fr || product.generic_name || '');
                Alert.alert("Produit trouvé !", `${product.product_name} a été détecté.`);
            } else {
                Alert.alert("Non trouvé", "Ce produit n'existe pas dans la base Open Food Facts.");
            }
        } catch (error) {
            console.error("OFF API Error:", error);
            Alert.alert("Erreur", "Impossible de contacter l'API Open Food Facts.");
        } finally {
            setIsFetchingInfo(false);
        }
    };

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setBarcode(data);
        setIsScannerVisible(false);
        fetchProductFromOFF(data);
    };

    const openScanner = async () => {
        if (!permission || !permission.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert("Erreur", "Veuillez autoriser l'accès à la caméra.");
                return;
            }
        }
        setScanned(false);
        setIsScannerVisible(true);
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <View className="px-4 pt-2 pb-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Ajouter un produit</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Succès", "Produit enregistré !")}>
                        <Text className="text-white font-bold text-base">Enregistrer</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                <Text className="text-gray-900 font-bold text-base mb-2">Photo du produit</Text>
                <TouchableOpacity className="bg-white border border-gray-200 rounded-2xl h-48 items-center justify-center mb-6 shadow-sm border-dashed overflow-hidden">
                    {productImage ? (
                        <Image source={{ uri: productImage }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <>
                            <View className="bg-green-50 p-4 rounded-full mb-3">
                                <CameraIcon size={32} color="#2E7D32" />
                            </View>
                            <Text className="text-green-700 font-bold text-lg">Ajouter une photo</Text>
                            <Text className="text-gray-400 text-sm mt-1">Touchez pour sélectionner</Text>
                        </>
                    )}
                </TouchableOpacity>

                {isFetchingInfo && (
                    <View className="bg-blue-50 p-4 rounded-xl flex-row items-center justify-center mb-6 border border-blue-100">
                        <ActivityIndicator color="#2563eb" className="mr-3" />
                        <Text className="text-blue-700 font-medium">Recherche des informations...</Text>
                    </View>
                )}

                <Text className="text-gray-900 font-bold text-base mb-2">Nom du produit *</Text>
                <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <List size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            placeholder="Ex: Pommes Golden"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Code-barres</Text>
                <View className="flex-row items-center space-x-3 mb-5">
                    <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center shadow-sm">
                        <TextInput
                            placeholder="Saisir ou scanner"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={barcode}
                            onChangeText={setBarcode}
                            keyboardType="numeric"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={openScanner}
                        className="bg-green-700 w-14 h-14 items-center justify-center rounded-xl shadow-md"
                    >
                        <Scan size={26} color="white" />
                    </TouchableOpacity>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Catégorie *</Text>
                <TouchableOpacity className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center justify-between mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <View className="bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
                            <List size={18} color="#2E7D32" />
                        </View>
                        <TextInput
                            placeholder="Sélectionner ou saisir"
                            className="text-gray-800 text-base flex-1"
                            value={category}
                            onChangeText={setCategory}
                        />
                    </View>
                    <ChevronDown size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View className="flex-row justify-between mb-5">
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Prix d'achat *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">DH</Text>
                            <TextInput
                                placeholder="0,00"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                                value={purchasePrice}
                                onChangeText={setPurchasePrice}
                            />
                        </View>
                    </View>
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Prix de vente *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">DH</Text>
                            <TextInput
                                placeholder="0,00"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                                value={sellingPrice}
                                onChangeText={setSellingPrice}
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between mb-5">
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Quantité *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 flex-row items-center shadow-sm">
                            <Text className="text-gray-400 mr-2">#</Text>
                            <TextInput
                                placeholder="0"
                                keyboardType="numeric"
                                className="flex-1 text-base text-gray-800"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>
                    </View>
                    <View className="w-[48%]">
                        <Text className="text-gray-900 font-bold text-base mb-2">Expiration</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center shadow-sm">
                            <TextInput
                                placeholder="DD/MM/YYYY"
                                className="text-base text-gray-800"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Description</Text>
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-32 mb-6">
                    <TextInput
                        placeholder="Informations supplémentaires..."
                        multiline
                        numberOfLines={4}
                        className="text-base text-gray-800"
                        style={{ textAlignVertical: 'top' }}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                    className="bg-green-700 py-4 rounded-2xl items-center flex-row justify-center shadow-lg"
                    onPress={() => Alert.alert("Enregistrement", "Produit ajouté au stock !")}
                >
                    <Save size={22} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-lg ml-2">Enregistrer le produit</Text>
                </TouchableOpacity>
            </View>

            {/* Scanner Modal */}
            <Modal
                visible={isScannerVisible}
                animationType="slide"
                transparent={false}
            >
                <View className="flex-1 bg-black">
                    <SafeAreaView className="flex-1">
                        <View className="flex-row justify-between items-center p-6">
                            <Text className="text-white text-xl font-bold">Scanner un produit</Text>
                            <TouchableOpacity
                                onPress={() => setIsScannerVisible(false)}
                                className="bg-white/20 p-2 rounded-full"
                            >
                                <X size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 justify-center items-center">
                            <View className="w-64 h-64 border-2 border-green-500 rounded-3xl overflow-hidden relative">
                                <CameraView
                                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ["qr", "ean13", "ean8", "code128"],
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                                <View className="absolute top-0 left-0 right-0 bottom-0 border-[40px] border-black/50" />
                                <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-sm" />
                            </View>
                            <Text className="text-white mt-8 text-center px-10">
                                Placez le code-barres au centre du carré pour scanner automatiquement.
                            </Text>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
