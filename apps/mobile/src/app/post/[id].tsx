import { SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

import { api } from "@/utils/api.tsx";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = api.products.getProduct.useQuery();

  if (!data) return null;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.msg }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">{data.msg}</Text>
      </View>
    </SafeAreaView>
  );
}
