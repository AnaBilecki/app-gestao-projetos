import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
    data: {
        name: string,
        customerName: string | undefined,
        numberOfSteps: number | undefined,
        deadline?: string | number | null
    },
    onDelete: () => void,
    onPress: () => void
};

export function ProjectCard({ data, onDelete, onPress, ...rest }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={styles.card}
            {...rest}
        >
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <MaterialIcons name="close" size={22} color="#e57373" />
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{data.name}</Text>

                <View style={styles.row}>
                    <MaterialIcons name="person" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.customerName}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="summarize" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.numberOfSteps} {data.numberOfSteps === 1 ? "etapa" : "etapas"}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="calendar-today" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.deadline} {data.deadline === 1 ? "dia" : "dias"}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 16,
        margin: 3,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#9b7e66",
        marginBottom: 8,
        fontFamily: "SweetSansProHeavy",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: "SweetSansProRegular",
    },
    deleteButton: {
        position: "absolute",
        top: 12,
        right: 12,
        padding: 4,
        zIndex: 10,
    },
});