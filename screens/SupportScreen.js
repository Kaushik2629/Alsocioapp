import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Image,
	FlatList,
	TouchableHighlight,
	TouchableOpacity,
	Platform,
	Modal,
	Alert,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIndicator } from 'react-native-indicators';

import {
	ScrollView,
	TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { TextInput, Card, Title, Appbar } from 'react-native-paper';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const SupportScreen = ({ route, navigation }) => {
	const [isLoading, setIsLoading] = useState(true);
	//maincategory object
	//name of category from parameters
	const category = route.params.category_name;
	let usercategory = new FormData();
	usercategory.append('main_category', category);

	//fetching maincategory
	const [selectedCategory, setSelectedCategory] = useState([]);
	const [selectedSubCategory, setselectedSubCategory] = useState([]);
	// const [showMainCategory_array, setShowMainCategory_array] = useState([]);
	const list = () => {
		// const [city_Array, setCityArray] = useState([]);

		useEffect(() => {
			fetch('https://alsocio.com/app/get-categories-subcategories/', {
				method: 'POST',
				body: usercategory,
			})
				.then((response) => response.json())
				.then((responseJson) => {
					setSelectedCategory(responseJson.category_subcategory_dict);
					setselectedSubCategory(
						Object.keys(responseJson.category_subcategory_dict)
					);
					setIsLoading(false);
				})
				.catch((error) => console.error(error));
		}, []);
	};
	const mainCategory = () => {
		return selectedSubCategory.map((element) => {
			console.log(element);
			return (
				<Card
					style={{
						width: imagewidth - 20,
						// alignItems: 'center',
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 1 },
						shadowOpacity: 0.8,
						shadowRadius: 10,
						elevation: 15,
						margin: 10,
						borderRadius: 10,
					}}>
					<Card.Content style={{ textAlign: 'left' }}>
						<Title style={{ padding: 10 }}>
							<Text>{element}</Text>
						</Title>
						<View>{subCategory(element)}</View>
					</Card.Content>
				</Card>
			);
		});
	};
	const subCategory = (element1) => {
		let item1 = [...selectedCategory[element1]];
		return item1.map((ele) => {
			return (
				<TouchableWithoutFeedback
					style={{ padding: 10, flexDirection: 'row' }}
					onPress={() =>
						navigation.navigate('showServices', {
							listCategory: category,
							listMainCategory: element1,
							listElement: ele,
							region: route.params.region,
							city: route.params.city,
						})
					}>
					<Text style={{ flexGrow: 1 }}>{ele}</Text>
					<Icon
						name='ios-arrow-forward'
						size={30}
						//backgroundColor='#fff'
						style={{
							color: '#8d8d8d',
							textAlign: 'center',
						}}></Icon>
				</TouchableWithoutFeedback>
			);
		});
	};

	return (
		<View
			style={{
				flex: 1,
			}}>
			<Appbar.Header style={{ backgroundColor: '#1a237e',alignItems:'center', marginTop: 0}}>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content  titleStyle={{ padding: 10 }} title={category} />
			</Appbar.Header>
			<ScrollView>
				{list()}
				{isLoading ? (
					<View
						style={{
							padding: 20,
							alignContent: 'center',
							justifyContent: 'center',
						}}>
						<MaterialIndicator color='#1a237e' />
					</View>
				) : (
					mainCategory()
				)}
			</ScrollView>
		</View>
	);
};

export default SupportScreen;
