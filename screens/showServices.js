import React, { Component, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MaterialIndicator } from 'react-native-indicators';
import { Appbar, Card } from 'react-native-paper';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const showServices = ({ navigation, route }) => {
	const list = route.params.listElement;
	const listCategory = route.params.listCategory;
	const listMainCategory = route.params.listMainCategory;

	const [serviceData, setServiceData] = useState([]);

	const [isLoading,setIsLoading] = useState(true)

	useEffect(() => {
		let services = new FormData();
		services.append('main_category', listCategory);
		services.append('category', listMainCategory);
		services.append('sub_category', list);
		services.append('region', route.params.region);
		services.append('city', route.params.city);
		//services.append('location', 'Alanje');
		fetch('https://alsocio.geop.tech/app/get-services/', {
			method: 'POST',
			body: services,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false)
				console.log(responseJson);
				setServiceData(responseJson);
				// Replaced console(responseJson);
			});
	}, []);

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

	return (
		<View styles={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e'}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title={listMainCategory} />
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
			{isLoading?(
				<View
				style={{
					padding: 20,
					alignContent: 'center',
					justifyContent: 'center',
					marginTop:20
				}}>
				<MaterialIndicator color='#1a237e' />
			</View>
			):(
				<FlatList
				data={serviceData}
				keyExtractor={(item, index) => item.id}
				style={{flexGrow:0.85}}
				renderItem={({ item }) => (
					<Card
						style={{
							// width: imagewidth,
							// alignItems: 'center',
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.5,
							shadowRadius: 10,
							elevation: 10,
							margin: 10,
							borderRadius: 10,
						}}>
						<Card.Content>
							<Image
								style={{
									width: 'auto',
									height: 200,
									marginVertical: 10,
								}}
								source={{ uri: 'https:alsocio.geop.tech/media/' + item.img }}
							/>

							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flexGrow: 1 }}>
									{showDiscount(item.service_cost, item.discount)}
									<Text
										style={{
											fontSize: 15,
											marginLeft: 20,
											fontWeight: 'bold',
											marginBottom: 8,
										}}>
										Service By:
										<Text style={{ fontWeight: '400' }}>
											{item.company_name}
										</Text>
									</Text>
									<Text
										style={{ fontSize: 15, fontWeight: '400', marginLeft: 20 }}>
										{item.category}
									</Text>
								</View>
								<TouchableOpacity
									style={{
										backgroundColor: '#1a237e',
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
										Book
									</Text>
								</TouchableOpacity>
							</View>
							<Text
								style={{
									fontSize: 15,
									marginLeft: 20,
									marginBottom: 5,
									fontWeight: '300',
								}}>
								{item.description}
							</Text>
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
								fontWeight: '900',
								fontFamily: 'sans-serif-light',
							}}>
							No services available
						</Text>
					</View>
				}
			/>
			)}		
		</View>
	);
};
export default showServices;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'nowrap',
	},
});