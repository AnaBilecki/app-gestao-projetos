import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Toast } from "src/components/Toast";
import { MaterialIcons } from "@expo/vector-icons";
import { Project } from "src/types/Project";
import { useProjectDatabase } from "src/database/useProjectDatabase";
import { SearchInput } from "src/components/SearchInput";
import { FlatList } from "react-native-gesture-handler";
import { ProjectCard } from "src/components/ProjectCard";

export default function Projects() {
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const projectDatabase = useProjectDatabase();

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
            const response = await projectDatabase.searchByName(search);
            setProjects(response);
        } catch (error) {
            setToast({ message: "Erro ao listar projetos.", type: "error" });
        }
    }

    async function remove(id: number) {
        try {
            await projectDatabase.remove(id);
            await list();
            setToast({ message: "Projeto removido com sucesso!", type: "success" });
        } catch (error) {
            setToast({ message: "Erro ao remover projeto.", type: "error" });
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

            <Link href="/projects/Create" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </Link>

            <SearchInput placeholder="Busque pelo nome" onChangeText={setSearch} />
        
            <FlatList
                data={projects}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ProjectCard 
                        data={{ name: item.name, customerName: item.customerName, numberOfSteps: item.steps?.length, deadline: item.deadline }}
                        onDelete={() => remove(item.id)}
                        onPress={() => router.push(`/projects/${item.id}`)}
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