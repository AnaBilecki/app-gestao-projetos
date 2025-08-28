import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Toast } from "src/components/Toast";
import { MaterialIcons } from "@expo/vector-icons";
import { Step } from "src/types/Step";
import { useStepDatabase } from "src/database/useStepDatabase";
import { SearchInput } from "src/components/SearchInput";
import { StepCard } from "src/components/StepCard";

export default function Steps() {
    const [search, setSearch] = useState("");
    const [steps, setSteps] = useState<Step[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const stepDatabase = useStepDatabase();

    useFocusEffect(
        useCallback(() => {
            list();
        }, [])
    );

    useEffect(() => {
        list();
    }, [search]);
    
    async function list() {
        try {
            const response = await stepDatabase.searchByName(search);
            setSteps(response);
        } catch (error) {
            setToast({ message: "Erro ao listar etapas.", type: "error" });
        }
    }

    async function remove(id: number) {
        try {
            const projects = await stepDatabase.hasProjects(id);
            if (projects) {
                setToast({ message: "Não é possível remover a etapa pois está vinculada a projetos.", type: "error" });
                return;
            }

            await stepDatabase.remove(id);
            await list();
            setToast({ message: "Etapa removida com sucesso!", type: "success" });
        } catch (error) {
             setToast({ message: "Erro ao remover etapa.", type: "error" });
        }
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

            <Link href="/steps/Create" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </Link>

            <SearchInput placeholder="Busque pelo nome" onChangeText={setSearch} />
            
            <FlatList
                data={steps}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <StepCard
                        data={item}
                        onDelete={() => remove(item.id)}
                        onPress={() => router.push(`/steps/${item.id}`)}
                    />
                )}
                contentContainerStyle={{ gap: 5 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", 
        padding: 32, 
        gap: 16,
        backgroundColor: "#ece9dd"
    },
    addButton: {
        position: "absolute",
        bottom: 32,
        right: 32,
        padding: 16,
        borderRadius: 50,
        backgroundColor: "#c8af9a",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
    },
});