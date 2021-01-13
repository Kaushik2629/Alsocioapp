import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	StatusBar,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
	Platform,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable, RadioButton } from 'react-native-paper';
import { AuthContext } from '../../components/context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIndicator } from 'react-native-indicators';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const providerSlot = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.com/app/get-provider-business-hours/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setIsLoading(false);
				setDetails(responseJson);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, []);

	const [isCheck, setIsCheck] = useState(false);
	const [checkDay, setCheckDate] = useState([]);
	const [endTime, setEndTime] = useState('');
	const [startTime, setStartTime] = useState('');
	const [check24hr, setCheck24hr] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [isHoliday, setIsHoliday] = useState(false);

	//start time
	const [startDate, setStartDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [showStartTime, setShowStartTime] = useState(false);

	const onStartTimeChange = (event, selectedDate) => {
		const currentDate = selectedDate || startDate;
		setShowStartTime(Platform.OS === 'ios');

		let hours = new Date(currentDate).getHours();
		let minutes = new Date(currentDate).getMinutes();
		// how to handle the cases where time is one digit
		function makeTwoDigits(time) {
			const timeString = `${time}`;
			if (timeString.length === 2) return time;
			return `0${time}`;
		}
		setStartTime(`${makeTwoDigits(hours)}:${makeTwoDigits(minutes)}`);
		if (Platform.OS == 'ios' && startTime != '') {
			setTimeout(() => {
				setShowStartTime(false);
			}, 1500);
		}
		setCheck24hr(false);
	};

	const showMode = (currentMode) => {
		setShowStartTime(true);
		setMode(currentMode);
	};

	const showStartTimepicker = () => {
		showMode('time');
	};

	//end time
	const [endDate, setEndDate] = useState(new Date());
	const [Endmode, setEndMode] = useState('date');
	const [showEndTime, setShowEndTime] = useState(false);

	const onEndTimeChange = (event, selectedDate) => {
		const currentDate = selectedDate || endDate;
		setShowEndTime(Platform.OS === 'ios');

		let hours = new Date(currentDate).getHours();
		let minutes = new Date(currentDate).getMinutes();
		// how to handle the cases where time is one digit
		function makeTwoDigits(time) {
			const timeString = `${time}`;
			if (timeString.length === 2) return time;
			return `0${time}`;
		}
		setEndTime(`${makeTwoDigits(hours)}:${makeTwoDigits(minutes)}`);
		if (Platform.OS == 'ios' && endTime != '') {
			setTimeout(() => {
				setShowEndTime(false);
			}, 1500);
		}
		setCheck24hr(false);
	};

	const showEndMode = (currentMode) => {
		setShowEndTime(true);
		setEndMode(currentMode);
	};

	const showEndTimepicker = () => {
		showEndMode('time');
	};

	const [Day, setDay] = useState('');

	return (
		<View style={styles.container}>
			<Appbar.Header
				style={{
					backgroundColor: '#1a237e',
					alignItems: 'center',
					marginTop: 0,
				}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Tu horario comercial'
				/>
			</Appbar.Header>

			<Modal
				animationType='fade'
				visible={showEditModal}
				transparent={true}
				onRequestClose={() => {
					setShowEditModal(!showEditModal);
				}}>
				<View
					style={{
						marginTop: 60,
					}}>
					<View
						style={{
							backgroundColor: '#e0e0e0',
							shadowColor: '#000',
							marginTop: 200,
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
						}}>
						<TouchableOpacity
							style={{
								flexGrow: 1,
								elevation: 3,
								alignSelf: 'flex-end',
							}}>
							<Icon.Button
								name='ios-close'
								size={25}
								backgroundColor='#e0e0e0'
								color='#000'
								style={{ padding: 15, textAlign: 'right' }}
								onPress={() => {
									setShowEditModal(!showEditModal),
										setStartTime(''),
										setEndTime(''),
										setCheck24hr(false);
								}}></Icon.Button>
						</TouchableOpacity>
						<View
							style={{
								flexGrow: 1,
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<RadioButton
								color='#1a237e'
								value='time'
								status={isCheck ? 'checked' : 'unchecked'}
								onPress={() => {
									setIsCheck(true), setCheck24hr(false), setIsHoliday(false);
								}}
							/>

							<View>
								{/* For Start Time */}
								{startTime == '' ? (
									<TouchableOpacity
										onPress={showStartTimepicker}
										style={{
											backgroundColor: '#fff',
											width: 80,
											padding: 10,
											margin: 8,
										}}>
										<Text style={{ fontSize: 11 }}>Hora de inicio</Text>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={showStartTimepicker}
										style={{
											backgroundColor: '#fff',
											width: 80,
											padding: 10,
											margin: 8,
										}}>
										<Text style={{ fontSize: 11 }}>{startTime}</Text>
									</TouchableOpacity>
								)}
								{showStartTime && (
									<DateTimePicker
										testID='dateTimePicker'
										value={startDate}
										mode={mode}
										is24Hour={true}
										display='default'
										onChange={onStartTimeChange}
									/>
								)}
							</View>

							{/* For End-Time */}
							<View>
								{endTime == '' ? (
									<TouchableOpacity
										onPress={showEndTimepicker}
										style={{
											backgroundColor: '#fff',
											width: 80,
											padding: 10,
											margin: 8,
										}}>
										<Text style={{ fontSize: 12 }}>Hora de finalización</Text>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={showEndTimepicker}
										style={{
											backgroundColor: '#fff',
											width: 80,
											padding: 10,
											margin: 8,
										}}>
										<Text style={{ fontSize: 12 }}>{endTime}</Text>
									</TouchableOpacity>
								)}
								{showEndTime && (
									<DateTimePicker
										testID='dateTimePicker'
										value={endDate}
										mode={Endmode}
										is24Hour={true}
										display='default'
										onChange={onEndTimeChange}
									/>
								)}
							</View>
							<RadioButton
								color='#1a237e'
								status={check24hr ? 'checked' : 'unchecked'}
								onPress={() => {
									setIsCheck(false),
										setCheck24hr(true),
										setStartTime('00:00'),
										setEndTime('00:00'),
										setIsHoliday(false);
								}}
							/>
							<Text style={{ fontSize: 15 }}>24 horas</Text>
						</View>
						<View
							style={{
								alignSelf: 'center',
								flexDirection: 'row',
							}}>
							<RadioButton
								color='#1a237e'
								status={isHoliday ? 'checked' : 'unchecked'}
								onPress={() => {
									setIsCheck(false),
										setCheck24hr(false),
										setStartTime(''),
										setEndTime(''),
										setIsHoliday(true);
								}}
							/>
							<Text style={{ fontSize: 15, marginTop: 5 }}>
								Mantenga unas vacaciones
							</Text>
						</View>

						<TouchableOpacity
							style={{
								borderRadius: 20,
								fontSize: 15,
								margin: 15,
								backgroundColor: '#1a237e',
							}}
							onPress={() => {
								if (
									(startTime != '' && endTime == '') ||
									(startTime == '' && endTime != '')
								) {
									alert('¡Selecciona ambas ranuras! ');
									return;
								}
								setIsLoading(true);
								setShowEditModal(!showEditModal);
								let slotdetails = new FormData();
								slotdetails.append('day', Day);
								slotdetails.append('username', a.UserName);
								slotdetails.append('start', startTime);
								slotdetails.append('end', endTime);
								fetch('https://alsocio.com/app/edit-business-hours/', {
									method: 'POST',
									body: slotdetails,
								})
									.then((response) => response.json())
									.then((responseJson) => {
										setIsLoading(false);
										setDetails(responseJson),
											setStartTime(''),
											setEndTime(''),
											setCheck24hr(false);
									})
									.catch((error) => console.error(error));
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
								Salvar
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

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
					data={details.business_hours}
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
									<Text
										style={{
											flexGrow: 1,
											fontSize: 18,
											fontWeight: '900',
											marginTop: 15,
											textAlign: 'center',
										}}>
										{item.day}
									</Text>
								</View>
								<View style={{ flexGrow: 1, padding: 10 }}>
									{item.start != '' ? (
										<View style={{ flexDirection: 'row', padding: 10 }}>
											<Text style={styles.leftLabel}>Comienzo -</Text>
											<Text style={styles.rightLabel}>{item.start}</Text>
										</View>
									) : null}
									{item.end != '' ? (
										<View style={{ flexDirection: 'row', padding: 10 }}>
											<Text style={styles.leftLabel}>Fin -</Text>
											<Text style={styles.rightLabel}>{item.end}</Text>
										</View>
									) : null}

									<TouchableOpacity
										style={{
											borderRadius: 20,
											fontSize: 15,
											margin: 15,
											backgroundColor: '#1a237e',
										}}
										onPress={() => {
											setShowEditModal(true), setDay(item.day);
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
											Editar detalles
										</Text>
									</TouchableOpacity>
								</View>
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
								No hay horario comercial disponible
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
};

export default providerSlot;

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
