import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import{ Picker }from'@react-native-community/picker';
import { map } from 'jquery';


const ExploreScreen = ({navigation,route}) => {

  //const controller=new AbortController();

  const [data, setData] = React.useState({
    servicecategories:[],
  });
 
// alert(route.params.category_name);

  const getcategory=()=>{}
  const category=route.params.category_name;
  let usercategory = new FormData();
  usercategory.append('main_category',category);
  
  fetch('https://alsocio.geop.tech/app/get-categories/',{
                      method:'POST',
                      body: usercategory,
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    setData({
                      ...data,
                      servicecategories:responseJson.categories,                   
                     });
                     const response=responseJson.categories
                     console.log(response); 
                     console.log(data.servicecategories);
                  })
                  .catch((error) => console.error(error))
                  .finally(() => {
                  });

                  const [selectedValues, setSelectedValue] = React.useState({
                    selectedValue:'',
                  });

                  const list = () => { 
                    const pickeritem = () => {
                      return data.servicecategories.map(element => {
                        return (
                          <Picker.Item label={element} value={element} />
                        );
                      });
                    };
                   
                  return(
                    <Picker
                      selectedValue={selectedValues.selectedValue}
                      style={{height:20,width: 150 ,borderRadius:10}}
                      onValueChange={(itemValue) => sublist(itemValue)}
                    >
                      {pickeritem()}
                    </Picker>
                    
                  )
              };


              const [subcategories, setSubcategory] = React.useState({
                subcategoriesarray:[],
              });

              const sublist=(itemValue)=>{
                setSelectedValue({
                  selectedValue:itemValue,
                })
                const value=selectedValues.selectedValue;

                let subcategory = new FormData();
                subcategory.append('main_category',category)
                subcategory.append('category',itemValue);
                fetch('https://alsocio.geop.tech/app/get-sub-categories/',{
                      method:'POST',
                      body: subcategory,
                  })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    setSubcategory({
                      ...subcategories,
                      subcategoriesarray:responseJson.sub_categories,                   
                     });
                     alert(responseJson.sub_categories);
                     console.log(subcategories.subcategoriesarray); 
                  })
                  .catch((error) => console.error(error))
                  .finally(()=>{
                  });

              }
              const subcategorylist=()=>{
                return subcategories.subcategoriesarray.map(element => {
                  return (
                  <View style={{flex:1}}><Text>{element}</Text></View>
                  );
                });
              }

                  
    return (
      <View style={styles.container}>
        <Text>{data.servicecategories}</Text>
        <Text>{subcategories.subcategoriesarray}</Text>
        <Text>ExploreScreen</Text>

        <View style={{flex:1}}>
            {list()}
        </View>
        <View style={{flexDirection:'column',flex:1}}>
            {subcategorylist()}
        </View>
        
        <Button
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
        />
      </View>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
