import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Barcode, Camera as CameraIcon, ChevronDown, List, Save, Scale, Tag, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
import { auth, db } from '../../firebaseConfig';

export default function AddProductScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [barcode, setBarcode] = useState('');
    const [description, setDescription] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [brand, setBrand] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [nutriments, setNutriments] = useState(null);
    const [nutriscore, setNutriscore] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [productSize, setProductSize] = useState('');

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAutoProPhoto, setIsAutoProPhoto] = useState(true);

    useEffect(() => {
        if (isEditing) {
            fetchProductData();
        }
    }, [id]);

    const fetchProductData = async () => {
        setIsFetchingInfo(true);
        try {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || '');
                setCategory(data.category || '');
                setPurchasePrice(data.purchasePrice?.toString() || '');
                setSellingPrice(data.sellingPrice?.toString() || '');
                setQuantity(data.quantity?.toString() || '');
                setBarcode(data.barcode || '');
                setDescription(data.description || '');
                setProductImage(data.image || null);
                setBrand(data.brand || '');
                setIngredients(data.ingredients || '');
                setNutriments(data.nutriments || null);
                setNutriscore(data.nutriscore || '');
                setExpirationDate(data.expirationDate || '');
                setProductSize(data.productSize || '');
            } else {
                Alert.alert("Erreur", "Produit non trouvé");
                router.back();
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            Alert.alert("Erreur", "Impossible de charger les données du produit");
        } finally {
            setIsFetchingInfo(false);
        }
    };

    const fetchProfessionalImage = async (code) => {
        try {
            console.log("Fetching pro image from UPCitemdb:", code);
            const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
            const data = await response.json();

            if (data.items && data.items.length > 0 && data.items[0].images && data.items[0].images.length > 0) {
                return data.items[0].images[0];
            }
        } catch (error) {
            console.error("UPCitemdb API Error:", error);
        }
        return null;
    };

    const fetchProductFromOFF = async (code) => {
        setIsFetchingInfo(true);
        try {
            console.log("Fetching from Moroccan Open Food Facts:", code);

            const offPromise = fetch(`https://ma-fr.openfoodfacts.org/api/v2/product/${code}.json`);
            const proImagePromise = isAutoProPhoto ? fetchProfessionalImage(code) : Promise.resolve(null);

            const [offResponse, proImage] = await Promise.all([offPromise, proImagePromise]);
            const data = await offResponse.json();

            if (data.status === 1) {
                const product = data.product;

                const categoryMapping = {
                    'beverages': 'Boissons',
                    'beverages-and-beverages-preparations': 'Boissons et préparations de boissons',
                    'waters': 'Eaux',
                    'spring-waters': 'Eaux de sources',
                    'mineral-waters': 'Eaux minérales',
                    'natural-mineral-waters': 'Eaux minérales naturelles',
                    'unsweetened-beverages': 'Boissons sans sucre ajouté',
                    'snacks': 'Snacks',
                    'sweet-snacks': 'Snacks sucrés',
                    'biscuits-and-cakes': 'Biscuits et gâteaux',
                    'dairies': 'Produits laitiers',
                    'fermented-foods': 'Produits fermentés',
                    'fermented-milk-products': 'Produits laitiers fermentés',
                    'plant-based-foods-and-beverages': 'Aliments et boissons à base de végétaux',
                    'plant-based-foods': 'Aliments d\'origine végétale',
                    'groceries': 'Épicerie'
                };

                let detectedCategory = '';
                if (product.categories_tags && product.categories_tags.length > 0) {
                    const frTag = product.categories_tags.find(tag => tag.startsWith('fr:'));
                    if (frTag) {
                        detectedCategory = frTag.replace('fr:', '').replace(/-/g, ' ');
                    } else {
                        const cleanTag = product.categories_tags[0].replace('en:', '').replace('fr:', '');

                        if (categoryMapping[cleanTag]) {
                            detectedCategory = categoryMapping[cleanTag];
                        } else {
                            detectedCategory = cleanTag.replace(/-/g, ' ');
                        }
                    }
                } else if (product.categories) {
                    detectedCategory = product.categories.split(',')[0].trim();
                }

                if (detectedCategory) {
                    detectedCategory = detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1);
                }

                setCategory(detectedCategory || 'Non classé');

                const pName = product.product_name || '';
                const pBrand = product.brands || '';
                const pSize = product.quantity || '';

                const fullDisplayName = [pName, pBrand, pSize].filter(val => val && val.trim() !== '').join(' - ');
                setName(fullDisplayName);

                setProductImage(proImage || product.image_front_url || product.image_url || null);

                setBrand(pBrand);
                setIngredients(product.ingredients_text_fr || product.ingredients_text || '');
                setNutriments(product.nutriments || null);
                setNutriscore(product.nutriscore_grade || '');
                setDescription(product.generic_name_fr || product.generic_name || '');
                setProductSize(pSize);

                if (proImage) {
                    Alert.alert("Produit trouvé !", `${fullDisplayName} détecté avec une photo HD.`);
                } else {
                    Alert.alert("Produit trouvé !", `${fullDisplayName} a été détecté.`);
                }
            } else {
                Alert.alert("Non trouvé", "Ce produit n'existe pas dans la base.");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Erreur", "Impossible de récupérer les informations du produit.");
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

    const handleSaveProduct = async () => {
        if (!name || !category || !purchasePrice || !sellingPrice || !quantity) {
            Alert.alert("Champs manquants", "Veuillez remplir tous les champs obligatoires (*)");
            return;
        }

        setIsSaving(true);
        try {
            const productData = {
                name,
                category,
                brand,
                ingredients,
                nutriments,
                nutriscore,
                purchasePrice: parseFloat(purchasePrice),
                sellingPrice: parseFloat(sellingPrice),
                quantity: parseInt(quantity),
                barcode,
                description,
                image: productImage,
                expirationDate,
                productSize,
                userId: auth.currentUser.uid,
            };

            if (isEditing) {
                await updateDoc(doc(db, "products", id), productData);
            } else {
                productData.createdAt = serverTimestamp();
                await addDoc(collection(db, "products"), productData);
            }

            Alert.alert(
                "Succès",
                isEditing ? "Produit mis à jour !" : "Produit ajouté au stock !",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error("Firestore Save Error:", error);
            Alert.alert("Erreur", "Impossible d'enregistrer le produit.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={['top']} className="bg-green-700">
                <View className="px-4 pt-2 pb-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">
                        {isEditing ? "Modifier le produit" : "Ajouter un produit"}
                    </Text>
                    <TouchableOpacity
                        onPress={handleSaveProduct}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-base">Enregistrer</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                <Text className="text-gray-900 font-bold text-base mb-2">Photo du produit</Text>
                <TouchableOpacity className="bg-white border border-gray-100 rounded-3xl h-56 items-center justify-center mb-4 shadow-sm overflow-hidden">
                    {productImage ? (
                        <View className="w-full h-full bg-white items-center justify-center p-4">
                            <Image
                                source={{ uri: productImage }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>
                    ) : (
                        <View className="items-center">
                            <View className="bg-green-50 p-5 rounded-full mb-3">
                                <CameraIcon size={36} color="#2E7D32" />
                            </View>
                            <Text className="text-green-700 font-bold text-lg">Ajouter une photo</Text>
                            <Text className="text-gray-400 text-sm mt-1">Touchez pour sélectionner</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View className="flex-row items-center justify-between mb-6 px-1">
                    <View className="flex-1 mr-4">
                        <Text className="text-gray-900 font-bold text-sm">Photos Pro Automatiques</Text>
                        <Text className="text-gray-400 text-xs">Arrière-plan blanc</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsAutoProPhoto(!isAutoProPhoto)}
                        className={`w-12 h-6 rounded-full p-1 ${isAutoProPhoto ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                        <View className={`w-4 h-4 bg-white rounded-full ${isAutoProPhoto ? 'ml-auto' : ''}`} />
                    </TouchableOpacity>
                </View>

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

                <Text className="text-gray-900 font-bold text-base mb-2">Marque</Text>
                <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <Tag size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            placeholder="Ex: Centrale Laitière"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={brand}
                            onChangeText={setBrand}
                        />
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Format / Poids (ex: 450g, 1L)</Text>
                <View className="bg-white border border-gray-200 rounded-xl px-4 h-14 justify-center mb-5 shadow-sm">
                    <View className="flex-row items-center">
                        <Scale size={20} color="#9CA3AF" className="mr-3" />
                        <TextInput
                            placeholder="Ex: 500g ou 33cl"
                            className="flex-1 text-base text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={productSize}
                            onChangeText={setProductSize}
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
                        <Barcode size={26} color="white" />
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
                                value={expirationDate}
                                onChangeText={setExpirationDate}
                            />
                        </View>
                    </View>
                </View>

                <Text className="text-gray-900 font-bold text-base mb-2">Description</Text>
                <View className="bg-white border border-gray-200 rounded-xl p-4 h-32 mb-6 shadow-sm">
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
                    className={`py-4 rounded-2xl items-center flex-row justify-center shadow-lg ${isSaving ? 'bg-green-600 opacity-70' : 'bg-green-700'}`}
                    onPress={handleSaveProduct}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="white" className="mr-2" />
                    ) : (
                        <Save size={22} color="white" className="mr-2" />
                    )}
                    <Text className="text-white font-bold text-lg ml-2">
                        {isSaving ? "Enregistrement..." : (isEditing ? "Mettre à jour le produit" : "Enregistrer le produit")}
                    </Text>
                </TouchableOpacity>
            </View>

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
