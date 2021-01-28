import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Share, Modal,TouchableOpacity,Button } from 'react-native';
import {
	useTheme,
	Avatar,
	Title,
	Caption,
	Paragraph,
	Drawer,
	Text,
	TouchableRipple,
	Switch,
	IconButton,
	Colors,
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalPicker from 'react-native-modal-picker';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { Formik } from 'formik';

export function DrawerContent(props) {
	const paperTheme = useTheme();

	const [showPickerModal, setShowPickerModal] = useState(false);

	const { signOut, regionSelect, citySelect } = useContext(AuthContext);

	const a = useContext(AuthContext);

	const [name, setName] = useState();

	const fetchUserName = async () => {
		const a = await AsyncStorage.getItem('userName');
		setName(a);
	};
	useEffect(() => {
		fetchUserName();
	});

	const showName = () => {
		return a.UserName == null ? (
			<View style={{ marginLeft: 15 }}>
				<Title style={styles.title}>Invitado</Title>
				{/* <Caption style={styles.caption}>@Guest</Caption> */}
			</View>
		) : (
			<View style={{ marginLeft: 15 }}>
				<Title style={styles.title}>{a.UserName}</Title>
				{a.Role == 'Customer' ? (
					<Caption style={styles.caption}>Cliente</Caption>
				) : (
					<Caption style={styles.caption}>Proveedor</Caption>
				)}
			</View>
		);
	};

	const shareApp = async () => {
		if (Platform.OS == 'android') {
			try {
				const result = await Share.share({
					title: 'Alsocio|You are in Good Hands',
					message:
						'Click on this link to download the app' +
						'\n' +
						'https://play.google.com/store/apps/details?id=com.Alsocio.AlsocioApp&hl=en_US&gl=US',
				});
				if (result.action === Share.sharedAction) {
					if (result.activityType) {
						// shared with activity type of result.activityType
					} else {
						// shared
					}
				} else if (result.action === Share.dismissedAction) {
					// dismissed
				}
			} catch (error) {
				alert(error.message);
			}
		} else {
			try {
				const result = await Share.share({
					message:
						'AlSocio|You are in Good Hands' +
						'Click on this link to download the app ',
					url:
						'https://play.google.com/store/apps/details?id=com.Alsocio.AlsocioApp&hl=en_US&gl=US',
				});
				if (result.action === Share.sharedAction) {
					if (result.activityType) {
						// shared with activity type of result.activityType
					} else {
						// shared
					}
				} else if (result.action === Share.dismissedAction) {
					// dismissed
				}
			} catch (error) {
				alert(error.message);
			}
		}
	};

	const refreshPage = async () => {
		signOut();
		if (a.UserName == null && a.Role == 'Customer') {
			props.navigation.navigate('Home');
			return;
		}
		if (a.UserName == null && a.Role == 'Provider') {
			props.navigation.navigate('Home');
			return;
		}
	};

	//for region
	const [regionArray, setRegionArray] = useState([]);

	const [cityArray, setCityArray] = useState([]);

	const showRegionOptions = () => {
		let item = [];
		let region_array = [];
		let showCity_array = [];
		let showRegion_array = [];
		fetch('https://alsocio.com/app/get-city-region/', {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((responseJson) => {
				item = [...item, responseJson];

				item.map((item) => {
					region_array = [...region_array, item.region_city_dict];

					region_array.map((city) => {
						showRegion_array = Object.keys(city);

						setRegionArray(showRegion_array);

						showCity_array = Object.values(city);

						setCityArray(showCity_array);
					});
				});
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		{
			showRegionOptions();
		}
	}, []);

	const [cityList, setCityList] = useState([]);

	const showPicker = (properties) => {
		return (
			<View style={{ justifyContent: 'space-around', padding: 10 }}>
				<View style={{ padding: 10 }}>
					<ModalPicker
						data={data}
						cancelText='end'
						// style={{padding:15, backgroundColor: 'green'}}
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						cancelTextStyle={{ fontSize: 25 }}
						initValue='Seleccione región!'
						onChange={(option) => {
							// alert(option.label);
							// let index1 = regionArray.indexOf(option.label);
							properties.setFieldValue('region', option.label);
							let array = [cityArray[option.key]].toString();
							let city_array = array.split(',');
							console.log(city_array);
							setCityList(city_array);
						}}
					/>
				</View>
				<View style={{ padding: 10 }}>
					<ModalPicker
						selectStyle={{
							padding: 27,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						data={city_data}
						initValue='Ciudad selecta'
						onChange={(option) => {
							properties.setFieldValue('city', option.label);
						}}
					/>
				</View>
			</View>
		);
	};

	let temp = 0;
	const data = regionArray.map((element) => {
		return { key: temp++, label: element };
	});

	let temp1 = 0;
	const city_data = cityList.map((item) => {
		return { key: temp1++, label: item };
	});

	return (
		<View style={{ flex: 1 }}>
			<Modal
				animationType='fade'
				visible={showPickerModal}
				transparent={true}
				onRequestClose={() => {
					setShowPickerModal(!showPickerModal);
				}}>
				<Formik
					initialValues={{ region: '', city: '' }}
					onSubmit={(values) => {						
						if (values.region != '' && values.city != '') {
							setShowPickerModal(false)
							regionSelect(values.region);
							citySelect(values.city);
						}else{
							alert('Please select both!')
						}
					}}>
					{(props) => (
						<View
							style={{
								marginTop: 60,
							}}>
							<View
								style={{
									backgroundColor: '#fff',
									shadowColor: '#000',
									marginTop: 50,
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
									}}
									onPress={() => {
										setShowPickerModal(!showPickerModal);
									}}>
									<Icon.Button
										name='close'
										size={25}
										backgroundColor='#fff'
										color='#000'
										style={{ padding: 15, textAlign: 'right' }}
										onPress={() => {
											setShowPickerModal(!showPickerModal);
										}}></Icon.Button>
								</TouchableOpacity>
								{showPicker(props)}
								<Button
									title='Submit'
									color='#262262'
									style={{
										borderRadius: 20,
										fontSize: 15,
									}}
									onPress={() => {
										props.handleSubmit();
									}}
								/>
							</View>
						</View>
					)}
				</Formik>
			</Modal>

			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{ flexDirection: 'row' }}>{showName()}</View>
					</View>

					<Drawer.Section style={styles.drawerSection}>
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon name='home-outline' color={color} size={size} />
							)}
							label='Inicio'
							onPress={() => {
								{
									if (a.Role == 'Customer') {
										props.navigation.navigate('Home');
									}
									if (a.Role == 'Provider') {
										props.navigation.navigate('providerHome');
									}
								}
							}}
						/>
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon name='account-outline' color={color} size={size} />
							)}
							label='Perfil'
							onPress={() => {
								props.navigation.navigate('Profile');
							}}
						/>
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon name='bookmark-outline' color={color} size={size} />
							)}
							label='Reservas'
							onPress={() => {
								{
									if (a.Role == 'Customer') {
										props.navigation.navigate('Explore');
									}
									if (a.Role == 'Provider') {
										props.navigation.navigate('providerBookings');
									}
								}
							}}
						/>
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon
									name='account-card-details-outline'
									color={color}
									size={size}
								/>
							)}
							label='Factura'
							onPress={() => {
								{
									if (a.Role == 'Customer') {
										props.navigation.navigate('SettingsScreen');
									}
									if (a.Role == 'Provider') {
										props.navigation.navigate('providerInvoice');
									}
								}
							}}
						/>
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon name='account-check-outline' color={color} size={size} />
							)}
							label='Cotizaciones'
							onPress={() => {
								{
									if (a.Role == 'Customer') {
										props.navigation.navigate('QuoteScreen');
									}
									if (a.Role == 'Provider') {
										props.navigation.navigate('providerQuotes');
									}
								}
							}}
						/>
						{a.UserName == null ? (
							<View>
								<DrawerItem
									style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
									icon={({ color, size }) => (
										<FontAwesome name='user-o' color={color} size={size} />
									)}
									label='Iniciar sesión'
									onPress={() => props.navigation.navigate('SignInScreen')}
								/>
								<DrawerItem
									style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
									icon={({ color, size }) => (
										<FontAwesome name='plus' color={color} size={size} />
									)}
									label='Regístrate'
									onPress={() => props.navigation.navigate('continueWith')}
								/>
							</View>
						) : null}
						{a.Role == 'Provider' ? (
							<DrawerItem
								style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
								icon={({ color, size }) => (
									<Icon name='currency-usd' color={color} size={size} />
								)}
								label='Detalles del pago'
								onPress={() => {
									props.navigation.navigate('providerPaymentDetails');
								}}
							/>
						) : null}
						<DrawerItem
							style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
							icon={({ color, size }) => (
								<Icon name='share-variant' color={color} size={size} />
							)}
							label='Comparte AlSocio'
							onPress={() => {
								shareApp();
							}}
						/>
						{a.cityValue==null || a.cityValue==''?(
							<DrawerItem
								style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
								icon={({ color, size }) => (
									<Icon name='map-marker' color={color} size={size} />
								)}
								label='Selecciona tu Ubicación'
								onPress={() => {
									setShowPickerModal(true);
								}}
							/>
						):(
							<DrawerItem
								style={{ borderBottomColor: '#f4f4f4', borderBottomWidth: 1 }}
								icon={({ color, size }) => (
									<Icon name='map-marker' color={color} size={size} />
								)}
								label={a.cityValue}
								onPress={() => {
									setShowPickerModal(true);
								}}
							/>
						)}
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomDrawerSection}>
				{a.UserName != null ? (
					<DrawerItem
						icon={({ color, size }) => (
							<Icon name='exit-to-app' color={color} size={size} />
						)}
						label='Cerrar sesión'
						onPress={() => {
							refreshPage();
						}}
					/>
				) : null}
			</Drawer.Section>
		</View>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
		backgroundColor: '#262262',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
		color: '#fff',
	},
	row: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15,
	},
	paragraph: {
		fontWeight: 'bold',
		marginRight: 3,
	},
	drawerSection: {
		marginTop: 15,
	},
	bottomDrawerSection: {
		marginBottom: 15,
		borderTopColor: '#f4f4f4',
		borderTopWidth: 1,
	},
	preference: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
});
