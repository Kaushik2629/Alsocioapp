import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	StatusBar,
	Image,
	SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({ navigation }) => {
	const { colors } = useTheme();

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='#1a237e' barStyle='light-content' />
			<Animatable.View style={styles.header} animation='fadeIn'>
				<Animatable.Image
					source={require('../assets/icon.png')}
					style={styles.logo}
					resizeMode='contain'
				/>
			</Animatable.View>
			<Animatable.View
				style={[
					styles.footer,
					{
						backgroundColor: colors.background,
					},
				]}
				animation='fadeIn'>
				<Text
					style={[
						styles.title,
						{
							color: colors.text,
						},
					]}>
					You are In Good Hands!
				</Text>
				<Text style={styles.text}>Get services at your finger tips!</Text>
				<View style={styles.button}>
					<TouchableOpacity onPress={() => navigation.navigate('Home')}>
						<LinearGradient
							colors={['#00227b', '#26418f']}
							style={styles.signIn}>
							<Text style={styles.textSign}>Let's Start!</Text>
							<MaterialIcons name='navigate-next' color='#fff' size={20} />
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	);
};

export default SplashScreen;

const { height } = Dimensions.get('screen');
const height_logo = height * 0.2;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1a237e',
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		flex: 0.8,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30,
	},
	logo: {
		width: height_logo * 2.2,
		height: height_logo,
	},
	title: {
		color: '#05375a',
		fontSize: 30,
		fontWeight: 'bold',
	},
	text: {
		color: 'grey',
		marginTop: 5,
	},
	button: {
		alignItems: 'flex-end',
		marginTop: 30,
	},
	signIn: {
		width: 150,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		flexDirection: 'row',
	},
	textSign: {
		color: 'white',
		fontWeight: 'bold',
	},
});
