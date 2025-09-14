import { Pressable, StyleSheet, Text, Vibration } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    type: "number" | "operator" | "clear";
}

export default function Button(Props: ButtonProps) {
    return (
        <Pressable
            style={[
                styles.button,
                Props.type === "operator" && styles.operator,
                Props.type === "clear" && styles.clear,
            ]}
            onPress={() => {
                Vibration.vibrate(70);
                Props.onPress()
            }}

        >
            <Text style={styles.buttonText}>{Props.title}</Text>
        </Pressable >
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#fff",
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        marginBottom: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        shadowColor: "#000",
    },
    buttonText: {
        color: "#3d3d3d",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 28,
        fontWeight: "bold",
    },
    operator: {
        backgroundColor: "#f0ad4e",
    },
    clear: {
        backgroundColor: "#d9534f",
    },

})