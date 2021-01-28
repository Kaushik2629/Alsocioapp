import React, { Component, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIndicator } from 'react-native-indicators';
import { Appbar, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const showFeaturedServices = ({ navigation, route }) => {
	const featured_service = route.params.featured_service;
	const region = route.params.region;
	const city = route.params.city;
	const [serviceData, setServiceData] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
        setIsLoading(true)
		let services = new FormData();
		services.append('featured_service', featured_service);
		services.append('region', region);
		services.append('city', city);
		//services.append('location', 'Alanje');
		fetch('https://alsocio.com/app/get-featured-services-list/', {
			method: 'POST',
			body: services,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				console.log(responseJson);
				setServiceData(responseJson.services);
				// Replaced console(responseJson);
			});
	}, [featured_service]);

	const showDiscount = (cost, discount) => {
		return discount == null || discount == 0 ? (
			<Text
				style={{
					fontSize: 15,
					fontWeight: '500',
					marginLeft: 20,
					marginTop: 10,
				}}>
				${cost}
			</Text>
		) : (
			<View style={{ flexDirection: 'row' }}>
				<Text
					style={{
						fontSize: 15,
						fontWeight: '500',
						marginLeft: 20,
						marginTop: 10,
						textDecorationLine: 'line-through',
						textDecorationStyle: 'solid',
					}}>
					${cost}
				</Text>
				<Text
					style={{
						fontSize: 15,
						fontWeight: '500',
						marginLeft: 5,
						marginTop: 10,
					}}>
					${discount}
				</Text>
			</View>
		);
	};

	const showRatings = (rating) => {
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<View>
					{i <= rating ? (
						<Icon
							name='md-star'
							color='#fbc02d'
							size={26}
							style={{ margin: 0 }}
						/>
					) : (
						<Icon
							name='md-star'
							color='grey'
							size={26}
							color='#bdbdbd'
							style={{ margin: 0 }}
						/>
					)}
				</View>
			);
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					alignSelf: 'flex-start',
					marginLeft: 20,
				}}>
				{stars}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Servicios destacados'
				/>
			</Appbar.Header>
			{isLoading ? (
				<View
					style={{
						padding: 20,
						alignContent: 'center',
						justifyContent: 'center',
						marginTop: 20,
					}}>
					<MaterialIndicator color='#262262' />
				</View>
			) : (
				<FlatList
					data={serviceData}
					style={styles.flatlist}
					keyExtractor={(item, index) => item.id}
					renderItem={({ item }) => (
						<Card
							style={{
								elevation: 5,
								marginHorizontal: 10,
								borderRadius: 10,
								borderWidth: 0.3,
								margin: 10,
								marginBottom: 20,
							}}>
							<Card.Content>
								<View>
									<Image
										style={{
											width: 'auto',
											height: 200,
											marginVertical: 10,
										}}
										source={{
											uri: 'https:alsocio.com/media/' + item.img,
										}}
									/>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 1 }}>
										{showDiscount(item.service_cost, item.discount)}
										<Text
											style={{
												fontSize: 15,
												marginLeft: 20,
												fontWeight: 'bold',
												marginBottom: 8,
											}}>
											Servicio por:
											<Text style={{ fontWeight: '400' }}>
												{item.company_name}
											</Text>
										</Text>
										{showRatings(item.rating)}
										<Text
											style={{
												fontSize: 15,
												fontWeight: '400',
												marginLeft: 20,
											}}>
											{item.service}
										</Text>
									</View>
									<View>
										<TouchableOpacity
											style={{
												backgroundColor: '#262262',
												width: 120,
												height: 60,
												borderRadius: 5,
												margin: 'auto',
											}}
											onPress={() =>
												navigation.navigate('showDetails', {
													service_id: item.id,
												})
											}>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													padding: 20,
												}}>
												Detalles
											</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View style={{ justifyContent: 'center', padding: 10 }}>
									{item.covid_norms == true ? (
										<View style={{ flexDirection: 'row' }}>
											<Icon
												name='ios-checkbox-outline'
												color='#262262'
												size={36}
												style={{ marginHorizontal: 10 }}
											/>
											<Text
												style={{
													fontSize: 15,
													fontWeight: '400',
													alignSelf: 'center',
												}}>
												This service follows COVID-19 norms
											</Text>
										</View>
									) : null}
									{item.additional_charges == true ? (
										<Text
											style={{
												fontSize: 10,
												padding: 10,
												color: 'red',
												flexGrow: 1,
												textAlign: 'right',
												alignSelf: 'flex-start',
											}}>
											*Additional Charges may be Applied
										</Text>
									) : null}
								</View>
							</Card.Content>
						</Card>
					)}
					// extraData={cartCount}
					ListEmptyComponent={
						<View
							style={{
								flex: 1,
								backgroundColor: '#e0e0e0',
								alignItems: 'center',
								justifyContent: 'center',
								padding: 20,
							}}>
							<Text
								style={{
									fontSize: 20,
									fontWeight: '700',
								}}>
								No hay servicios disponibles
							</Text>
						</View>
					}
				/>

				// <View style={{ flex:1 }}>
				// 	<View style={{flex:1,marginTop:40,backgroundColor:'#000'}}>

				// 	</View>
				// </View>
			)}
		</View>
	);
};
export default showFeaturedServices;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// display: 'flex',
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	flatlist: {
		// flex: 1,
		padding: 0,
	},
});
