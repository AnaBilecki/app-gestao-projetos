import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "src/components/Input";
import { Toast } from "src/components/Toast";
import { useStepDatabase } from "src/database/useStepDatabase";

export default function NewStep() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const stepDatabase = useStepDatabase();

    async function save() {
        const errorMessage = validateFields();
        if (errorMessage) {
            setToast({ message: errorMessage, type: "error" });
            return;
        }

        try {
            await stepDatabase.create({ name, description });
            clearData();
            setToast({ message: "Etapa cadastrada com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/steps/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao criar etapa.", type: "error" });
        }
    }

    function validateFields() {
        if (!name.trim()) {
            return "O campo nome é obrigatório.";
        }
        return null;
    }

    function clearData() {
        setName("");
        setDescription("");
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
                placeholder="Descrição" 
                onChangeText={setDescription} 
                value={description}
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