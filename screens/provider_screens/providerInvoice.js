import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable } from 'react-native-paper';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../components/context';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerInvoice = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [name, setName] = useState();

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-invoices/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.invoices);
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
			<Appbar.Header style={{ backgroundColor: '#1a237e',alignItems:'center', marginTop: 0  }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Facturas'
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
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
									flexDirection:'row'
								}}>
								<Text
									style={{
										flexGrow: 1,
										fontSize: 18,
										fontWeight: '900',
										alignSelf: 'flex-start',
										textAlign: 'left',
									}}>
									Customer Email - 
								</Text>
								<Text
									style={{
										fontSize: 13,
										fontWeight: '900',
										alignSelf: 'flex-end',
										textAlign: 'right',
										marginBottom:3,
										marginLeft:5
									}}>
									{item.customer_email}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>No.of Services - </Text>
								<Text style={styles.rightLabel}>{item.services}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Sub Total - </Text>
								<Text style={styles.rightLabel}>{item.sub_total}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Provider Charges -</Text>
								<Text style={styles.rightLabel}>{item.provider_charges}</Text>
							</View>
                            <View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Charges -</Text>
								<Text style={styles.rightLabel}>{item.service_charges}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>ITBMS -</Text>
								<Text style={styles.rightLabel}>{item.itbms}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Total Cost -</Text>
								<Text style={styles.rightLabel}>{item.cost}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Address -</Text>
								<Text style={styles.rightLabel}>{item.address}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>City -</Text>
								<Text style={styles.rightLabel}>{item.city}</Text>
							</View>
                            <View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Region -</Text>
								<Text style={styles.rightLabel}>{item.region}</Text>
							</View>
							<View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Status -</Text>
								<Text style={styles.rightLabel}>{item.status}</Text>
							</View>
                            <View style={{ flexGrow: 1, flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Payment Status -</Text>
								<Text style={styles.rightLabel}>{item.payment_status}</Text>
							</View>
						</Card.Content>
					</Card>
				)}
			/>
		</View>
	)
};

export default providerInvoice;

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
