import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
    data: {
        name: string,
        email: string,
        phone: string,
        city: string,
        state: string
    },
    onDelete: () => void,
    onPress: () => void
};

export function CustomerCard({ data, onDelete, onPress, ...rest }: Props) {
    function formatPhone(phone: string) {
        const cleaned = phone.replace(/\D/g, "");

        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }

        return phone;
    }

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
                    <MaterialIcons name="email" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.email}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="phone" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{formatPhone(data.phone)}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="location-on" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.city}, {data.state}</Text>
                </View>
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