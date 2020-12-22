import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  ImageBackground,
  ViewComponent,
  FlatList,
  Modal,
} from "react-native";
import { Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Col, Row, Grid } from "react-native-easy-grid";
import Swiper from "react-native-swiper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { Formik } from "formik";
import { Badge, Card, IconButton, Colors } from "react-native-paper";
import { Picker } from "@react-native-community/picker";

import { AuthContext } from "../components/context";
import { MaterialIndicator } from "react-native-indicators";

const imageheight = Dimensions.get("screen").height;
const imagewidth = Dimensions.get("screen").width;

const HomeScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const a = useContext(AuthContext);

  //for region
  const [regionArray, setRegionArray] = useState([]);

  const [cityArray, setCityArray] = useState([]);

  const showRegionOptions = () => {
    let item = [];
    let region_array = [];
    let showCity_array = [];
    let showRegion_array = [];
    fetch("https://alsocio.geop.tech/app/get-city-region/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        item = [...item, responseJson];

        item.map((item) => {
          region_array = [...region_array, item.region_city_dict];

          region_array.map((city) => {
            showRegion_array = Object.keys(city);

            setRegionArray(showRegion_array);

            showCity_array = Object.values(city);

            setCityArray(showCity_array);
          });
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    {
      showRegionOptions();
    }
  }, []);

  const [showPickerModal, setShowPickerModal] = useState(false);

  const [regionValue, setRegionValue] = useState("");

  const [cityValue, setCityValue] = useState("");

  const regionpicker = () => {
    return regionArray.map((element) => {
      return <Picker.Item label={element} value={element} />;
    });
  };

  let cityRegion = null;
  const citypicker = () => {
    let index = regionArray.indexOf(regionValue);
    let array = [cityArray[index]].toString();
    let city_array = array.split(",");

    return city_array.map((item) => {
      cityRegion = regionValue + "," + item;
      return <Picker.Item label={item} value={item} />;
    });
  };

  const showPicker = (properties) => {
    return (
      <View
        style={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Picker
          style={{
            marginVertical: 10,
            width: imagewidth / 1.5,
            borderRadius: 10,
            backgroundColor: "#e0e0e0",
          }}
          selectedValue={regionValue}
          onValueChange={(itemValue) => {
            setRegionValue(itemValue);
            setCityValue();
            properties.setFieldValue("region", itemValue);
          }}
        >
          <Picker.Item label="Select Region" value="" />
          {regionpicker()}
        </Picker>
        <Picker
          style={{
            marginVertical: 10,
            width: imagewidth / 1.5,
            borderRadius: 10,
            backgroundColor: "#e0e0e0",
          }}
          selectedValue={cityValue}
          onValueChange={(itemValue) => {
            setCityValue(itemValue);
            properties.setFieldValue("city", itemValue);
          }}
        >
          <Picker.Item label="Select your City" value="" />
          {citypicker()}
        </Picker>
      </View>
    );
  };

  const TopLeftNavScreen = () => {
    return regionValue == "" || cityValue == "" ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            borderWidth: 0.2,
            backgroundColor: "#fff",
            paddingHorizontal: 10,
            borderColor: "#1a237e",
          }}
        >
          <TouchableOpacity onPress={() => setShowPickerModal(true)}>
            <Text style={{ width: 140 }}>Select Your Location</Text>
          </TouchableOpacity>
          <IconButton
            icon="map-marker"
            size={20}
            color={Colors.blue900}
            onPress={() => {
              setShowPickerModal(true);
            }}
          />
        </View>
      </View>
    ) : (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            borderWidth: 0.2,
            borderColor:'#1a237e',
            backgroundColor: "#fff",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity onPress={() => setShowPickerModal(true)}>
            <Text style={{ width: 140 }}>{cityValue}</Text>
          </TouchableOpacity>
          <IconButton
            icon="map-marker"
            size={20}
            color={Colors.blue900}
            onPress={() => {
              setShowPickerModal(true);
            }}
          />
        </View>
      </View>
    );
  };

  const fetchCartCount = () => {
    return a.itemCount != 0 ? (
      <Badge
        size={20}
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <Text style={{ color: "#000" }}>{a.itemCount}</Text>
      </Badge>
    ) : null;
  };

  const checkUser = () => {
    return a.UserName == null ? (
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
        <FontAwesome
          name="user-o"
          color="#1a237e"
          size={20}
          onPress={() => navigation.navigate("SignInScreen")}
        />
        <Text
          style={{
            fontSize: 12,
            color: "#1a237e",
          }}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          Login
        </Text>
        <FontAwesome
          name="plus"
          color="#1a237e"
          size={20}
          style={{ marginLeft: 25 }}
          onPress={() => navigation.navigate("SignUpScreen")}
        />
        <Text
          style={{
            fontSize: 12,
            color: "#1a237e",
          }}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          SignUp
        </Text>
      </View>
    ) : (
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
    );
  };

  const [mainCategoryArray, setMainCategoryArray] = useState([]);

  const [mainCategoryImages, setMainCategoryImages] = useState([]);

  const getMainCategory = () => {
    fetch("https://alsocio.geop.tech/app/get-main-categories/", {
      method: "GET",
      // body: usercategory,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false);
        setMainCategoryArray(responseJson.main_categories);
        setMainCategoryImages(responseJson.main_category_images);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getMainCategory();
  }, []);

  const showImage = (serviceName) => {
    return Object.keys(mainCategoryImages).map((name) => {
      if (serviceName == name) {
        return (
          <Image
            style={{
              width: 35,
              height: 35,
            }}
            source={{
              uri: mainCategoryImages[name],
            }}
          />
        );
      }
    });
  };

  const [featuredServicesArray, setFeaturedServicesArray] = useState([]);

  const getFeaturedServices = () => {
    fetch("https://alsocio.geop.tech/app/get-featured-services/", {
      method: "GET",
      // body: usercategory,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setFeaturedServicesArray(responseJson.featured_services);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getFeaturedServices();
  }, []);

  const showcategory = (category) => {
    navigation.navigate("SupportScreen", {
      category_name: category,
      region: regionValue,
      city: cityValue,
    });
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Modal
          animationType="fade"
          visible={showPickerModal}
          transparent={true}
          onRequestClose={() => {
            setShowPickerModal(!showPickerModal);
          }}
        >
          <Formik
            initialValues={{ region: "", city: "" }}
            onSubmit={(values) => {
              alert(JSON.stringify(values));
            }}
          >
            {(props) => (
              <View
                style={{
                  marginTop: 60,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    marginTop: 50,
                    marginHorizontal: 20,
                    borderRadius: 15,
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    padding: 10,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexGrow: 1,
                      elevation: 3,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      setShowPickerModal(!showPickerModal);
                    }}
                  >
                    <Icon.Button
                      name="ios-close"
                      size={25}
                      backgroundColor="#fff"
                      color="#000"
                      style={{ padding: 15, textAlign: "right" }}
                    ></Icon.Button>
                  </TouchableOpacity>
                  {showPicker(props)}
                  <Button
                    title="Submit"
                    color="#1a237e"
                    style={{
                      borderRadius: 20,
                      fontSize: 15,
                    }}
                    onPress={() => setShowPickerModal(!showPickerModal)}
                  />
                </View>
              </View>
            )}
          </Formik>
        </Modal>

        <StatusBar backgroundColor="#1a237e" barStyle="light-content" />
        <Header
          statusBarProps={{ barStyle: "light-content" }}
          barStyle="light-content" // or directly
          containerStyle={{
            backgroundColor: "#fff",
          }}
          leftComponent={TopLeftNavScreen()}
          leftContainerStyle={{ marginTop: 12 }}
          rightComponent={checkUser()}
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
                source={require("../assets/icon.png")}
                style={{
                  width: 110,
                  height: 60,
                  //borderRadius: 40 / 2,
                }}
              />
            </View>
          }
          rightComponent={
            <View
              style={{
                marginTop: 10,
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "center",
                transform: [{ translateY: -20 }],
              }}
            >
              <IconButton
                icon="cart"
                size={30}
                style={{ position: "relative" }}
                color={Colors.white}
                backgroundColor="#1a237e"
                onPress={() => navigation.navigate("showCartitems")}
              />
              {fetchCartCount()}
            </View>
          }
        />
        {isLoading ? (
          // <View
          // 	style={{
          // 		padding: 20,
          // 	}}>
          <MaterialIndicator color="#1a237e" />
        ) : (
          // </View>
          <ScrollView style={styles.scrollView}>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {mainCategoryArray.map((item) => {
                return (
                  <TouchableOpacity
                    style={styles.iconcontainer}
                    onPress={() => showcategory(item)}
                  >
                    {showImage(item)}
                    <Text accessibilityRole="button" style={[styles.icontext]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                borderWidth: 0.1,
                margin: 2,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  paddingVertical: 25,
                  fontWeight: "900",
                }}
              >
                Featured Services!
              </Text>

              <Swiper
                style={{ height: imageheight / 2.5 }}
                showsButtons={false}
              >
                {featuredServicesArray.map((item) => {
                  {
                    /* <View> */
                  }
                  return (
                    <Card
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 15,
                        margin: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Card.Cover
                        source={{
                          uri: "https://alsocio.geop.tech/media/" + item.image,
                        }}
                      />
                      <Card.Content>
                        <Text
                          style={{
                            textAlign: "center",
                            alignSelf: "center",
                            padding: 20,
                          }}
                        >
                          {item.service}
                        </Text>
                      </Card.Content>
                    </Card>
                  );
                })}
                {/* </View> */}
              </Swiper>
            </View>

            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                borderWidth: 0.1,
                margin: 2,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  paddingVertical: 20,
                  fontWeight: "900",
                }}
              >
                Customer Reviews
              </Text>
              <Swiper style={{ height: imageheight / 4 }} showsButtons={false}>
                <Card style={styles.slide1}>
                  <Card.Content>
                    <Text style={styles.text}>ShaneSmith</Text>
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 20,
                        fontSize: 18,
                      }}
                    >
                      Nice!
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                    </View>
                  </Card.Content>
                </Card>
                <Card style={styles.slide1}>
                  <Card.Content>
                    <Text style={styles.text}>ShaneSmith</Text>
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 20,
                        fontSize: 18,
                      }}
                    >
                      Nice!
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                    </View>
                  </Card.Content>
                </Card>
                <Card style={styles.slide1}>
                  <Card.Content>
                    <Text style={styles.text}>ShaneSmith</Text>
                    <Text
                      style={{
                        textAlign: "center",
                        padding: 20,
                        fontSize: 18,
                      }}
                    >
                      Nice!
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                      <FontAwesome name="star" color="#fbc02d" size={20} />
                    </View>
                  </Card.Content>
                </Card>
              </Swiper>
            </View>
          </ScrollView>
        )}
      </View>
    </React.Fragment>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  iconcontainer: {
    width: imagewidth / 3,
    height: imageheight / 9,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconimage: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  icontext: {
    fontSize: 12,
    fontWeight: "300",
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
    elevation: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#000",
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
    fontSize: 20,
    fontWeight: "bold",
  },
});

// const useStyles = makeStyles((theme) => ({
// 	formControl: {
// 		margin: theme.spacing(0),
// 		minWidth: 200,
// 	},
// 	root: {
// 		// padding: theme.spacing(2),
// 		// flexGrow: 1,
// 	},
// 	paper: {
// 		verticalAlign: 'top',
// 		padding: theme.spacing(3, 2),
// 		// margin: 5,
// 		maxWidth: 500,
// 		marginBottom: 15,
// 	},
// 	image: {
// 		width: 128,
// 		height: 128,
// 	},
// 	img: {
// 		margin: 'auto',
// 		display: 'block',
// 		maxWidth: '100%',
// 		maxHeight: '100%',
// 	},
// 	root1: {
// 		color: green[400],
// 		'&$checked': {
// 			color: green[600],
// 		},
// 	},
// 	checked: {},
// }));
