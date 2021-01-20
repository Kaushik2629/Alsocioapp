import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Share } from 'react-native';
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
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';

export function DrawerContent(props) {
	const paperTheme = useTheme();

	const { signOut } = useContext(AuthContext);

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

	return (
		<View style={{ flex: 1 }}>
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
		backgroundColor: '#1a237e',
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
