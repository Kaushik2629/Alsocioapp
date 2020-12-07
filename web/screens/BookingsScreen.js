import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	FlatList,
	Dimensions,
	Image,
	TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Animatable from 'react-native-animatable';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const BookingsScreen = ({ route, navigation }) => {
	const [details, setDetails] = useState([]);

	const serviceId = route.params.service_id;
	let servicedetails = new FormData();
	servicedetails.append('service_id', serviceId);

	const fetchDetails = () => {
		useEffect(() => {
			function fetchData() {
				fetch('https://alsocio.geop.tech/app/get-service-details/', {
					method: 'POST',
					body: servicedetails,
				})
					.then((response) => response.json())
					.then((responseJson) => {
						setDetails(responseJson);
						//data = ;
						//console.log(data.servicecategories);
						console.log(responseJson);
					})
					.catch((error) => console.error(error));
			}
			fetchData();
		}, [serviceId]);
	};

	const [cartCount, setCartcount] = useState(1);
	const [button, setButtons] = useState(true);
	const addtocart = () => {
		return button ? (
			<TouchableOpacity
				style={{
					backgroundColor: '#f9a825',
					width: 200,
					height: 35,
					marginBottom: 5,
					borderRadius: 5,
					marginLeft: 20,
				}}
				onPress={() => setButtons(false)}>
				<Text
					style={{
						color: '#fff',
						textAlign: 'center',
						marginTop: 10,
					}}>
					Add
				</Text>
			</TouchableOpacity>
		) : (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity
					style={{
						backgroundColor: '#1a237e',
						width: 50,
						height: 35,
						marginBottom: 5,
						borderRadius: 5,
						marginLeft: 20,
					}}
					onPress={() => handleIncrement()}>
					<Text
						style={{
							color: '#fff',
							textAlign: 'center',
							marginTop: 10,
						}}>
						+
					</Text>
				</TouchableOpacity>
				<Text style={{ textAlign: 'center', marginTop: 5 }}>{cartCount}</Text>
				<TouchableOpacity
					style={{
						backgroundColor: '#1a237e',
						width: 50,
						height: 35,
						marginBottom: 5,
						borderRadius: 5,
						marginLeft: 20,
					}}
					onPress={() => handleDecrement()}>
					<Text
						style={{
							color: '#fff',
							textAlign: 'center',
							marginTop: 10,
						}}>
						-
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const handleIncrement = () => {
		setCartcount(cartCount + 1);
	};

	const handleDecrement = () => {
		setCartcount(cartCount - 1);
		if (cartCount == 1) {
			setCartcount(1);
			setButtons(true);
		}
	};

	const handleSentence = () => {
		if (cartCount == 1) {
			return <Text>service is added</Text>;
		}
		if (cartCount > 1) {
			return <Text>services added</Text>;
		}
	};

	const cartPopup = () => {
		return !button ? (
			// <View style={{ flexDirection: 'row',flex:0.4}}>
			<Animatable.View
				style={{
					bottom: 0,
					flexDirection: 'row',
					backgroundColor: '#fff',
					width: imagewidth,
				}}
				animation='fadeIn'>
				<Text
					style={{ marginLeft: 10, fontFamily: 'Calibri', fontWeight: '900' }}>
					{cartCount}
					{handleSentence()}
				</Text>
				<FlatList
					data={details.service}
					renderItem={({ item }) => {
						const serviceId = item.id;
						return (
							<TouchableOpacity
								style={{
									backgroundColor: '#1a237e',
									width: 200,
									height: 35,
									marginBottom: 5,
									borderRadius: 5,
									marginLeft: imagewidth * 0.2,
								}}
								onPress={() =>
									navigation.navigate('CartScreen', {
										service_Id: serviceId ,
									})
								}>
								<Text
									style={{
										color: '#fff',
										textAlign: 'center',
										marginTop: 10,
									}}>
									Proceed to Cart!
								</Text>
							</TouchableOpacity>
						);
					}}
				/>
			</Animatable.View>
		) : //</View>
		null;
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 0.14, //0.14
					top: 0,
					width: imagewidth,
					backgroundColor: '#1a237e',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<Icon.Button
					name='ios-arrow-back'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 5 }}
					onPress={() => navigation.goBack()}></Icon.Button>
				<FlatList
					data={details.service}
					renderItem={({ item }) => (
						<Text
							style={{
								fontSize: 15,
								marginTop: 5,
								marginHorizontal: 50,
								color: '#fff',
								fontWeight: '300',
								marginLeft: imagewidth / 4,
							}}>
							{item.main_category}
						</Text>
					)}
				/>
				<Icon.Button
					name='ios-menu'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 30, right: 0 }}
					onPress={() => navigation.openDrawer()}></Icon.Button>
			</View>
			{fetchDetails()}

			<ScrollView style={{ flex: 1.3, top: 0 }}>
				<View style={{ flex: 1 }}>
					<FlatList
						data={details.service}
						renderItem={({ item }) => (
							<View style={{ flex: 1 }}>
								<Image
									style={{
										width: imagewidth * 0.8,
										height: 150,
										marginHorizontal: 20,
										marginVertical: 10,
									}}
									source={{ uri: 'https:alsocio.geop.tech/media/' + item.img }}
								/>
								<Text
									style={{
										fontsize: 5,
										marginLeft: 20,
										fontStyle: 'Caption',
										marginBottom: 5,
										fontWeight: '300',
									}}>
									<Text style={{ fontWeight: 'bold' }}>Service By:</Text>
									{item.company_name}
								</Text>
								<Text
									style={{
										fontsize: 10,
										fontWeight: '500',
										marginLeft: 20,
										marginTop: 10,
									}}>
									${item.service_cost}
								</Text>
								<Text
									style={{
										fontsize: 5,
										marginLeft: 20,
										fontStyle: 'Caption',
										marginBottom: 5,
										fontWeight: '300',
									}}>
									<Text style={{ fontWeight: 'bold' }}>Description:</Text>
									{item.description}
								</Text>
								<Text
									style={{
										fontsize: 5,
										marginLeft: 20,
										fontWeight: '400',
										marginBottom: 8,
									}}>
									<Text style={{ fontWeight: 'bold' }}>Service By:</Text>
									{item.company_name}
								</Text>
								{addtocart()}
								<View style={{ marginTop: 10, borderTopWidth: 0.01 }}>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										Includes
									</Text>
									<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10 }}>
										-{item.include}
									</Text>
								</View>
								<View style={{ marginTop: 10, borderTopWidth: 0.01 }}>
									<Text
										style={{
											marginLeft: 10,
											marginTop: 10,
											fontSize: 10,
											fontWeight: 'bold',
										}}>
										Additional Requirements
									</Text>
									<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,marginBottom:10 }}>
										-{item.additional_requirements}
									</Text>
								</View>
							</View>
						)}
						extraData={cartCount}
					/>
				</View>

				<View style={{ flex: 1,marginBottom:20}}>
					<Text
						style={{
							marginLeft: 10,
							marginTop: 10,
							fontSize: 20,
							fontWeight: 'bold',
						}}>
						Business Hours
					</Text>
					<Grid>
						<Row>
							<Col>
								<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,fontWeight: 'bold' }}>
									Day
								</Text>
							</Col>
							<Col>
								<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,fontWeight: 'bold' }}>
									Start
								</Text>
							</Col>
							<Col>
								<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,fontWeight: 'bold' }}>
									End
								</Text>
							</Col>
						</Row>
					</Grid>
					<FlatList
						data={details.business_hours}
						renderItem={({ item }) => (
							<View style={{ borderTopWidth: 0.01, marginTop: 10 }}>
								<Grid>
									<Row>
										<Col>
											<Text
												style={{ marginLeft: 10, marginTop: 10, fontSize: 10 }}>
												{item.day}
											</Text>
										</Col>
										<Col>
											<Text
												style={{ marginLeft: 10, marginTop: 10, fontSize: 10 }}>
												{item.start}
											</Text>
										</Col>
										<Col>
											<Text
												style={{
													marginLeft: 10,
													marginTop: 10,
													fontSize: 10,
												}}>
												{item.end}
											</Text>
										</Col>
									</Row>
								</Grid>
							</View>
						)}
					/>
				</View>
        <View style={{ flex: 1,marginBottom:20}}>
					<Text
						style={{
							marginLeft: 10,
							marginTop: 10,
							fontSize: 20,
							fontWeight: 'bold',
						}}>
						Provider Region
					</Text>
          			<Grid>
						<Row>
							<Col>
								<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,fontWeight: 'bold' }}>
									City
								</Text>
							</Col>
							<Col>
								<Text style={{ marginLeft: 10, marginTop: 10, fontSize: 10,fontWeight: 'bold' }}>
									Region
								</Text>
							</Col>
              			</Row>
              	</Grid>
              <FlatList
						data={details.branches}
						renderItem={({ item }) => (
							<View style={{ borderTopWidth: 0.01, marginTop: 10 }}>
								<Grid>
									<Row>
										<Col>
											<Text
												style={{ marginLeft: 10, marginTop: 10, fontSize: 10 }}>
												{item.city}
											</Text>
										</Col>
										<Col>
											<Text
												style={{ marginLeft: 10, marginTop: 10, fontSize: 10 }}>
												{item.region}
											</Text>
										</Col>
									</Row>
								</Grid>
							</View>
						)}
					/>
          </View>
				{/* <Text>{JSON.stringify(details.service)}</Text> */}
				{/* <Button title='Click Here' onPress={() => alert('Button Clicked!')} /> */}
			</ScrollView>
			<View style={{flex: 0.2}}>{cartPopup()}</View>
		</View>
	);
};

export default BookingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
