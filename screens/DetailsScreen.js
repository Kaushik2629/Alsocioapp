import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { Appbar, Card } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MaterialIndicator } from 'react-native-indicators';
import { AuthContext } from '../components/context';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const DetailsScreen = ({ navigation }) => {
	const a = useContext(AuthContext);
	const [details, setDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// const {notifyUser} = useContext(AuthContext);

	const fetchUsername = () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-notifications/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				// notifyUser(responseJson.notifications)
				setIsLoading(false);
				setDetails(responseJson.notifications);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		fetchUsername();
		console.log(details.length);
	}, [a.UserName]);

	const [currentDate, setCurrentDate] = useState('');

	useEffect(() => {
		var date = new Date().getDate(); //Current Date
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		setCurrentDate(
			year + '/' + month + '/' + date + '/' + hours + '/' + min + '/' + sec
		);
	}, []);

	function showDate(date1) {
		let arr = [date1].toString();
		arr = arr.split('T');
		let fulldate = arr[0].toString();
		let time = arr[1].toString();
		fulldate = fulldate.split('-');
		time = time.split(':');
		let date = fulldate[2];
		let month = fulldate[1];
		let year = fulldate[0];
		let hour = time[0];
		let minute = time[1];
		let second = Math.round(time[2]);

		//for year
		let temp = new Date().getFullYear() - year;
		if (temp == 0) {
			temp = new Date().getMonth() + 1 - month;
			if (temp == 1) {
				let a = new Date().getDate() - date;
				if (date == 31) {
					a = 31 + a;
					return (
						<Text
							style={{
								alignSelf: 'flex-end',
								fontSize: 10,
								fontWeight: 'bold',
							}}>
							{a} days ago
						</Text>
					);
				}
				a = 30 + a;
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} days ago
					</Text>
				);
			}

			//for date
			let a = new Date().getDate() - date;
			if (a == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} day ago
					</Text>
				);
			}
			if (a > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} days ago
					</Text>
				);
			}

			//for hour
			temp = new Date().getHours() - hour;
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} hours ago
					</Text>
				);
			}
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} hour ago
					</Text>
				);
			}

			//for minute
			temp = new Date().getMinutes() - minute;
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} minute ago
					</Text>
				);
			}
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} minutes ago
					</Text>
				);
			}

			//for seconds
			temp = new Date().getSeconds() - second;
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} second ago
					</Text>
				);
			}
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} seconds ago
					</Text>
				);
			}
		}

		//for different years
		if (temp == 1) {
			month = new Date().getMonth() - month + 12;
			temp = new Date().getMonth() + 1 - month;
			if (temp == 1) {
				let a = new Date().getDate() - date;
				if (date == 31) {
					a = 31 + a;
					return (
						<Text
							style={{
								alignSelf: 'flex-end',
								fontSize: 10,
								fontWeight: 'bold',
							}}>
							{a} days ago
						</Text>
					);
				}
				a = 30 + a;
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} days ago
					</Text>
				);
			}
			let a = new Date().getDate() - date;
			if (a == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} day ago
					</Text>
				);
			}
			if (a > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{a} days ago
					</Text>
				);
			}

			temp = new Date().getHours() - hour;
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} hours ago
					</Text>
				);
			}
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} hour ago
					</Text>
				);
			}

			temp = new Date().getMinutes() - minute;
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} minute ago
					</Text>
				);
			}
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} minutes ago
					</Text>
				);
			}

			temp = new Date().getSeconds() - second;
			if (temp == 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} second ago
					</Text>
				);
			}
			if (temp > 1) {
				return (
					<Text
						style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold' }}>
						{temp} seconds ago
					</Text>
				);
			}
		}
	}

	// const fetchAgain = ()=>{
	//   console.log('ojnon')
	// }

	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Notificaciones'
					subtitleStyle={{ marginBottom: 5 }}
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
					<MaterialIndicator color='#1a237e' />
				</View>
			) : (
				<FlatList
					data={details}
					style={styles.flatlist}
					keyExtractor={(item, index) => item.id}
					renderItem={({ item }) => {
						return (
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
								}}>
								<View
									style={{ flexGrow: 1, paddingVertical: 10, marginRight: 10 }}>
									{showDate(item.date)}
								</View>
								<View style={{ flexGrow: 1, marginBottom: 30 }}>
									<Text style={{ alignSelf: 'center' }}>
										{item.notification}
									</Text>
								</View>
							</Card>
						);
					}}
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
								No Notificaciones
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
};

export default DetailsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlist: {
		// flex: 1,
		padding: 0,
	},
});
