import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useCustomerDatabase } from "src/database/useCustomerDatabase";
import { Customer } from "src/types/Customer";
import { CustomerCard } from "src/components/CustomerCard";
import { Link, useFocusEffect, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchInput } from "src/components/SearchInput";
import { Toast } from "src/components/Toast";

export default function Customers() {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const customerDatabase = useCustomerDatabase();

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
            const response = await customerDatabase.searchByName(search);
            setCustomers(response);
        } catch (error) {
            setToast({ message: "Erro ao listar clientes.", type: "error" });
        }
    }

    async function remove(id: number) {
        try {
            const projects = await customerDatabase.hasProjects(id);
            if (projects) {
                setToast({ message: "Não é possível remover o cliente pois há projetos vinculados.", type: "error" });
                return;
            }

            await customerDatabase.remove(id);
            await list();
            setToast({ message: "Cliente removido com sucesso!", type: "success" });
        } catch (error) {
            setToast({ message: "Erro ao remover cliente.", type: "error" });
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

            <Link href="/customers/Create" asChild>
                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </Link>

            <SearchInput placeholder="Busque pelo nome" onChangeText={setSearch} />

            <FlatList
                data={customers}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CustomerCard 
                        data={item}
                        onDelete={() => remove(item.id)}
                        onPress={() => router.push(`/customers/${item.id}`)}
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