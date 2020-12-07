import React, { Component, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	Button,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import showCart from '../reducers/showCart';
// import { Col, Row, Grid } from 'react-native-easy-grid';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Button } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { Header } from 'react-native-elements';

import { Card } from 'react-native-paper';

const sampleBookings = ({ navigation }) => {
	return (
		<View
			style={{
				flex: 1,
				alignItems: 'flex-start',
				justifyContent: 'flex-start',
			}}>
			<View
				style={{
					flexDirection: 'row',
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.5,
					shadowRadius: 10,
					elevation: 3,
					padding: 10,
					margin: 5,
					borderRadius: 10,
				}}>
					{/* <Card.Content style={{flex: 1,flexDirection: 'row',}}> */}
				<View style={{ flexGrow: 1, padding: 10, textAlign: 'center' }}>
					<Image
						style={{ width: 70, height: 70 }}
						source={require('../assets/service-icons/Appliances.png')}
					/>
				</View>
				<View style={{ flexGrow: 3, padding: 10 }}>
					<Text>ijjfeiw</Text>
					<Text>ijjfeiw</Text>
				</View>
				<View style={{ flexGrow: 2, padding: 10, textAlign: 'right' }}>
					<Text>ijjfeiw</Text>
					<Text>ijjfeiw</Text>
				</View>
				{/* </Card.Content> */}
			</View>
			
			<Card>
				{/* </View> */}
				{/* <View style={{ marginTop: 10 }}> */}
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flexGrow: 1, padding: (0, 10) }}>
						<Text>ddnics</Text>
					</View>
					<View style={{ flexGrow: 1, textAlign: 'right', padding: (0, 10) }}>
						<Text>nsdcnsin</Text>
					</View>
				</View>
				{/* <View style={{ flexDirection: 'row' }}>
					<View style={{ flexGrow: 1, padding: (0, 10) }}>
						<Text>ddnics</Text>
					</View>
					<View style={{ flexGrow: 1, textAlign: 'right', padding: (0, 10) }}>
						<Text>nsdcnsin</Text>
					</View>
				</View> */}
				{/* <View style={{ flexDirection: 'row' }}>
					<View style={{ flexGrow: 1, padding: (0, 10) }}>
						<Text>ddnics</Text>
					</View>
					<View style={{ flexGrow: 1, textAlign: 'right', padding: (0, 10) }}>
						<Text>nsdcnsin</Text>
					</View>
				</View> */}

				{/* total */}
				{/* <View style={{ flexDirection: 'row', padding: (2,10) }}>
					<View style={{ flexGrow: 1,}}>
						<Text style={{ fontSize: 20 }}>Total</Text>
					</View>
					<View style={{ flexGrow: 1, textAlign: 'right' }}>
						<Text>sdcsdc</Text>
					</View>
				</View> */}
			</Card>
		</View>
	);
};
export default sampleBookings;
