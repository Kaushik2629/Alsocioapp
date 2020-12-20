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
	TextInput,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Appbar, Card, DataTable } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import { AuthContext } from '../components/context';
import { GiftedChat, Send, SystemMessage } from 'react-native-gifted-chat';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const itemsPerPage = 5;

const chatContainer = ({ route, navigation }) => {
	const a = useContext(AuthContext);

	const [chats, setChats] = useState([]);

	const [message, setMessage] = useState();

	const [messageId, setMessageId] = useState(0);

	const fetchUsername = async () => {
		// alert(route.params.booking_id)
		let chatDetails = new FormData();
		chatDetails.append('booking_id', route.params.booking_id);
		fetch('https://alsocio.geop.tech/app/get-chats/', {
			method: 'POST',
			body: chatDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setChats(responseJson.chats);
				// clearInterval(t);
				// var t = setInterval(()=>{
				setMessageId(responseJson.message_id);
				// },5000);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		fetchUsername();
	}, []);

	const handleSend = () => {
		if (message != null  && message!='') {
			let chatDetails = new FormData();
			chatDetails.append('booking_id', route.params.booking_id);
			chatDetails.append('username', a.UserName);
			chatDetails.append('message', message);
			fetch('https://alsocio.geop.tech/app/send-message/', {
				method: 'POST',
				body: chatDetails,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setChats(responseJson.chats);
					setMessageId(responseJson.message_id);
				})
				.catch((error) => console.error(error));
		}
	};

	const getNewMessage = () => {
		let chatDetails = new FormData();
		chatDetails.append('booking_id', route.params.booking_id);
		chatDetails.append('message_id', messageId);
		fetch('https://alsocio.geop.tech/app/check-new-message/', {
			method: 'POST',
			body: chatDetails,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.new_messages != '' && responseJson.message_id != '') {
					setChats(responseJson.chats);
					setMessageId(responseJson.message_id);
					return;
				}
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		var t = setInterval(() => {
			if (messageId != null) {
				getNewMessage();
			}
		}, 10000);
		return () => {
			clearTimeout(t);
		};
	});

	const showTimeStamp = (TimeString,Username) => {
		if(Username!=a.UserName){
			let arr = [TimeString].toString();
		arr = arr.split('T');
		let time = arr[1].toString();
		return(<Text
			style={{
				alignSelf: 'flex-end',
				fontSize: 10,
				fontWeight: 'bold',
				color: '#fff',
			}}>
			{time}
		</Text>)
		}else{
			let arr = [TimeString].toString();
		arr = arr.split('T');
		let time = arr[1].toString();
		return(<Text
			style={{
				alignSelf: 'flex-end',
				fontSize: 10,
				fontWeight: 'bold',
				color: '#000',
			}}>
			{time}
		</Text>)
		}
		
	};

	const checkUserChat = (Username, Time, Message) => {
		if (Username != a.UserName) {
			return (
				<Card
					style={{
						width: imagewidth - 90,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.5,
						shadowRadius: 10,
						elevation: 10,
						margin: 10,
						borderRadius: 10,
						alignSelf: 'flex-start',
						backgroundColor: '#1a237e',
					}}>
					<View
						style={{
							flexGrow: 1,
							paddingVertical: 10,
							marginRight: 10,
						}}>
						{showTimeStamp(Time,Username)}
					</View>
					<View style={{ flexGrow: 1, marginBottom: 25 }}>
						<Text style={{ alignSelf: 'center', color: '#fff' }}>
							{Message}
						</Text>
					</View>
				</Card>
			);
		} else {
			return (
				<Card
					style={{
						width: imagewidth - 90,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.5,
						shadowRadius: 10,
						elevation: 10,
						margin: 10,
						borderRadius: 10,
						alignSelf: 'flex-end',
						backgroundColor: '#fff',
					}}>
					<View
						style={{
							flexGrow: 1,
							paddingVertical: 10,
							marginRight: 10,
						}}>
						<Text
							style={{
								alignSelf: 'flex-end',
								fontSize: 10,
								fontWeight: 'bold',
								color: '#000',
							}}>
							{showTimeStamp(Time,Username)}
						</Text>
					</View>
					<View style={{ flexGrow: 1, marginBottom: 25 }}>
						<Text style={{ alignSelf: 'center', color: '#000' }}>
							{Message}
						</Text>
					</View>
				</Card>
			);
		}
	};

	// alert(messageId)
	return (
		<View style={styles.container}>
			<Appbar.Header style={{ backgroundColor: '#1a237e' }}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content
					titleStyle={{ padding: 10 }}
					title={route.params.provider_name}
					subtitleStyle={{ marginBottom: 5 }}
				/>
			</Appbar.Header>
			<FlatList
				data={chats}
				style={styles.flatlist}
				scrollsToEnd
				renderItem={({ item }) => (
					<View>
						{checkUserChat(item.from_username, item.time, item.message)}
					</View>
				)}
			/>
			<View style={styles.action}>
				<TextInput
					placeholder='Type your message here..'
					placeholderTextColor='#666666'
					style={styles.textInput}
					autoCapitalize='none'
					onChangeText={(val) => {
						setMessage(val);
					}}
				/>
				<TouchableOpacity onPress={() => handleSend}>
					<IconButton
						size={40}
						icon='send-circle'
						color='#1a237e'
						onPress={() => handleSend()}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default chatContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlist: {
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
	action: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e0e0e0',
		paddingHorizontal: 10,
	},
	textInput: {
		flexGrow: 1,
		color: '#1a237e',
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 15,
		backgroundColor: '#fff',
	},
});