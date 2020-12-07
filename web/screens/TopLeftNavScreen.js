import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Feather';



const TopLeftNavScreen = () => {
	const [selectedRegion, setSelectedRegion] = useState('Chiriqui Provincia');
	const [selectedCity, setSelectedCity] = useState('Alanje');
	return (
		<View style={styles.container}>
			<Picker
				selectedValue={selectedRegion}
				style={{ height: 20, width: 90, borderRadius: 5 }}
				onValueChange={(itemValue, itemIndex) => setSelectedRegion(itemValue)}>
				<Picker.Item label='Chiriqui Provincia' value='Chiriqui Provincia' />
				<Picker.Item label='JavaScript' value='js' />
			</Picker>
			<Picker
				selectedValue={selectedCity}
				style={{ height: 20, width: 90, borderRadius: 5 }}
				onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}>
				<Picker.Item label='Alanje' value='Alanje' />
				<Picker.Item label='JavaScript' value='js' />
			</Picker>
		</View>
	);

	//   const [data, setData] = React.useState({
	//     country: 'uk'
	// });
};

export default TopLeftNavScreen;

const styles = StyleSheet.create({
	container: {
		top: 0,
		flex: 1,
		height: 5,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
	},
	rightside: {
		top: 0,
		flex: 1,
		height: 5,
		paddingRight: 10,
	},
});
