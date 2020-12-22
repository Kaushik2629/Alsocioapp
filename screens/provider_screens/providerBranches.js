import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Appbar, Card, DataTable } from "react-native-paper";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../../components/context";
import { MaterialIndicator } from "react-native-indicators";

const imagewidth = Dimensions.get("screen").width;
const imageheight = Dimensions.get("screen").height;

const itemsPerPage = 5;

const providerBranches = ({ navigation }) => {
  const a = useContext(AuthContext);

  const [name, setName] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const [details, setDetails] = useState([]);

  const fetchUsername = async () => {
    let customer_name = new FormData();
    customer_name.append("username", a.UserName);
    fetch("https://alsocio.geop.tech/app/get-provider-branches/", {
      method: "POST",
      body: customer_name,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false);
        setDetails(responseJson.branches);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    if (a.UserName != null) {
      fetchUsername();
    }
  }, []);

  const [page, setPage] = React.useState(0);
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#1a237e" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          titleStyle={{ padding: 10 }}
          title="Your Branches"
          subtitleStyle={{ marginBottom: 5 }}
        />
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
      </Appbar.Header>

      {isLoading ? (
        <View
          style={{
            padding: 20,
            alignContent: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <MaterialIndicator color="#1a237e" />
        </View>
      ) : (
        <FlatList
          data={details}
          style={styles.flatlist}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <Card
              style={{
                width: imagewidth - 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
                margin: 10,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Card.Content>
                <View
                  style={{
                    flexGrow: 1,
                    padding: 15,
                    borderBottomWidth: 0.45,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      flexGrow: 1,
                      fontSize: 18,
                      fontWeight: "900",
                      alignSelf: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    City -
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "900",
                      alignSelf: "flex-end",
                      textAlign: "right",
                      marginBottom: 3,
                      marginLeft: 5,
                    }}
                  >
                    {item.city}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", padding: 10 }}>
                  <Text style={styles.leftLabel}>Region - </Text>
                  <Text style={styles.rightLabel}>{item.region}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default providerBranches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    // flex: 1,
    padding: 0,
  },
  leftLabel: {
    fontSize: 15,
    fontWeight: "700",
    flexGrow: 1,
    alignSelf: "flex-start",
  },
  rightLabel: {
    fontSize: 15,
    fontWeight: "700",
    flexGrow: 1,
    textAlign: "right",
    alignSelf: "flex-end",
  },
});
