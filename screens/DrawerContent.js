import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
				{a.Role=='Customer'?(
					<Caption style={styles.caption}>Cliente</Caption>
				):(
					<Caption style={styles.caption}>Proveedor</Caption>
				)}
			</View>
		);
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
						<View style={{ flexDirection: 'row' }}>
							{/* <Avatar.Image 
                                source={{
                                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                                }}
                                size={50}
                            /> */}
							{showName()}
						</View>
					</View>

					<Drawer.Section style={styles.drawerSection}>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name='home-outline' color={color} size={size} />
							)}
							label='Casa'
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
							icon={({ color, size }) => (
								<Icon name='account-outline' color={color} size={size} />
							)}
							label='Perfil'
							onPress={() => {
								props.navigation.navigate('Profile');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name='bookmark-outline' color={color} size={size} />
							)}
							label='Reservas'
							onPress={() => {
								props.navigation.navigate('Explore');
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name='account-card-details-outline' color={color} size={size} />
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
									icon={({ color, size }) => (
										<FontAwesome name='user-o' color={color} size={size} />
									)}
									label='Iniciar sesión'
									onPress={() => props.navigation.navigate('SignInScreen')}
								/>
								<DrawerItem
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
								icon={({ color, size }) => (
									<Icon name='currency-usd' color={color} size={size} />
								)}
								label='Detalles del pago'
								onPress={() => {
									props.navigation.navigate('providerPaymentDetails');
								}}
							/>
						) : null}
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
