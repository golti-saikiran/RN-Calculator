import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        headerShown: true,
        title: "Calculator",
        headerStyle: { backgroundColor: "#222" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
  </Stack>
}
