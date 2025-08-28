import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useStepDatabase } from "src/database/useStepDatabase";

type Step = {
    id: number;
    name: string;
    description?: string;
}

type Props = {
    selectedStepIds: number[];
    onChange: (ids: number[]) => void;
}

export default function StepSelect({ selectedStepIds, onChange }: Props) {
    const [steps, setSteps] = useState<Step[]>([]);

    const stepDatabase = useStepDatabase();
    
    useFocusEffect(
        useCallback(() => {
                const loadSteps = async () => {
                const allSteps = await stepDatabase.searchByName("");
                setSteps(allSteps);
            };

            loadSteps();
        }, [])
    );

    const toggleStep = (id: number) => {
        const newSelected = selectedStepIds.includes(id)
            ? selectedStepIds.filter((s) => s !== id)
            : [...selectedStepIds, id];
        onChange(newSelected);
    };

    return (
        <View>
            <Text style={styles.label}>Etapas:</Text>
            <View style={styles.stepListContainer}>
                <FlatList
                    data={steps}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                    <Pressable style={styles.stepItem} onPress={() => toggleStep(item.id)}>
                        <View style={styles.checkbox}>
                            {selectedStepIds.includes(item.id) && <View style={styles.checked} />}
                        </View>
                        <Text style={styles.stepName}>{item.name}</Text>
                    </Pressable>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    stepListContainer: {
        maxHeight: 300,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "SweetSansProRegular"
    },
    stepItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: "#c8af9a",
        borderRadius: 4,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    checked: {
        width: 14,
        height: 14,
        backgroundColor: "#c8af9a",
        borderRadius: 2,
    },
    stepName: {
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
        flexShrink: 1,
    },
});