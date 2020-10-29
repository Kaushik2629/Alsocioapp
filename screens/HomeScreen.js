import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar,Image,SafeAreaView, ImageBackground, ViewComponent,FlatList, } from 'react-native';
import { NavigationHelpersContext, useTheme } from '@react-navigation/native';
import SearchBox from './SearchBox';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Swiper,Pagination} from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from './DetailsScreen'
import { CardColumns, ListGroup } from 'react-bootstrap';
import e from 'cors';
import { event } from 'jquery';
import { render } from 'react-dom';
//import { List } from 'react-native-paper';
//const theme = getTheme();


const HomeScreen = ({navigation}) => {

  const imageheight = Dimensions.get('screen').height;
  const imagewidth = Dimensions.get('screen').width;
  const { colors } = useTheme();
  const theme = useTheme();

 

 const showcategory = (category,key)=>{
                  navigation.navigate("SupportScreen",{
                    category_name:category,
                  });  
};
 

    return (
      <View style={styles.container}> 
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }></StatusBar> 
                      

          <ScrollView style={styles.scrollView}>
        <Image
        title="You are in Good Hands!"
         source={require('../assets/banneraloscio.png')}
          style={{
            width: imagewidth*1.05,
            height: imageheight*0.25,
            margin:0
          }}
        />
        <Text style={{position: 'absolute', fontSize:30,fontWeight:'bold' ,textAlign:'center',left:60,top:32,fontFamily:'Calibri',color:'#eeffff',textShadowRadius:10,textShadowColor:'#000'}}>You are in Good Hands!</Text>
          <View style={styles.servicesbox}>
              {/* <View style={styles.container}> */}
              
            <View style={styles.subcontainers}>
                                    
                          <Grid > 
                                <Row>
                                      <Col style={styles.iconcontainer}  name="Air Conditioning" data-key={0} onPress={(category,key)=>showcategory('Air Conditioner',0)} >
                                        <Image
                                              value="Air Conditioning"
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Air Conditioner.png')}
                                              Text="Air Conditioning"
                                          />
                                          <Text style={styles.icontext}>Air Conditioning</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} name="Appliances" key={1} onPress={(category,key)=>showcategory('Appliances',1)} >
                                        <Image
                                              style={{marginBottom:15,width:35,height:35}}
                                                source={require('../assets/service-icons/Appliances.png')}
                                            />
                                            <Text style={styles.icontext}>Appliances</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Carpet Cleaning',2)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Carpet Cleaning.png')}
                                          />
                                          <Text style={styles.icontext}>Carpet Cleaning</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Cleaning Service',3)}>
                                        <Image
                                              style={{marginBottom:10,width:28,height:28}}
                                                source={require('../assets/service-icons/Cleaning Service.png')}
                                            />
                                            <Text style={styles.icontext}>Cleaning Services</Text>
                                      </Col>
                            </Row>

                            <Row>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Drill and Hang',4)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Drill and Hang.png')}
                                          />
                                          <Text style={styles.icontext}>Drill and Hang</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Electrician',5)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Electrician.png')}
                                            />
                                            <Text style={styles.icontext}>Electrician</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Errands',6)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Errands.png')}
                                          />
                                          <Text style={styles.icontext}>Errands</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Locksmith',7)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Locksmith.png')}
                                            />
                                            <Text style={styles.icontext}>Locksmith</Text>
                                      </Col>
                            </Row>
                                                   
                            <Row>
                            <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Massage Therapist',8)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Massage Therapist.png')}
                                          />
                                          <Text style={styles.icontext}>Massage Therapist</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Personal Training',9)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Personal Training.png')}
                                            />
                                            <Text style={styles.icontext}>Personal Training</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Plumbing',10)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Plumbing.png')}
                                          />
                                          <Text style={styles.icontext}>Plumbing</Text>
                                      </Col>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Remodeling',11)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Remodeling.png')}
                                            />
                                            <Text style={styles.icontext}>Remodeling</Text>
                                      </Col>
                            </Row>
                            <Row>
                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Technical Services',12)}>
                                        <Image
                                              style={styles.iconimage}
                                              source={require('../assets/service-icons/Technical Services.png')}
                                          />
                                          <Text style={styles.icontext}>Technical Services</Text>
                                      </Col>

                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Upholstery',13)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Upholstery.png')}
                                            />
                                            <Text style={styles.icontext}>Upholstery</Text>
                                      </Col>

                                      <Col style={styles.iconcontainer} onPress={(category,key)=>showcategory('Others',14)}>
                                        <Image
                                              style={styles.iconimage}
                                                source={require('../assets/service-icons/Others.png')}
                                            />
                                            <Text style={styles.icontext}>Others</Text>
                                      </Col>

                                      <Col  style={styles.iconcontainer}>
                                      </Col>
                                      </Row>
                           
                                    </Grid>               
                </View>
             {/* </View> */}
        </View>
        <View style={styles.servicesbox,{backgroundColor:'#fff',borderTopWidth:0.02,borderTopColor:'#1a237e'}}>
          <Text style={{fontSize:20,marginTop:20,textAlign:'center'}}>Featured Services</Text>
          <View style={styles.subcontainers,{alignItems:"center",marginBottom:50,backgroundColor:'#fff'}}>
            <Grid>
              <Row>
              <Swiper activeDot={true} 
              loop={false} 
              style={{width:imagewidth*0.6,height:imageheight*0.3,margin:10}}
              dot={
                <View
                  style={{
                    backgroundColor: '#1a237e',
                    width: 5,
                    height: 5,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3
                  }}
                />
              }
              activeDot={
                <View
                  style={{
                    backgroundColor: '#000',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3
                  }}
                />
              }
              paginationStyle={{
                bottom: 5,
                center:0
              }}
              >
                <Col style={styles.featuredservices}>
                    <Image
                     source={require('../assets/featured_services/product-electricity.jpg')}
                     style={{width:imagewidth*0.6,margin:0,borderRadius:10,
                              height:150}}
                    />
                    <Text style={{textAlign:"center"}}>Electricity</Text>
                </Col>
                <Col style={styles.featuredservices}>
                <Image
                     source={require('../assets/featured_services/product-electricity.jpg')}
                     style={{width:imagewidth*0.6,margin:0,borderRadius:10,
                              height:150}}
                    />
                    <Text style={{textAlign:"center"}}>Electricity</Text>
                </Col>
                </Swiper>
              </Row>
            </Grid>
          </View>
        </View>

        <View style={styles.servicesbox,{backgroundColor:'#fff',borderTopWidth:0.02,borderTopColor:'#1a237e'}}>
          <Text style={{fontSize:20,marginTop:30,textAlign:'center'}}>Customer Reviews</Text>
          <View style={styles.subcontainers,{alignItems:"center",marginBottom:50,backgroundColor:'#fff'}}>
            <Grid>
              <Row>
              <Swiper activeDot={true} 
              loop={false} 
              style={{width:imagewidth*0.6,height:imageheight*0.3,margin:10}}
              dot={
                <View
                  style={{
                    backgroundColor: '#1a237e',
                    width: 5,
                    height: 5,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3
                  }}
                />
              }
              activeDot={
                <View
                  style={{
                    backgroundColor: '#000',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3
                  }}
                />
              }
              paginationStyle={{
                bottom: 5,
                center:0
              }}
              >
                <Col style={styles.featuredservices}>
                    <Text style={{textAlign:"center",fontSize:20,marginVertical:25,fontFamily: 'Calibri'}}>ShaneSmith</Text>
                    <Text style={{textAlign:"center",marginBottom:30}}>Nice!</Text>
                    <View style={{flexDirection:"row",alignContent:'center',marginHorizontal:60}}>
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                    </View>
                </Col>
                <Col style={styles.featuredservices}>
                <Text style={{textAlign:"center",fontSize:20,marginVertical:25,fontFamily: 'Calibri'}}>Shane Smith</Text>
                    <Text style={{textAlign:"center",marginBottom:30}}>Electricity</Text>
                    <View style={{flexDirection:"row",alignContent:'center',marginHorizontal:60}}>
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                        <FontAwesome
                        name="star"
                        color='#fbc02d'
                        size={20}
                        />
                    </View>
                </Col>
                </Swiper>
              </Row>
            </Grid>
          </View>
        </View>     
      </ScrollView>
      </View>
    );
            };

export default HomeScreen;



const styles = StyleSheet.create({
  iconcontainer:{
    padding:10,
    borderRadius:5,
    margin:2,
    alignItems:'center',
  },
  iconimage:{
    width: 30, 
    height: 30,
    marginBottom:8,
  },
  icontext:{
    fontSize:10,
    textAlign:'center',
  },

  container: {
    flex: 1, 
    alignItems:'center', 
    justifyContent: 'center',
    flexWrap:"nowrap"
  },
  imageview:{
    flex:1,
    marginTop:0,
  },
  servicesbox:{
      flex: 1,
      flexDirection:'column',
      alignItems: 'center',
      alignContent: 'center',
      flexWrap: 'nowrap',
      backgroundColor: 'transparent',
      borderRadius: 10,
      padding:10,
      justifyContent:'center'
  },
  scrollView: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
  },
  subcontainers: {
    flex:2,
    paddingHorizontal:0,
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'stretch',
    alignContent: 'center',
    justifyContent:'center',
    flexWrap: "wrap",
    padding:5,
    borderRadius:10,
    marginBottom:5,
  },
  featuredservices:{
    borderWidth:0,
    borderRadius:10,
    borderColor:'#fce4ec',
    marginBottom:13,
    marginHorizontal:10.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 10,  
    backgroundColor:'#fce4ec'
  },
});
