import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
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
    const [sections, setSections] = useState<{ title: string; data: Step[] }[]>([]);

    const stepDatabase = useStepDatabase();
    
    useFocusEffect(
        useCallback(() => {
            const loadSteps = async () => {
                const allSteps = await stepDatabase.searchByName("");

                const grouped: Record<string, Step[]> = {};
                for (const step of allSteps) {
                    const category = step.categoryName || "Sem categoria";
                    if (!grouped[category]) grouped[category] = [];
                    grouped[category].push(step);
                }

                const newSections = Object.entries(grouped).map(([title, data]) => ({
                    title,
                    data,
                }));

                setSections(newSections);
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
            <View style={{ height: 300 }}>
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                    <Pressable style={styles.stepItem} onPress={() => toggleStep(item.id)}>
                        <View style={styles.checkbox}>
                            {selectedStepIds.includes(item.id) && <View style={styles.checked} />}
                        </View>
                        <Text style={styles.stepName}>{item.name}</Text>
                    </Pressable>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    contentContainerStyle={styles.stepListContainer}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    stepListContainer: {
        paddingBottom: 10,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: "700",
        color: "#9b7e66",
        backgroundColor: "#ece9dd",
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginTop: 8,
        borderRadius: 4,
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