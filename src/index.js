import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

const openWeatherKey = "60e49c00b7f4613a41c2c9e8371354c3";
let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&exclude=minutely&appid=${openWeatherKey}`;

const weather = () => {
  const [forecast, setforecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    try {
      setRefreshing(true);

      // ask for permission to acces location

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("permission to acces location was denied"); //if permission is denied , show an alert//
      }

      // get the current location

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      // fetches the weather data from the openweathermap api//
      const response = await fetch(
        `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
      );

      const data = await response.json(); // convert the response to json //forecast

      if (!response.ok) {
        Alert.alert("Erorr", "something went wrong"); // if response is not ok ,show an alert//
      } else {
        setforecast(data); //set the data to the state
      }
      setRefreshing(false);
    } catch (e) {
      console.error(e, "somthing went wrong");
      Alert.alert(JSON.stringify(e));
    }
  };

  // use effect hook is used for rendererd
  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    //if the forecast is not loaded ,show a loading indicator

    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast?.city;
  // Alert.alert(JSON.stringify(current));
  const firstData = forecast?.list[0];

  return (
    <SafeAreaView>
      <ScrollView
        RefreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast()}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current weather</Text>

        <Text style={{ alignAItems: "centor", textAlign: "centor" }}>
          {current?.name}
          {current?.country}
        </Text>
        <View style={styles.current}>
          {/* <Image
            style={styles.largeIcon}
            source={{
              uri: `https://openweathermap.org/img/wn/${
                (current, icon)
              }@4x.png`,
            }}
          /> */}
          <Text style={styles.currentTemp}>
            {Math.round(firstData?.main?.temp)}°C
          </Text>
        </View>
        <Text style={styles.currentDescription}>{current?.description}</Text>
        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Image
              source={require("../assets/temp.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 50,
              }}
            />

            <Text style={styles.text}>{firstData?.main?.feels_like}°C</Text>
            <Text style={styles.text}>Feels Like</Text>
          </View>
          <View style={styles.info}>
            <Image
              source={require("../assets/humidity.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                marginLeft: 50,
              }}
            />

            <Text style={styles.text}>{firstData?.main?.humidity}%</Text>
            <Text style={styles.text}>Humidity</Text>
          </View>
        </View>

        <View>
          <Text style={styles.subtitle}> Hourly Forecast</Text>
        </View>
        <FlatList
          horizontal
          data={forecast.list}
          renderItem={({ item }) => {
            const weather = item?.weather;
            var dt = new Date(item?.dt * 1000);
            return (
              <View style={styles.hour}>
                <Text style={{ fontWeight: "bold", color: "#346751" }}>
                  {dt.toLocaleTimeString("en-IN").replace(" / :d" + " ")}
                </Text>

                <Text style={{ fontWeight: "bold", color: "#346751" }}>
                  {Math.round(item?.main?.temp)}°C
                </Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`,
                  }}
                />
                <Text style={{ fontWeight: "bold", color: "#346751" }}>
                  {weather[0].description}
                </Text>
              </View>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default weather;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECDBBA",
  },

  title: {
    textAlign: "center",
    fontsize: 36,
    fontWeight: "bold",
    color: "#c84b31",
  },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  currentDescription: {
    width: "100%",
    textAlign: "center",
    fontWeight: "200",
    fontsize: 24,
    marginBottom: 5,
  },
  info: {
    width: Dimensions.get("screen").width / 2.5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 15,
    justifyContent: "centor",
  },
  extraInfo: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontSize: 20,
    color: "fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 7,
    color: "#c84b31",
    fontWeight: "bold",
  },
  hour: {
    padding: 6,
    alignItems: "center",
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
});
