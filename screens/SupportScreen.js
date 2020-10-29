import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { map } from 'jquery';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { unmountComponentAtNode } from 'react-dom';
import AsyncStorage from '@react-native-community/async-storage';

const imagewidth = Dimensions.get('screen').width;
const imageheight = Dimensions.get('screen').height;

const SupportScreen = ({ route, navigation }) => {
	
	const [data, setData] = React.useState({
		servicecategories: [],
	});
	const category = route.params.category_name;
	let usercategory = new FormData();
	usercategory.append('main_category', category);

	const [selectedValues, setSelectedValue] = React.useState({
		selectedValue: '',
	});
	const list = () => {
		const a = fetch('https://alsocio.geop.tech/app/get-categories/', {
			method: 'POST',
			body: usercategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				 data.servicecategories = responseJson.categories;
				//console.log(data.servicecategories);
				console.log(responseJson);
			})
			.catch((error) => console.error(error));

		a.then(() => {
			console.log('hi');
		});

		console.log(data);

		const pickeritem = () => {
			return data.servicecategories.map((element) => {
				return <Picker.Item label={element} value={element} />;
			});
		};
		return (
			<Picker
				selectedValue={selectedValues.selectedValue}
				style={{
					height: 50,
					width: imagewidth * 0.8,
					borderRadius: 5,
					backgroundColor: '#fff',
					fontSize: 30,
					fontWeight: 'bold',
				}}
				onValueChange={(itemValue) => sublist(itemValue)}>
				{pickeritem()}
			</Picker>
		);
	};

	const [subcategories, setSubcategory] = React.useState({
		subcategoriesarray: [],
	});
	const sublist = (itemValue) => {
		setSelectedValue({
			selectedValue: itemValue,
		});
		let subcategory = new FormData();
		subcategory.append('main_category', category);
		subcategory.append('category', itemValue);
		fetch('https://alsocio.geop.tech/app/get-sub-categories/', {
			method: 'POST',
			body: subcategory,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				setSubcategory({
					...subcategories,
					subcategoriesarray: responseJson.sub_categories,
				});
				alert(responseJson.sub_categories);
				console.log(subcategories.subcategoriesarray);
			})
			.catch((error) => console.error(error))
			.finally(() => {});
	};

	const subcategorylist = () => {
		return subcategories.subcategoriesarray.map((element) => {
			return (
				<View>
					<Text
						style={{ fontSize: 15, fontStyle: 'Calibri', fontWeight: '600' }}>
						{element}
					</Text>
				</View>
			);
		});
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					flex: 0.14,
					top: 0,
					width: imagewidth,
					backgroundColor: '#1a237e',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<Icon.Button
					name='ios-arrow-back'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 5 }}
					onPress={() => navigation.goBack()}></Icon.Button>
				<Text
					style={{
						fontSize: 25,
						marginTop: 5,
						marginHorizontal: 50,
						color: '#fff',
						fontWeight: '300',
						marginLeft: imagewidth / 4,
					}}>
					Services
				</Text>
				<Icon.Button
					name='ios-menu'
					size={25}
					backgroundColor='#1a237e'
					style={{ marginLeft: 30, right: 0 }}
					onPress={() => navigation.openDrawer()}></Icon.Button>
			</View>

			<Text>Services for this category!</Text>

			<View style={{ flex: 1 }}>
				{list()}
				<View
					style={{
						flexDirection: 'column',
						flex: 1,
						borderColor: '#000',
						alignItems: 'stretch',
					}}>
					{subcategorylist()}
				</View>
			</View>

			{/* <Button
          title="Click Here"
          onPress={() => alert(subcategories.subcategoriesarray)}
        />
        <Button
          title="Go to home!"
          onPress={() => navigation.navigate("Home")}
        />
        <Button
          title="Go Back!"
          onPress={() => navigation.goBack()}
        /> */}
		</View>
	);
};

export default SupportScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
