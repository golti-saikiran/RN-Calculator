import evaluate from "@/utils/Evaluate";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

export default function Calculator() {
    const [displayValue, setDisplayValue] = useState("0");
    const [result, setResult] = useState(0);
    const [finalResultDisplayed, setFinalResultDisplayed] = useState(false);
    const [history, setHistory] = useState<{ expr: string, res: number }[]>([]);
    const [pendingHistory, setPendingHistory] = useState<{ expr: string, res: number } | null>(null);

    const isOperator = (char: string) => /[+\-*/%]/.test(char);

    const handleNumberPress = (number: string) => {
        if (finalResultDisplayed) {
            // If there is a pending history item, add it now
            if (pendingHistory) {
                setHistory(prev => {
                    if (prev.find(h => h.expr === pendingHistory.expr)) return prev;
                    const newHist = [pendingHistory, ...prev];
                    return newHist.slice(0, 3);
                });
                setPendingHistory(null);
            }
            // Start new calculation
            setDisplayValue(number);
            setResult(0);
            setFinalResultDisplayed(false);
            return;
        }
        let newValue = displayValue === "0" ? number : displayValue + number;
        setDisplayValue(newValue);
        // Only evaluate if last char is not operator
        if (!isOperator(newValue[newValue.length - 1])) {
            try {
                setResult(evaluate(newValue));
            } catch {
                setResult(0);
            }
        }
    };

    const handleOperatorPress = (operator: string) => {
        if (finalResultDisplayed) {
            // If there is a pending history item, add it now
            if (pendingHistory) {
                setHistory(prev => {
                    if (prev.find(h => h.expr === pendingHistory.expr)) return prev;
                    const newHist = [pendingHistory, ...prev];
                    return newHist.slice(0, 3);
                });
                setPendingHistory(null);
            }
            // Start new calculation with result as first value
            setDisplayValue(result.toString() + operator);
            setResult(0);
            setFinalResultDisplayed(false);
            return;
        }
        let newValue = displayValue;
        // Prevent double operator
        if (isOperator(newValue[newValue.length - 1])) {
            newValue = newValue.slice(0, -1);
        }
        newValue = newValue + operator;
        setDisplayValue(newValue);
        // Evaluate up to before the operator
        try {
            setResult(evaluate(newValue.slice(0, -1)));
        } catch {
            setResult(0);
        }
    };

    const handleClearPress = () => {
        // If there is a pending history item, add it now
        if (pendingHistory) {
            setHistory(prev => {
                if (prev.find(h => h.expr === pendingHistory.expr)) return prev;
                const newHist = [pendingHistory, ...prev];
                return newHist.slice(0, 3);
            });
            setPendingHistory(null);
        }
        setDisplayValue("0");
        setResult(0);
        setFinalResultDisplayed(false);
    }

    const handleAllClearPress = () => {
        // If there is a pending history item, add it now
        if (pendingHistory) {
            setHistory(prev => {
                if (prev.find(h => h.expr === pendingHistory.expr)) return prev;
                const newHist = [pendingHistory, ...prev];
                return newHist.slice(0, 3);
            });
            setPendingHistory(null);
        }
        setDisplayValue("0");
        setResult(0);
        setFinalResultDisplayed(false);
        setHistory([]);
    }

    const handleBackSpacePress = () => {
        if (finalResultDisplayed) {
            // If there is a pending history item, add it now
            if (pendingHistory) {
                setHistory(prev => {
                    if (prev.find(h => h.expr === pendingHistory.expr)) return prev;
                    const newHist = [pendingHistory, ...prev];
                    return newHist.slice(0, 3);
                });
                setPendingHistory(null);
            }
            // If result is shown, clear all
            setDisplayValue("0");
            setResult(0);
            setFinalResultDisplayed(false);
            return;
        }
        if (displayValue.length === 1) {
            setDisplayValue("0");
        } else {
            setDisplayValue(displayValue.slice(0, -1));
        }
    }

    const handleEqualsToPress = () => {
        try {
            const res = evaluate(displayValue);
            setResult(res);
            setFinalResultDisplayed(true);
            // Set pending history, but do not add to history yet
            setPendingHistory({ expr: displayValue, res });
        } catch {
            setResult(0);
        }
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View style={styles.display}>
                {/* Past data always at the top */}

                <View style={styles.pastData}>
                    {history.length > 0 && (
                        [...history].reverse().map((h, i) => (
                            <Pressable
                                key={i}
                                onPress={() => { setDisplayValue(h.expr); setResult(h.res); setFinalResultDisplayed(false); setPendingHistory(null); }}

                            >
                                <Text key={i} style={{ color: '#aaa', fontSize: 16 }}>
                                    {h.expr} = {h.res}
                                </Text>
                            </Pressable>
                        ))
                    )}
                </View>

                {/* Result section always at the end */}
                <View style={styles.result}>
                    {!finalResultDisplayed ? (
                        <>
                            <Text style={styles.displayText}>{displayValue}</Text>
                            <Text style={styles.firstValueText}>{displayValue !== "0" && result}</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.firstValueText}>{displayValue !== "0" && displayValue}</Text>
                            <Text style={styles.displayText}>={result}</Text>
                        </>
                    )}
                </View>
            </View>
            <View style={styles.buttons}>
                {displayValue === "0" && !finalResultDisplayed ? (
                    <Button title="AC" onPress={handleAllClearPress} type="clear" />
                ) : (
                    <Button title="C" onPress={handleClearPress} type="clear" />
                )}
                <Button title="⌫" onPress={handleBackSpacePress} type="operator" />
                <Button title="%" onPress={() => handleOperatorPress('%')} type="operator" />
                <Button title="/" onPress={() => handleOperatorPress('/')} type="operator" />
                <Button title="7" onPress={() => handleNumberPress('7')} type="number" />
                <Button title="8" onPress={() => handleNumberPress('8')} type="number" />
                <Button title="9" onPress={() => handleNumberPress('9')} type="number" />
                <Button title="*" onPress={() => handleOperatorPress('*')} type="operator" />
                <Button title="4" onPress={() => handleNumberPress('4')} type="number" />
                <Button title="5" onPress={() => handleNumberPress('5')} type="number" />
                <Button title="6" onPress={() => handleNumberPress('6')} type="number" />
                <Button title="-" onPress={() => handleOperatorPress('-')} type="operator" />
                <Button title="1" onPress={() => handleNumberPress('1')} type="number" />
                <Button title="2" onPress={() => handleNumberPress('2')} type="number" />
                <Button title="3" onPress={() => handleNumberPress('3')} type="number" />
                <Button title="+" onPress={() => handleOperatorPress('+')} type="operator" />
                <Button title="0" onPress={() => handleNumberPress('0')} type="number" />
                <Button title="00" onPress={() => handleNumberPress('00')} type="number" />
                <Button title="." onPress={() => handleNumberPress('.')} type="number" />
                <Button title="=" onPress={handleEqualsToPress} type="operator" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    display: {
        flex: 1,
        backgroundColor: "#000",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: 20,
    },
    result: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    pastData: {
        backgroundColor: "#000",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        gap: 5,
    },
    buttons: {
        flex: 2,
        backgroundColor: "#000",
        padding: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
    },
    displayText: {
        color: "#fff",
        fontSize: 48
    },
    firstValueText: {
        color: "#fff",
        fontSize: 24
    }

})