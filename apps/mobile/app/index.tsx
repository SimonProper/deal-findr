import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 items-center">
      <View className="flex flex-col flex-1 justify-center">
        <Text className="text-7xl font-thin">Hello World</Text>
        <Text className="text-2xl">This is the first page of your app.</Text>
      </View>
    </View>
  );
}
