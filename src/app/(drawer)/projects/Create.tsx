import { View, Button, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { Toast } from "src/components/Toast";
import { Input } from "src/components/Input";
import CustomerSelect from "src/components/CustomerSelect";
import { Customer, CustomerList } from "src/types/Customer";
import StepSelect from "src/components/StepSelect";
import { useProjectDatabase } from "src/database/useProjectDatabase";
import { router } from "expo-router";

export default function NewProject() {
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [projectSteps, setProjectSteps] = useState<number[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | undefined>(undefined);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const projectDatabase = useProjectDatabase();

    async function save() {
        const errorMessage = validateFields();
        if (errorMessage) {
            setToast({ message: errorMessage, type: "error" });
            return;
        }

        try {
            await projectDatabase.create({
                name,
                customerId: selectedCustomer!.id,
                deadline: Number(deadline),
                startDate: null,
                endDate: null,
                steps: projectSteps.map((stepId) => ({
                    id: 0,
                    stepId,
                    projectId: 0,
                    completed: false,
                    name: "",
                })),
            });
            clearData();
            setToast({ message: "Projeto cadastrado com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/projects/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao criar projeto.", type: "error" });
        }
    }

    function validateFields() {
        if (!name.trim() || !selectedCustomer || !deadline || projectSteps.length == 0) {
            return "Todos os campos são obrigatórios.";
        }
        return null;
    }

    function clearData() {
        setName("");
        setDeadline("");
        setProjectSteps([]);
        setSelectedCustomer(undefined);
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
            <CustomerSelect
                value={selectedCustomer}
                onSelect={(c) => setSelectedCustomer(c)}
            />
            <Input 
                placeholder="Prazo" 
                onChangeText={setDeadline} 
                value={deadline}
                keyboardType="numeric"
            />
            <StepSelect
                selectedStepIds={projectSteps}
                onChange={setProjectSteps}
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