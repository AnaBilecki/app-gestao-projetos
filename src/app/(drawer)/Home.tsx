import { Link } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const items = [
    { label: "Clientes", icon: "person", href: "/customers/List" },
    { label: "Etapas", icon: "summarize", href: "/steps/List" },
    { label: "Projetos", icon: "folder", href: "/projects/List" },
    { label: "Status", icon: "library-add-check", href: "/trackings/List" },
    { label: "Configurações", icon: "settings", href: "/Export" },
];

export default function Home() {
    return (
        <View style={styles.container}>
            {items.map((item) => (
                <Link key={item.label} href={item.href} asChild>
                    <Pressable style={styles.card}>
                        <MaterialIcons name={item.icon as any} size={32} color="#9B7E66" />
                        <Text style={styles.label}>{item.label}</Text>
                    </Pressable>
                </Link>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#ece9dd",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: 24,
    },
    card: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 120,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    label: {
        marginTop: 8,
        fontFamily: "SweetSansProRegular",
        color: "#9B7E66",
        fontSize: 14,
    },
});