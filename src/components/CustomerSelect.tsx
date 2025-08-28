import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useCustomerDatabase } from "src/database/useCustomerDatabase";

type Customer = {
    id: number;
    name: string;
};

type Props = {
    value?: Customer,
    onSelect: (customer: Customer) => void;
};

export default function CustomerSelect({ value, onSelect }: Props) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Customer[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const customerDatabase = useCustomerDatabase();

    useEffect(() => {
        if (value) {
            setQuery(value.name);
        } else {
            setQuery("");
        }
    }, [value]);
    
    useEffect(() => {
        const searchCustomers = async () => {
            if (query.length >= 2) {
                const results = await customerDatabase.searchByName(query);
                setSuggestions(results);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        searchCustomers();
    }, [query]);
    
    const handleSelect = (customer: Customer) => {
        onSelect(customer);
        setQuery(customer.name);
        setShowSuggestions(false);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Cliente"
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