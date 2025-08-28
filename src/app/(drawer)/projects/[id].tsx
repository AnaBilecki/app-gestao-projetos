import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomerSelect from "src/components/CustomerSelect";
import { Input } from "src/components/Input";
import StepSelect from "src/components/StepSelect";
import { Toast } from "src/components/Toast";
import { useProjectDatabase } from "src/database/useProjectDatabase";
import { CustomerList } from "src/types/Customer";
import { Project, ProjectStep } from "src/types/Project";

export default function EditProject() {
    const { id } = useLocalSearchParams();

    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [projectSteps, setProjectSteps] = useState<number[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | undefined>(undefined);
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const projectDatabase = useProjectDatabase();

    useFocusEffect(
        useCallback(() => {
            loadProject();
        }, [id])
    );

    useEffect(() => {
        loadProject();
    }, [id]);

    async function loadProject() {
        try {
            const project = await projectDatabase.searchById(Number(id));
            if (project) {
                setProjectData(project);
                setName(project.name);
                setDeadline(String(project.deadline));

                if (project.customerId && project.customerName) {
                    setSelectedCustomer({
                        id: project.customerId,
                        name: project.customerName
                    });
                }

                if (project.steps) {
                    setProjectSteps(project.steps.map(step => step.stepId));
                } else {
                    setProjectSteps([]);
                }
            }
        } catch (error) {
            setToast({ message: "Erro ao consultar projeto.", type: "error" });
        }
    }

    async function save() {
        const errorMessage = validateFields();
        if (errorMessage) {
            setToast({ message: errorMessage, type: "error" });
            return;
        }

        if (!projectData || projectData.id === undefined) {
            setToast({ message: "ID do projeto não encontrado.", type: "error" });
            return;
        }
    
        try {
            const updatedSteps: ProjectStep[] = projectSteps.map((stepId) => {
                const existingStep = projectData.steps?.find(s => s.stepId === stepId);
                return {
                    id: existingStep?.id ?? 0,
                    stepId,
                    projectId: projectData.id,
                    completed: existingStep?.completed ?? false,
                    name: existingStep?.name ?? "",
                    description: existingStep?.description,
                };
            });

            await projectDatabase.update({
                ...projectData,
                id: projectData.id,
                name,
                deadline: Number(deadline),
                customerId: selectedCustomer!.id,
                steps: updatedSteps,
            });
            setToast({ message: "Projeto alterado com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/projects/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao alterar projeto.", type: "error" });
        }
    }
    
    function validateFields() {
        if (!name.trim() || !selectedCustomer || !deadline || projectSteps.length == 0) {
            return "Todos os campos são obrigatórios.";
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