import { Text, View } from "react-native";
import { api } from "../utils/api";

export default function Page() {
  /* const pricesQuery = api.products.scrapeProduct.useQuery({
    url: "https://nlyman.com/se/produkt/woodbird-leroy-thun-black-jeans_841459-3294/",
  });

  return pricesQuery.status === "pending" ? (
    <View>
      <Text>...loading</Text>
    </View>
  ) : (
    <View className="flex-1 items-center">
      <View className="flex flex-col flex-1 justify-center">
        {pricesQuery.data?.map((price, index) => (
          <Text className="text-7xl font-thin" key={index}>
            {price}
          </Text>
        ))}
      </View>
    </View>
  ); */
  return (
    <View className="flex-1 items-center">
      <View className="flex flex-col flex-1 justify-center">
        <Text className="text-7xl font-thin">Hello World</Text>
      </View>
    </View>
  );
}
