import { StyleSheet, TextInput, TextInputProps } from "react-native";

export function Input({ ...rest }: TextInputProps) {
    return <TextInput style={styles.input} placeholderTextColor="#9E9E9E" {...rest} />
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        fontFamily: "SweetSansProRegular",
        borderWidth: 1,
        borderColor: "#c8af9a",
    },
});