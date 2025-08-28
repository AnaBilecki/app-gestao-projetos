import { Drawer } from "expo-router/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, StyleSheet, View } from "react-native";

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                drawerLabelStyle: {
                    color: "#9B7E66",
                    fontFamily: "SweetSansProRegular",
                    fontSize: 16,
                },
                drawerActiveTintColor: "#c8af9a",
                drawerInactiveTintColor: "#c8af9a",
                headerTitleStyle: {
                    color: "#9B7E66",
                    fontFamily: "SweetSansProMedium",
                    fontSize: 18,
                    lineHeight: 22,
                    paddingTop: 3,
                },
                headerTintColor: "#9B7E66",
            }}
            drawerContent={(props) => (
                <DrawerContentScrollView {...props}>
                    <View style={styles.logoContainer}>
                        <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
                    </View>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            )}
        >
            <Drawer.Screen 
                name="Home"
                options={{ 
                    title: "INÍCIO",   
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }} 
            />
            <Drawer.Screen 
                name="customers/List" 
                options={{
                    title: "CLIENTES",
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }} 
            />
            <Drawer.Screen name="customers/Create" options={{ title: "CADASTRAR CLIENTE", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="customers/[id]" options={{ title: "EDITAR CLIENTE", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen 
                name="steps/List" 
                options={{
                    title: "ETAPAS",
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="summarize" size={size} color={color} />
                    ),
                }} 
            />
            <Drawer.Screen name="steps/Create" options={{ title: "CADASTRAR ETAPA", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="steps/[id]" options={{ title: "EDITAR ETAPA", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen 
                name="projects/List" 
                options={{
                    title: "PROJETOS",
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="folder" size={size} color={color} />
                    ),
                }} 
            />
            <Drawer.Screen name="projects/Create" options={{ title: "CADASTRAR PROJETO", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="projects/[id]" options={{ title: "EDITAR PROJETO", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen 
                name="trackings/List" 
                options={{
                    title: "STATUS",
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="library-add-check" size={size} color={color} />
                    ),
                }} 
            />
            <Drawer.Screen name="trackings/[id]" options={{ title: "ACOMPANHAMENTO", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen 
                name="Export" 
                options={{
                    title: "CONFIGURAÇÕES",
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: "center",
        padding: 16,
        marginBottom: 8,
        height: 100
    },
    logo: {
        width: 250,
        height: 80,
        resizeMode: "contain"
    },
});