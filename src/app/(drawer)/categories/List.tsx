import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Toast } from "src/components/Toast";
import { MaterialIcons } from "@expo/vector-icons";
import { useCategoryDatabase } from "src/database/useCategoryDatabase";
import { Category } from "src/types/Category";
import { SearchInput } from "src/components/SearchInput";
import { CategoryCard } from "src/components/CategoryCard";

export default function Categories() {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const categoryDatabase = useCategoryDatabase();

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
            const response = await categoryDatabase.searchByName(search);
            setCategories(response);
        } catch (error) {
            setToast({ message: "Erro ao listar categorias.", type: "error" });
        }
    }

    async function remove(id: number) {
        try {
            const projects = await categoryDatabase.hasSteps(id);
            if (projects) {
                setToast({ message: "Não é possível remover a categoria pois está vinculada a etapas.", type: "error" });
                return;
            }

            await categoryDatabase.remove(id);
            await list();
            setToast({ message: "Categoria removida com sucesso!", type: "success" });
        } catch (error) {
            setToast({ message: "Erro ao remover categoria.", type: "error" });
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

            <Link href="/categories/Create" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </Link>

            <SearchInput placeholder="Busque pelo nome" onChangeText={setSearch} />

            <FlatList
                data={categories}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CategoryCard
                        data={item}
                        onDelete={() => remove(item.id)}
                        onPress={() => router.push(`/categories/${item.id}`)}
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