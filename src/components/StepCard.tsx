import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
    data: {
        name: string,
        description: string
    },
    onDelete: () => void,
    onPress: () => void
};

export function StepCard({ data, onDelete, onPress, ...rest }: Props) {
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
                {data.description && (
                    <Text style={styles.description}>{data.description}</Text>
                )}
            </View>
        </Pressable>
    );
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
    description: {
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