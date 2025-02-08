import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Login() {
  const local = useLocalSearchParams();
  console.log({ local });

  return <Text>hej</Text>;
}
