import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useCategoryDatabase } from "src/database/useCategoryDatabase";

type Category = {
    id: number;
    name: string;
};

type Props = {
    value?: Category,
    onSelect: (category: Category) => void;
};

export default function CategorySelect({ value, onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Category[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const categoryDatabase = useCategoryDatabase();

    useEffect(() => {
        if (value) {
            setQuery(value.name);
        } else {
            setQuery("");
        }
    }, [value]);
    
    useEffect(() => {
        const searchCategories = async () => {
            if (query.length >= 2) {
                const results = await categoryDatabase.searchByName(query);
                setSuggestions(results);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        searchCategories();
    }, [query]);
    
    const handleSelect = (category: Category) => {
        onSelect(category);
        setQuery(category.name);
        setShowSuggestions(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Categoria"
                placeholderTextColor="#9E9E9E"
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    setShowSuggestions(true);
                }}
                style={styles.input}
            />

            {showSuggestions && suggestions.length > 0 && (
                <FlatList 
                    data={suggestions}
                    keyExtractor={(item) => String(item.id)}
                    style={styles.dropdown}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <Pressable style={styles.option} onPress={() => handleSelect(item)}>
                            <Text>{item.name}</Text>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        width: "100%",
        position: "relative",
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
        borderWidth: 1,
        borderColor: "#c8af9a",
    },
    dropdown: {
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#c8af9a",
        borderRadius: 8,
        maxHeight: 200,
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        fontFamily: "SweetSansProRegular",
    },
});