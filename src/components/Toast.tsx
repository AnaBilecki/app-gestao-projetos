import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";

type ToastType = "success" | "error";

type ToastProps = {
    message: string;
    type?: ToastType;
    duration?: number;
    onHide?: () => void;
};

const toastColors: Record<ToastType, string> = {
    success: "#A5D6A7",
    error: "#EF9A9A",
};

export function Toast({
    message,
    type = "success",
    duration = 3000,
    onHide,
}: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onHide?.();
        });
        }, duration);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Animated.View style={[styles.toast, { backgroundColor: toastColors[type], opacity }]}>
        <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        zIndex: 999,
        elevation: 5,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SweetSansProMedium",
        textAlign: "center",
    },
});
