import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";
import { useSignIn, useSignOut, useUser } from "@/utils/auth.tsx";
import { api } from "@/utils/api";

function MobileAuth() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();
  const util = api.useUtils();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-white">
        {user?.firstName ?? "Not logged in"}
      </Text>
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? "Sign Out" : "Sign In"}
        color={"#5B65E9"}
      />
      <Button
        onPress={() => util.user.whoAmI.invalidate()}
        title={"invalidate"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <MobileAuth />

        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: 2 },
          }}
        >
          <Pressable className="">
            <Text className="text-xl font-semibold text-primary">hej</Text>
          </Pressable>
        </Link>
        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a post
          </Text>
        </View>

        {/* <CreatePost /> */}
      </View>
    </SafeAreaView>
  );
}
