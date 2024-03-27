import { useMemo, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../../utils/api";

export default function ShareIntent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showPrice, setShowPrice] = useState(false);

  const shareIntent = useMemo(
    () =>
      params?.shareIntent ? JSON.parse(params.shareIntent.toString()) : null,
    [params],
  );

  if (!shareIntent || !shareIntent.text)
    return <Text>No Share intent detected</Text>;

  const url = shareIntent.text as string;

  return (
    <View style={styles.container}>
      <Text style={[styles.gap, { fontSize: 20 }]}>
        Congratz, a share intent value is available
      </Text>
      <Text style={styles.gap}>{shareIntent.text}</Text>
      <Button
        onPress={() => {
          setShowPrice(true);
        }}
        title="Scrape price"
      />
      {showPrice && <Price url={url} />}

      <Button onPress={() => router.back()} title="Go home" />
      <StatusBar style="auto" />
    </View>
  );
}

const Price = ({ url }: { url: string }) => {
  const productPriceQuery = api.products.scrapeProduct.useQuery({ url });
  const greetings = api.greetings.greetings.useQuery({ title: "" });

  if (productPriceQuery.status === "pending") return <Text>...loading</Text>;
  if (productPriceQuery.status === "error")
    return (
      <Text>
        Could not load product price, {productPriceQuery.error.message}
      </Text>
    );
  return (
    <View>
      <Text>Product Price</Text>
      {productPriceQuery.data.map((price, index) => (
        <Text key={index}>{price}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  gap: {
    marginBottom: 20,
  },
});
