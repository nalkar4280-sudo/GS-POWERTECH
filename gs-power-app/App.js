import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Image, 
    Alert, 
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Linking
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Configuration
const BACKEND_URL = 'http://YOUR_LOCAL_IP:5000'; // Update this with your computer's IP address

export default function App() {
    const [scanned, setScanned] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [form, setForm] = useState({
        name: '',
        phone: '',
        location: '',
        monthlyBill: ''
    });
    const [loading, setLoading] = useState(false);

    // Initial permission request
    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);

    const handleFormSubmit = async () => {
        if (!form.name || !form.phone || !form.location || !form.monthlyBill) {
            Alert.alert("Missing Info", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/enquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", data.message);
                setForm({ name: '', phone: '', location: '', monthlyBill: '' });
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not connect to the server. Make sure it's running and your IP is correct.");
        } finally {
            setLoading(false);
        }
    };

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);
        setShowScanner(false);
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber: data, timestamp: new Date().toISOString() })
            });
            const resData = await response.json();
            if (resData.success) {
                Alert.alert("Scan Successful", `Device ID: ${data}\nLogged to server!`);
            }
        } catch (error) {
            Alert.alert("Scan Offline", `Device ID: ${data}\n(Could not log to server)`);
        } finally {
            setScanned(false);
        }
    };

    if (showScanner) {
        if (!permission) return <View style={styles.container}><ActivityIndicator size="large" color="#fbbf24" /></View>;
        if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>We need your permission to show the camera</Text>
                    <TouchableOpacity style={styles.button} onPress={requestPermission}>
                        <Text style={styles.buttonText}>Grant Permission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {marginTop: 20, backgroundColor: '#666'}]} onPress={() => setShowScanner(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <CameraView 
                style={StyleSheet.absoluteFillObject} 
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "code128"] }}
            >
                <SafeAreaView style={styles.scannerOverlay}>
                    <View style={styles.scannerHeader}>
                        <Text style={styles.scannerTitle}>Scan Equipment</Text>
                        <TouchableOpacity onPress={() => setShowScanner(false)}>
                            <Text style={styles.closeBtn}>&times;</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.scannerBox} />
                    <Text style={styles.scannerInstruction}>Point your camera at a barcode</Text>
                </SafeAreaView>
            </CameraView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logoText}>GS <Text style={{color: '#fbbf24'}}>Powertech</Text></Text>
                    <TouchableOpacity style={styles.scanBtn} onPress={() => setShowScanner(true)}>
                        <Text style={styles.scanBtnText}>Scan</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero */}
                <View style={[styles.glass, styles.hero]}>
                    <Text style={styles.heroTag}>Solar Energy Leader</Text>
                    <Text style={styles.heroTitle}>Power Your Home with Smart Solar</Text>
                    <Text style={styles.heroSubtitle}>Save up to 90% on electricity bills.</Text>
                </View>

                {/* Contact Form */}
                <View style={[styles.glass, styles.formContainer]}>
                    <Text style={styles.formTitle}>Book Free Consultation</Text>
                    
                    <TextInput 
                        style={styles.input} 
                        placeholder="Your Name" 
                        value={form.name}
                        onChangeText={(t) => setForm({...form, name: t})}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Phone Number" 
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(t) => setForm({...form, phone: t})}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Location" 
                        value={form.location}
                        onChangeText={(t) => setForm({...form, location: t})}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Avg Monthly Bill (₹)" 
                        keyboardType="numeric"
                        value={form.monthlyBill}
                        onChangeText={(t) => setForm({...form, monthlyBill: t})}
                    />

                    <TouchableOpacity 
                        style={styles.submitBtn} 
                        onPress={handleFormSubmit}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>Submit Enquiry</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.submitBtn, {backgroundColor: '#25D366', marginTop: 15}]} 
                        onPress={() => {
                            Linking.openURL('whatsapp://send?phone=917620983621').catch(() => {
                                Linking.openURL('https://wa.me/917620983621');
                            });
                        }}
                    >
                        <Text style={[styles.submitBtnText, {color: 'white'}]}>Chat on WhatsApp</Text>
                    </TouchableOpacity>
                </View>

                {/* Branding Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 GS Powertech. ISO 9001:2015 Certified.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
    },
    scanBtn: {
        backgroundColor: '#fbbf24',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    scanBtnText: {
        fontWeight: '700',
        color: '#a16207',
    },
    glass: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    heroTag: {
        fontSize: 12,
        color: '#fbbf24',
        fontWeight: '800',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        color: '#1e293b',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 10,
    },
    formContainer: {
        marginBottom: 30,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    submitBtn: {
        backgroundColor: '#fbbf24',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#a16207',
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 12,
    },
    // Scanner Styles
    scannerOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scannerHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    scannerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
    },
    closeBtn: {
        color: 'white',
        fontSize: 35,
        fontWeight: '300',
    },
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fbbf24',
        borderRadius: 20,
    },
    scannerInstruction: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#fbbf24',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        fontWeight: '700',
    }
});
