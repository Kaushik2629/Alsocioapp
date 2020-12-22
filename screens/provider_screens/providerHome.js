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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar backgroundColor="#1a237e" barStyle="light-content" />
      <Header
        statusBarProps={{ barStyle: "light-content" }}
        barStyle="light-content" // or directly
        containerStyle={{
          backgroundColor: "#fff",
        }}
        // leftComponent={TopLeftNavScreen()}
        rightComponent={
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              width: 150,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 0.2,
              borderColor: "#1a237e",
              height: 40,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#1a237e",
                textAlign: "center",
              }}
            >
              Hi,{a.UserName}
            </Text>
          </View>
        }
        rightContainerStyle={{ marginTop: 12 }}
      />
      <Header
        statusBarProps={{ barStyle: "light-content" }}
        barStyle="light-content" // or directly
        containerStyle={{
          backgroundColor: "#1a237e",
          height: 80,
          width: imagewidth,
        }}
        leftComponent={
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              marginBottom: 50,
              marginTop: 10,
              paddingVertical: 10,
              alignItems: "flex-start",
            }}
          >
            <Icon.Button
              name="ios-menu"
              style={{ paddingVertical: 15 }}
              size={25}
              backgroundColor="#1a237e"
              onPress={() => navigation.openDrawer()}
            ></Icon.Button>
            <Image
              source={require("../../assets/icon.png")}
              style={{
                width: 110,
                height: 60,
                //borderRadius: 40 / 2,
              }}
            />
          </View>
        }
      />
      <ScrollView>
        <Card style={styles.slide1}>
          <Card.Content>
            <Text style={styles.text}>View Your added Services</Text>
          </Card.Content>
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                fontSize: 15,
                backgroundColor: "#1a237e",
                width: 300,
              }}
              onPress={() => navigation.navigate("providerServices")}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "bold",
                  margin: 10,
                  color: "#fff",
                }}
              >
                Go to Services!
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
        <Card style={styles.slide1}>
          <Card.Content>
            <Text style={styles.text}>View Your Team Members</Text>
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  fontSize: 15,
                  backgroundColor: "#1a237e",
                  width: 300,
                }}
                onPress={() => navigation.navigate("providerTeamMembers")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: 10,
                    color: "#fff",
                  }}
                >
                  Go to Team Members!
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.slide1}>
          <Card.Content>
            <Text style={styles.text}>View Your Branches</Text>
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  fontSize: 15,
                  backgroundColor: "#1a237e",
                  width: 300,
                }}
                onPress={() => navigation.navigate("providerBranches")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: 10,
                    color: "#fff",
                  }}
                >
                  Go to Branches!
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.slide1}>
          <Card.Content>
            <Text style={styles.text}>View Your Quotes</Text>
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  fontSize: 15,
                  backgroundColor: "#1a237e",
                  width: 300,
                }}
                onPress={() => navigation.navigate("providerQuotes")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                    margin: 10,
                    color: "#fff",
                  }}
                >
                  Go to Quotes!
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
});
