import "react-native-gesture-handler";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../database/initializeDatabase";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import 'react-native-screens';
import { enableScreens } from 'react-native-screens';

enableScreens();
SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [fontsLoaded] = useFonts({
        SweetSansProRegular: require("../../assets/fonts/SweetSansProRegular.otf"),
        SweetSansProMedium: require("../../assets/fonts/SweetSansProMedium.otf"),
        SweetSansProHeavy: require("../../assets/fonts/SweetSansProHeavy.otf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    if (!fontsLoaded) return null;

    return (
        <SQLiteProvider databaseName="gestaoProjeto.db" onInit={initializeDatabase}>
            <View style={styles.container} onLayout={onLayoutRootView}>
                <Slot />
            </View>
        </SQLiteProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8d0d0"
    }
});