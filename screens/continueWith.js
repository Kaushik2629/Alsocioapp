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
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const continueWith = ({ navigation }) => {
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
						backgroundColor: '#fff',
					},
				]}
				animation='fadeInUpBig'>
				<Text style={styles.text}>Join as!</Text>
				<View style={styles.button}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('customerSignUpScreen')
						}}
						activeOpacity={0.8}
						style={styles.signIn}>
						<Text
							style={[
								styles.textSign,
								{
									color: '#fff',
								},
							]}>
							Customer
						</Text>
						<MaterialIcons
							name='navigate-next'
							color='#fff'
							size={25}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('ProviderSignUpForm')
						}}
						activeOpacity={0.8}
						style={styles.signIn}>
						<Text
							style={[
								styles.textSign,
								{
									color: '#fff',
								},
							]}>
							Provider
						</Text>
						<MaterialIcons
							name='navigate-next'
							color='#fff'
							size={25}
						/>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	);
};
export default continueWith;

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
		flex: 1,
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
		fontSize: 20,
		textAlign: 'center',
	},
	button: {
		alignItems: 'flex-end',
		marginTop: 30,
	},
	// signIn: {
	// 	width: 150,
	// 	height: 40,
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	borderRadius: 50,
		
	// },
	textSign: {
		color: 'white',
		fontWeight: 'bold',
		flexGrow:1,
		textAlign:'center',
		fontSize:18,
		marginLeft:20
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		borderColor: '#26418f',
		borderWidth: 0.5,
		marginTop: 15,
		backgroundColor: '#1a237e',
		flexDirection: 'row',
	},
});
