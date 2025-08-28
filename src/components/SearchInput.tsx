import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type SearchInputProps = TextInputProps & {};

export function SearchInput(props: SearchInputProps) {
  return (
    <View style={styles.container}>
        <MaterialIcons name="search" size={20} color="#9B7E66" style={styles.icon} />
        <TextInput
            placeholder="Pesquisar"
            style={styles.input}
            {...props}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        height: 55,
        borderWidth: 1,
        borderColor: "#c8af9a",
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 15,
        fontFamily: "SweetSansProRegular",
        paddingVertical: 0,
    },
});
