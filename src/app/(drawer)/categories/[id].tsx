import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "src/components/Input";
import { Toast } from "src/components/Toast";
import { useCategoryDatabase } from "src/database/useCategoryDatabase";

export default function EditCategory() {
    const { id } = useLocalSearchParams();
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const categoryDatabase = useCategoryDatabase();

    useEffect(() => {
        loadCategory();
    }, [id]);

    async function loadCategory() {
        try {
            const category = await categoryDatabase.searchById(Number(id));
            if (category) {
                setName(category.name);
                setDescription(category.description);
            }
        } catch (error) {
            setToast({ message: "Erro ao consultar categoria.", type: "error" });
        }
    }

    async function save() {
        const errorMessage = validateFields();
        if (errorMessage) {
            setToast({ message: errorMessage, type: "error" });
            return;
        }

        try {
            await categoryDatabase.update({ id: Number(id), name, description });
            setToast({ message: "Categoria alterada com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/categories/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao alterar categoria.", type: "error" });
        }
    }

    function validateFields() {
        if (!name.trim()) {
            return "O campo nome é obrigatório.";
        }
        return null;
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