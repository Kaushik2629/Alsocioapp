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

const showServices = ({ navigation, route }) => {
	const list = route.params.listElement;
	const listCategory = route.params.listCategory;
	const listMainCategory = route.params.listMainCategory;

	const [serviceData, setServiceData] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let services = new FormData();
		services.append('main_category', listCategory);
		services.append('category', listMainCategory);
		services.append('sub_category', list);
		services.append('region', route.params.region);
		services.append('city', route.params.city);
		//services.append('location', 'Alanje');
		fetch('https://alsocio.com/app/get-services/', {
			method: 'POST',
			body: services,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				console.log(responseJson);
				setServiceData(responseJson);
				// Replaced console(responseJson);
			});
	}, []);

	const showDiscount = (cost, discount) => {
		return discount == null || discount == 0 ? (
			<Text
				style={{
					flex:1,
					textAlign:'right',
					fontSize: 25,
					fontWeight: '500',
				}}>
				${cost}
			</Text>
		) : (
			<View style={{ flexDirection: 'row' }}>
				<Text
					style={{
						fontSize: 25,
						fontWeight: '500',
						textDecorationLine: 'line-through',
						textDecorationStyle: 'solid',
					}}>
					${cost}
				</Text>
				<Text
					style={{
						fontSize: 25,
						fontWeight: '500',
						marginLeft: 5,
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
				}}>
				{stars}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title={list} />
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
								margin: 10,
								borderWidth: 0.6,
								alignItems: 'stretch',
								justifyContent: 'center',
							}}>
							<Card.Content>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexShrink: 1 }}>
										<Text
											style={{
												fontSize: 15,
												fontWeight: 'bold',
												flex: 1,
												flexWrap: 'wrap',
											}}>
											Servicio por:
											<Text style={{ fontSize: 14, fontWeight: '400' }}>
												{item.company_name}
											</Text>
										</Text>
										{showRatings(item.rating)}
										<Text
											style={{
												fontSize: 15,
												fontWeight: '400',
												flex: 1,
												flexWrap: 'wrap',
											}}>
											{item.service}
										</Text>
									</View>
									<View
										style={{
											// flexBasis: 50,
											// flex: 1,
											// flexWrap: 'nowrap',
											flexGrow:1,
											alignItems:'flex-end',
										}}
										>
										{showDiscount(item.service_cost, item.discount)}
									</View>
								</View>
								<View>
									<Image
										style={{
											width: imagewidth - 50,
											height: imageheight / 3,
											marginVertical: 10,
										}}
										source={{
											uri: 'https:alsocio.com/media/' + item.img,
										}}
									/>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flexGrow: 1, padding: 10 }}>
										{item.covid_norms == true ? (
											<View style={{ flexDirection: 'row' }}>
												<View style={{ flexBasis: 20 }}>
													<Icon
														name='ios-checkbox-outline'
														color='#262262'
														size={20}
														style={{ marginRight: 5 }}
													/>
												</View>
												<View style={{ flexGrow: 1, flexDirection: 'row' }}>
													<Text
														style={{
															fontSize: 12,
															fontWeight: '400',
															flex: 1,
															flexWrap: 'wrap',
														}}>
														El Proveedor de servicio cumple con todas las medias
														de bioseguridad
													</Text>
												</View>
											</View>
										) : null}
										{item.additional_charges == true ? (
											<Text
												style={{
													marginTop: 10,
													flexBasis: 70,
													fontSize: 10,
													fontWeight: '400',
													flex: 1,
													flexWrap: 'wrap',
													color: 'red',
													textAlign: 'right',
													alignSelf: 'flex-start',
												}}>
												*Pueden aplicarse cargos adicionales
											</Text>
										) : null}
									</View>
									<View style={{ flexBasis: 120 }}>
										<TouchableOpacity
											style={{
												backgroundColor: '#262262',
												alignSelf: 'stretch',
												paddingVertical: 15,
												borderRadius: 5,
												alignItems: 'center',
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
												}}>
												Detalles
											</Text>
										</TouchableOpacity>
									</View>
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
export default showServices;

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
