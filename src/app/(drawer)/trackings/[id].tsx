import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Toast } from "src/components/Toast";
import { useProjectDatabase } from "src/database/useProjectDatabase";
import { Project } from "src/types/Project";
import { MaterialIcons } from "@expo/vector-icons";
import { addBusinessDays, formatDateBR } from "src/utils/Util";

export default function EditTracking() {
    const { id } = useLocalSearchParams();

    const [project, setProject] = useState<Project | null>(null);
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
                setProject(project);
            }
        } catch (error) {
            setToast({ message: "Erro ao consultar projeto.", type: "error" });
        }
    }

    async function save() {
        if (!project) return;

        try {
            const orderedSteps = project.steps?.map((step, index) => ({
                ...step,
                stepOrder: index + 1,
            })) ?? [];

            await projectDatabase.update({
                ...project,
                steps: orderedSteps
            });

            setToast({ message: "Acompanhamento atualizado com sucesso!", type: "success" });
            setTimeout(() => {
                router.replace("/trackings/List");
            }, 1500);
        } catch (error) {
            setToast({ message: "Erro ao salvar acompanhamento.", type: "error" });
        }
    }

    function toggleStepCompleted(index: number) {
        if (!project) return;
        const updatedSteps = [...project.steps!];
        updatedSteps[index].completed = !updatedSteps[index].completed;

        const selectedStep = updatedSteps[index];

        if (
            selectedStep.name.toLowerCase().includes("assinatura do contrato") &&
            updatedSteps[index].completed
        ) {
            const now = new Date();

            if (!project.startDate) {
                project.startDate = formatDateBR(now);
            }

            if (!project.endDate && project.deadline) {
                const endDate = addBusinessDays(now, project.deadline);
                project.endDate = formatDateBR(endDate);
            }
        } else if (selectedStep.name.toLowerCase().includes("assinatura do contrato")) {
            project.startDate =  null;
            project.endDate = null;
        }

        setProject({ ...project, steps: updatedSteps });
    }

    function moveStep(index: number, direction: number) {
        if (!project) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= project.steps!.length) return;

        const updatedSteps = [...project.steps!];
        const temp = updatedSteps[index];
        updatedSteps[index] = updatedSteps[newIndex];
        updatedSteps[newIndex] = temp;

        setProject({ ...project, steps: updatedSteps });
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

            {project && (
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{project.name}</Text>

                    <Text style={styles.subtitle}>
                        <Text style={styles.label}>Cliente: </Text>{project.customerName}
                    </Text>
                    <Text style={styles.subtitle}>
                        <Text style={styles.label}>Início: </Text>{project.startDate || "Não definido"}
                    </Text>
                    <Text style={styles.subtitle}>
                        <Text style={styles.label}>Término: </Text>{project.endDate || "Não definido"}
                    </Text>
                    <Text style={styles.subtitle}>
                        <Text style={styles.label}>Etapas concluídas: </Text>
                        {project.steps?.filter(s => s.completed).length} de {project.steps?.length}
                    </Text>
                </View>
            )}

            <FlatList
                data={project?.steps}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.stepRow}>
                        <TouchableOpacity
                            onPress={() => toggleStepCompleted(index)}
                            style={[styles.checkbox, item.completed && styles.checked]}
                        />
                        <Text style={styles.stepText}>{item.name}</Text>

                        <TouchableOpacity onPress={() => moveStep(index, -1)}>
                            <MaterialIcons name="arrow-upward" size={18} color="#9B7E66" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveStep(index, 1)}>
                            <MaterialIcons name="arrow-downward" size={18} color="#9B7E66" />
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ gap: 10 }}
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
    infoContainer: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontFamily: "SweetSansProHeavy",
        color: "#9B7E66",
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "SweetSansProRegular",
        marginTop: 8,
    },
    label: {
        fontFamily: "SweetSansProHeavy",
        color: "#9B7E66",
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#9B7E66",
    },
    checked: {
        backgroundColor: "#A5D6A7",
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "SweetSansProRegular",
    },
    saveButton: {
        backgroundColor: "#c8af9a",
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        marginBottom: 30,
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