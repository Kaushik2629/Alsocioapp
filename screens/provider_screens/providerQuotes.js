import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
	Image,
	Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Card, DataTable, TextInput } from 'react-native-paper';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../components/context';
import { Formik } from 'formik';

const imagewidth = Dimensions.get('window').width;
const imageheight = Dimensions.get('window').height;

const providerQuotes = ({ navigation }) => {
	const a = useContext(AuthContext);

	const [details, setDetails] = useState([]);

	const fetchUsername = async () => {
		let customer_name = new FormData();
		customer_name.append('username', a.UserName);
		fetch('https://alsocio.geop.tech/app/get-provider-quotes/', {
			method: 'POST',
			body: customer_name,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setDetails(responseJson.quotes);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		if (a.UserName != null) {
			fetchUsername();
		}
	}, []);

	const [modalVisible, setModalVisible] = useState(false);

	const [quoteId,setQuoteId] = useState()

	const showForm = () => {
		return (
			<View style={{ padding: 10 }}>
				<Formik
					initialValues={{ reply: '', cost: '' }}
					onSubmit={(values) => {
						let quoteDetails = new FormData();
						quoteDetails.append('id', quoteId);
						quoteDetails.append('reply', values.reply);
						quoteDetails.append('quote_cost', values.cost);
						quoteDetails.append('username', a.UserName);
						fetch('https://alsocio.geop.tech/app/reply-quote/', {
							method: 'POST',
							body: quoteDetails,
						})
							.then((response) => response.json())
							.then((responseJson) => {
								setDetails(responseJson.quotes)
								setModalVisible(!modalVisible)
							})
							.catch((error) => console.error(error));
					}}>
					{(props) => (
						<View>
							<TextInput
								multiline
								minHeight={50}
								style={{
									borderWidth: 1,
									borderColor: '#ddd',
									borderRadius: 8,
									padding: 10,
									fontSize: 15,
									margin: 10,
								}}
								placeholder='Enter your Reply'
								onChangeText={props.handleChange('reply')}
								value={props.values.reply}
							/>
							<TextInput
								minHeight={20}
								style={{
									borderWidth: 1,
									borderColor: '#ddd',
									borderRadius: 8,
									padding: 10,
									fontSize: 15,
									margin: 10,
									marginBottom: 20,
								}}
								placeholder='Enter Cost'
								onChangeText={props.handleChange('cost')}
								value={props.values.cost}
								keyboardType={'numeric'}
							/>
							<Button
								title='Submit'
								color='#1a237e'
								style={{
									borderRadius: 20,
									fontSize: 15,
								}}
								onPress={() => props.handleSubmit()}
							/>
						</View>
					)}
				</Formik>
			</View>
		);
	};

	return a.UserName != null ? (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Quotes'
					subtitleStyle={{ marginBottom: 5 }}
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>

			<Modal
				animationType='fade'
				visible={modalVisible}
				transparent={true}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View
					style={{
						marginTop: 60,
					}}>
					<View
						style={{
							backgroundColor: '#fff',
							shadowColor: '#000',
							marginTop: 60,
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
								backgroundColor='#fff'
								color='#000'
								style={{ padding: 15, textAlign: 'right' }}
								onPress={() => {
									setModalVisible(!modalVisible);
								}}></Icon.Button>
						</TouchableOpacity>
						{showForm()}
					</View>
				</View>
			</Modal>
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
										marginBottom: 3,
										marginLeft: 5,
									}}>
									{item.customer_email}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Customer Name -</Text>
								<Text style={styles.rightLabel}>{item.customer_name}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Contact -</Text>
								<Text style={styles.rightLabel}>{item.contact}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Description -</Text>
								<Text style={styles.rightLabel}>{item.description}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Request -</Text>
								<Text style={styles.rightLabel}>{item.request}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Reply -</Text>
								<Text style={styles.rightLabel}>{item.reply}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Image -</Text>
								{item.image !== null ? (
									<Image
										style={{
											flexGrow: 1,
											width: 100,
											height: 100,
											marginBottom: 10,
										}}
										source={{
											uri: 'https:alsocio.geop.tech/media/' + item.img,
										}}
									/>
								) : (
									<Text style={styles.rightLabel}>No Image Available</Text>
								)}
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Cost -</Text>
								<Text style={styles.rightLabel}>{item.cost}</Text>
							</View>
							<View style={{ flexDirection: 'row', padding: 10 }}>
								<Text style={styles.leftLabel}>Service Charges -</Text>
								<Text style={styles.rightLabel}>{item.service_charges}</Text>
							</View>

							<TouchableOpacity
								style={{
									borderRadius: 20,
									fontSize: 15,
									margin: 15,
									backgroundColor: '#1a237e',
								}}
								onPress={() => {
									setModalVisible(true),
									setQuoteId(item.id)
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
									Reply
								</Text>
							</TouchableOpacity>
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
								fontWeight: '900',
								fontFamily: 'sans-serif-light',
							}}>
							No Quotes
						</Text>
					</View>
				}
			/>
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title='Profile'
					subtitleStyle={{ marginBottom: 5 }}
				/>
				<Appbar.Action icon='menu' onPress={() => navigation.openDrawer()} />
			</Appbar.Header>
			<View>
				<TouchableOpacity
					style={{
						borderRadius: 20,
						fontSize: 15,
						margin: 15,
						backgroundColor: '#1a237e',
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
export default providerQuotes;

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