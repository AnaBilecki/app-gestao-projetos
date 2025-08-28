import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { Input } from "src/components/Input";
import { useCustomerDatabase } from "src/database/useCustomerDatabase";
import { router } from "expo-router";
import { Toast } from "src/components/Toast";

export default function NewCustomer() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const customerDatabase = useCustomerDatabase();

    async function save() {
        const errorMessage = validateFields();
        if (errorMessage) {
            setToast({ message: errorMessage, type: "error" });
            return;
        }
        
        try {
            const rawPhone = unmaskPhone(phone);
            await customerDatabase.create({ name, email, phone: rawPhone, city, state });
            clearData();
            setToast({ message: "Cliente cadastrado com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/customers/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao criar cliente.", type: "error" });
        }
    }

    const handlePhoneChange = (text: string) => {
        setPhone(formatPhone(text));
    };

    function formatPhone(value: string) {
        const digits = value.replace(/\D/g, "");
        let formatted = "";

        if (digits.length > 0) formatted += "(" + digits.substring(0, 2);
        if (digits.length >= 3) formatted += ") " + digits.substring(2, 7);
        if (digits.length >= 8) formatted += "-" + digits.substring(7, 11);

        return formatted;
    }

    function unmaskPhone(phone: string) {
        return phone.replace(/\D/g, "");
    }

    function validateFields() {
        if (!name.trim() || !email.trim() || !phone.trim() || !city.trim() || !state.trim()) {
            return "Todos os campos são obrigatórios.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Formato de e-mail inválido.";
        }
        const digits = phone.replace(/\D/g, "");
        if (digits.length !== 11) {
            return "Telefone inválido.";
        }
        return null;
    }

    function clearData() {
        setName("");
        setEmail("");
        setPhone("");
        setCity("");
        setState("");
    }

    return (
        <View style={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}

            <Input 
                placeholder="Nome" 
                onChangeText={setName} 
                value={name}
            />
            <Input 
                placeholder="E-mail" 
                onChangeText={setEmail} 
                value={email} 
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false} 
            />
            <Input 
                placeholder="Telefone" 
                onChangeText={handlePhoneChange} 
                value={phone}
                keyboardType="numeric"
                maxLength={15}
            />
            <Input 
                placeholder="Cidade" 
                onChangeText={setCity} 
                value={city} 
            />
            <Input 
                placeholder="Estado" 
                onChangeText={setState} 
                value={state}
                maxLength={2}
                autoCapitalize="characters"
            />

            <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>SALVAR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        backgroundColor: "#ece9dd",
    },
    saveButton: {
        backgroundColor: "#c8af9a",
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        marginTop: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
    },
});