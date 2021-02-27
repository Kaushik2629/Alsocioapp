import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable } from 'react-native-paper';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../components/context';
import { MaterialIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const SettingsScreen = ({ navigation }) => {
	const a = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-invoices/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				console.log(responseJson)
				setDetails(responseJson.invoices);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, [a.Refresh]);


	const showDateStamp = (DateString) => {
		let arr = [DateString].toString();
		arr = arr.split('T');
		let time = arr[0].toString();
		return (
      <View style={{flexDirection:'row',flexGrow:1}}>
        <Text
				style={{
					fontSize: 15,
					fontWeight: 'bold',
					color: '#000',
				}}>
			Fecha-
			</Text>
        <Text
				style={{
					fontSize: 15,
					color: '#000',
				}}>
				{time}
			</Text>
      </View>
			
		);
	};

	const showTimeStamp = (TimeString) => {
		let arr = [TimeString].toString();
		arr = arr.split('T');
		let time = arr[1].toString();
		return (
      <View style={{flexDirection:'row'}}>
        <Text
				style={{
					fontSize: 15,
					fontWeight: 'bold',
					color: '#000',
				}}>
			Hora-
			</Text>
			<Text
				style={{
					fontSize: 15,
					color: '#000',
				}}>
				{time}
			</Text>
      </View>
		);
	};

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0 }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Facturas'
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
					data={details}
					style={styles.flatlist}
					keyExtractor={(item, index) => item.id}
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
										flexDirection: 'row',
									}}>
									{showDateStamp(item.date)}
									{showTimeStamp(item.date)}
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Numero de servicios - </Text>
									<Text style={styles.rightLabel}>{item.services}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Subtotal - </Text>
									<Text style={styles.rightLabel}>${item.sub_total}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cargos por servicio -</Text>
									<Text style={styles.rightLabel}>${item.service_charges}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>ITBMS -</Text>
									<Text style={styles.rightLabel}>${item.itbms}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Coste total -</Text>
									<Text style={styles.rightLabel}>${item.cost}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Cargos adicionales -</Text>
									<Text style={styles.rightLabel}>${item.additional_charges}</Text>
								</View>
								<View style={{ flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Estado -</Text>
									<Text style={styles.rightLabel}>{item.status}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Reembolso -</Text>
									<Text style={styles.rightLabel}>${item.refund}</Text>
								</View>
								<View
									style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
									<Text style={styles.leftLabel}>Estado de reembolso -</Text>
									<Text style={styles.rightLabel}>{item.refund_status}</Text>
								</View>
							</Card.Content>
						</Card>
					)}
				/>
			)}
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#262262',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Facturas'
				/>
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
						Login to view your Bookings
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SettingsScreen;

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
		fontWeight: '500',
		flexGrow: 1,
		textAlign: 'right',
		alignSelf: 'flex-end',
	},
});
