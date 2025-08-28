import { Pressable, PressableProps, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ProjectStep } from "src/types/Project";
import { parseDate } from "src/utils/Util";

type Props = PressableProps & {
    data: {
        name: string,
        customerName: string | undefined,
        startDate?: string | null,
        endDate?: string | null,
        steps?: ProjectStep[]
    },
    onPress: () => void
};

export function ProjectStatusCard({ data, onPress, ...rest }: Props) {
    type MaterialIconName = 
        | "schedule"
        | "check-circle"
        | "hourglass-empty"
        | "error";

    const statusInfo = useMemo<{
        label: string;
        color: string;
        icon: MaterialIconName;
    }>(() => {
        const { startDate, endDate, steps } = data;

        if (!startDate || !endDate) {
            return { label: "Pendente", color: "#9E9E9E", icon: "schedule" };
        }

        const allCompleted = steps?.length ? steps.every(s => s.completed) : false;
        const someIncomplete = steps?.some(s => !s.completed);
        const today = new Date();
        const end = parseDate(endDate);

        if (allCompleted) {
            return { label: "Concluído", color: "#A5D6A7", icon: "check-circle" };
        }

        if (someIncomplete && end && end >= today) {
            return { label: "Em andamento", color: "#daa60d", icon: "hourglass-empty" };
        }

        if (someIncomplete && end && end < today) {
            return { label: "Atrasado", color: "#EF9A9A", icon: "error" };
        }

        return { label: "Pendente", color: "#9E9E9E", icon: "schedule" };
    }, [data]);

    const formatDate = (dateStr?: string | null) => {
        const date = parseDate(dateStr);
        if (!date || isNaN(date.getTime())) return "Não definido";
        return date.toLocaleDateString("pt-BR");
    };

    return (
        <Pressable
            onPress={onPress}
            style={styles.card}
            {...rest}
        >
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{data.name}</Text>

                <View style={styles.row}>
                    <MaterialIcons name="person" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>{data.customerName}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="calendar-today" size={18} color="#9B7E66" />
                    <Text style={styles.infoText}>
                        {formatDate(data.startDate)} - {formatDate(data.endDate)}
                    </Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name={statusInfo.icon} size={18} color={statusInfo.color} />
                    <Text style={[styles.infoText, { color: statusInfo.color }]}>
                        {statusInfo.label}
                    </Text>
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
    }
});