import * as React from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
 
import PickerModal from 'react-native-picker-modal-view';
 
import data from '../../../top20.json';
 
export default class Main extends React.Component {
 
    constructor(props) {
        super(props);
 
        this.state = {
            selectedItem: {}
        };
    }
 
    render(){
        const { selectedItem } = this.state;
 
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
                <PickerModal
                    renderSelectView={(disabled, selected, showModal) =>
                        <Button disabled={disabled} title={'Show me!'} onPress={showModal} />
                    }
                    onSelected={this.onSelected.bind(this)}
                    onClosed={this.onClosed.bind(this)}
                    onBackButtonPressed={this.onBackButtonPressed.bind(this)}
                    items={data}
                    sortingLanguage={'tr'}
                    showToTopButton={true}
                    selected={selectedItem}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={true}
                    selectPlaceholderText={'Choose one...'}
                    onEndReached={() => console.log('list ended...')}
                    searchPlaceholderText={'Search...'}
                    requireSelection={false}
                    autoSort={false}
                />
                <View style={{ padding: 10, alignItems: 'center', backgroundColor: '#ddd' }}>
                    <Text>Chosen: </Text>
                    <Text>{JSON.stringify(selectedItem)}</Text>
                </View>
            </SafeAreaView>
        );
    }
 
   onClosed(){
        console.log('close key pressed');
    }
 
   onSelected(selected){
        this.setState({ selectedItem: selected });
 
        return selected;
    }
 
   onBackButtonPressed(){
        console.log('back key pressed');
    }
}
 