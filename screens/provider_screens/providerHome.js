import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ViewComponent,
  FlatList,
  Modal,
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import { Header } from "react-native-elements";
import { Dimensions } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import { AuthContext } from "../../components/context";

const imageheight = Dimensions.get("screen").height;
const imagewidth = Dimensions.get("screen").width;

const providerHome = ({ route, navigation }) => {
  const a = useContext(AuthContext);

  const navarray = [
    {
      text1: "Ver sus servicios agregados",
      text2: "Ir a Servicios",
      navigate: "providerServices",
    },
    {
      text1: "Ver los miembros de su equipo",
      text2: "Ir a Miembros del equipo",
      navigate: "providerTeamMembers",
    },
    {
      text1: "Ver sus sucursales",
      text2: "Ir a sucursales",
      navigate: "providerBranches",
    },
    {
      text1: "Ver sus cotizaciones",
      text2: "Ir a cotizaciones",
      navigate: "providerQuotes",
    },
  ];

  const displaynav = () => {
    return navarray.map((item1) => {
      return (
        <Card style={styles.slide1}>
          <Card.Content>
            <Text style={styles.text}>{item1.text1}</Text>
          </Card.Content>
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                borderRadius: 20,
                fontSize: 15,
                backgroundColor: "#262262",
                paddingHorizontal: 10,
                paddingVertical: 10,
                flex: 1,
              }}
              onPress={() => navigation.navigate(item1.navigate)}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {item1.text2}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar backgroundColor="#262262" barStyle="light-content" />
      <Appbar.Header
        style={{ backgroundColor: "#262262", height: 0, marginTop: 0 }}
      ></Appbar.Header>
      <View style={styles.upperHeaderContainer}>
        <View style={styles.showUserName}>
          <Text
            style={{
              fontSize: 12,
              color: "#262262",
              // textAlign: 'center',
            }}
          >
            Hola,{a.UserName}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexBasis: 70,
          backgroundColor: 'rgba(233, 236, 239, 1.0)',
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexBasis: 70,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon.Button
            name="ios-menu"
            style={{ alignSelf: "center" }}
            size={25}
            color="#000"
            backgroundColor='rgba(233, 236, 239, 1.0)'
            onPress={() => navigation.openDrawer()}
          ></Icon.Button>
        </View>
        <View style={{ flexGrow: 1 }}>
          <Image
            source={require("../../assets/homeScreenImage.png")}
            style={{
              width: 70,
              height: 40,
            }}
          />
        </View>
      </View>
      <ScrollView>{displaynav()}</ScrollView>
    </View>
  );
};

export default providerHome;

const styles = StyleSheet.create({
  iconcontainer: {
    padding: 10,
    alignItems: "center",
  },
  iconimage: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  icontext: {
    fontSize: 8,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  servicesbox: {
    flexDirection: "column",
  },
  scrollView: {
    marginHorizontal: 0,
  },
  subcontainers: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  featuredservices: {
    borderWidth: 0,
    borderRadius: 10,
    borderColor: "#fce4ec",
    marginBottom: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 10,
    backgroundColor: "#fce4ec",
  },

  slide1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#000",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 15,
  },
  slide2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#000",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "700",
    padding: 30,
  },
  upperHeaderContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexBasis: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  showUserName: {
    flexGrow: 0.5,
    borderRadius: 10,
    borderWidth: 0.2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#262262",
    paddingVertical: 13,
    paddingHorizontal: 10,
    // height: 40,
    // marginBottom: 15,
  },
});
