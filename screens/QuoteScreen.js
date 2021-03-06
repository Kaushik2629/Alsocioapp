import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable } from 'react-native-paper';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../components/context';
import { MaterialIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const QuoteScreen = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://www.alsocio.com/app/get-quotes/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.quotes);
				console.log(responseJson);
				setIsLoading(false);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.Refresh]);

	const showImage = (ImageUrl) => {
		// if (ImageUrl == "") {
		// 	return null;
		// }
		return (
			<Image
				style={{
					flexGrow: 1,
					width: 100,
					height: 200,
					marginBottom: 10,
					resizeMode: 'contain',
				}}
				source={{
					uri: 'https:alsocio.com/media/' + ImageUrl,
				}}
			/>
		);
	};

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title='Cotizaciones' />
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
					data={details}
					style={styles.flatlist}
					keyExtractor={(item, index) => item.id}
					removeClippedSubviews={false}
					renderItem={({ item }) => (
						<Card
							style={{
								width: imagewidth - 20,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.5,
								shadowRadius: 10,
								elevation: 10,
								margin: 10,
								borderRadius: 10,
								marginBottom: 20,
							}}>
							<Card.Content>
								<View
									style={{
										flexGrow: 1,
										padding: 15,
										borderBottomWidth: 0.45,
									}}>
									<Text
										style={{
											fontSize: 18,
											fontWeight: '900',
											alignSelf: 'center',
										}}>
										{item.company_name}
									</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Descripción -</Text>
									<Text style={styles.rightLabel}>{item.description}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cotizaciones -</Text>
									<Text style={styles.rightLabel}>{item.request}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Imagen -</Text>
									{showImage(item.img)}
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Respuesta -</Text>
									<Text style={styles.rightLabel}>{item.reply}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Total -</Text>
									<Text style={styles.rightLabel}>${item.total}</Text>
								</View>
								{item.reply != '' ? (
									<TouchableOpacity
										style={{
											borderRadius: 20,
											fontSize: 15,
											margin: 15,
											backgroundColor: '#262262',
										}}
										onPress={() => {
											navigation.navigate('quoteCheckoutScreen',{
												quoteId:item.quote_id
											})
										}}>
										<Text
											style={{
												alignSelf: 'center',
												fontSize: 15,
												fontWeight: 'bold',
												margin: 15,
												color: '#fff',
												flexGrow: 1,
											}}>
											Carrito
										</Text>
									</TouchableOpacity>
								) : null}
							</Card.Content>
						</Card>
					)}
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
								No tiene Cotizaciones
							</Text>
						</View>
					}
				/>
			)}
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header
				style={{
					backgroundColor: '#262262',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content titleStyle={{ padding: 10 }} title='Profile' />
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
			<View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						fontSize: 15,
						margin: 15,
						backgroundColor: '#262262',
					}}
					onPress={() => navigation.navigate('SignInScreen')}>
					<Text
						style={{
							alignSelf: 'center',
							fontSize: 15,
							fontWeight: 'bold',
							margin: 15,
							color: '#fff',
							flexGrow: 1,
						}}>
						Inicie sesión para ver sus reservas
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default QuoteScreen;

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
		fontWeight: '700',
		flexGrow: 1,
		alignSelf: 'flex-start',
	},
	rightLabel: {
		fontSize: 15,
		fontWeight: '700',
		flexGrow: 1,
		textAlign: 'right',
		alignSelf: 'flex-end',
	},
});
