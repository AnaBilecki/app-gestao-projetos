import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Toast } from "src/components/Toast";
import * as DocumentPicker from "expo-document-picker";

export default function ExportData() {
     const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const database = useSQLiteContext();
    
    async function exportData() {
        try {
            const tables = ["customers", "steps", "projects", "project_steps"];
            const data: Record<string, any[]> = {};

            for (const table of tables) {
                const result = await database.getAllAsync(`SELECT * FROM ${table}`);
                data[table] = result;
            }

            const json = JSON.stringify(data, null, 2);
            const fileUri = `${FileSystem.documentDirectory}backup-dados.json`;
            await FileSystem.writeAsStringAsync(fileUri, json);

            await Sharing.shareAsync(fileUri);
            setToast({ message: "Dados exportados com sucesso!", type: "success" });
        } catch (error) {
            setToast({ message: "Erro ao exportar dados.", type: "error" });
        }
    }

    async function importData() {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                multiple: false,
                copyToCacheDirectory: true,
            });

            const file = result.assets?.[0];
            if (!file) return;

            const jsonString = await FileSystem.readAsStringAsync(file.uri);
            const data = JSON.parse(jsonString);

            await database.execAsync("BEGIN TRANSACTION");
            for (const table in data) {
                for (const row of data[table]) {
                    const columns = Object.keys(row).join(", ");
                    const placeholders = Object.keys(row).map(() => "?").join(", ");
                    const values = Object.values(row);
                    await database.runAsync(
                        `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`,
                        values as (string | number | null)[]
                    );
                }
            }
            await database.execAsync("COMMIT");
            setToast({ message: "Dados importados com sucesso!", type: "success" });
        } catch (error) {
            setToast({ message: "Erro ao importar dados.", type: "error" });
            await database.execAsync("ROLLBACK");
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

            <TouchableOpacity style={styles.button} onPress={exportData}>
                <Text style={styles.buttonText}>EXPORTAR DADOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={importData}>
                <Text style={styles.buttonText}>IMPORTAR DADOS</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        backgroundColor: "#ece9dd",
    },
    button: {
        backgroundColor: "#c8af9a",
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
    },
});