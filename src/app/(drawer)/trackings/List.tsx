import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ProjectStatusCard } from "src/components/ProjectStatusCard";
import { SearchInput } from "src/components/SearchInput";
import { Toast } from "src/components/Toast";
import { useProjectDatabase } from "src/database/useProjectDatabase";
import { Project } from "src/types/Project";

export default function Trackings() {
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

    return (
        <View style={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}

            <SearchInput placeholder="Busque pelo nome" onChangeText={setSearch} />
        
            <FlatList
                data={projects}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ProjectStatusCard 
                        data={{ name: item.name, customerName: item.customerName, startDate: item.startDate, endDate: item.endDate, steps: item.steps }}
                        onPress={() => router.push(`/trackings/${item.id}`)}
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
    }
});