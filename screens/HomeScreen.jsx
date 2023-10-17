import { ActivityIndicator, FlatList, Image, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import IconFont from 'react-native-vector-icons/FontAwesome.js'
import Icon from 'react-native-vector-icons/MaterialIcons.js'
import axios from 'axios'
import { weatherIcons } from '../WeatherIcon/WeatherIcons.js'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [show, setShow] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const storeCity = async (city) => {
    try {
      await useAsyncStorage('myCity').setItem(city);
    } catch (e) {
      console.log('store err', e);
    }
  };

  const getStore = async () => {
    try {
      const value = await useAsyncStorage('myCity').getItem();
      return value
    } catch (e) {
      console.log('err', e)
    }
  };



  async function getLocations(city) {
    if (city.length > 2) {
      let { data } = await axios.get(`https://api.weatherapi.com/v1/search.json?key=5e020d77e8a24b9e97c154735232002&q=${city}
    `);
      setLocations(data);
    }
  }

  async function getForecast(city) {
    setLoading(true);
    storeCity(city);
    let cityName = await getStore();
    if (cityName === 'null' || cityName === 'undefined') {
      city = 'dammam';
    } else {
      city = cityName;
    }

    let { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=5e020d77e8a24b9e97c154735232002&q=${city}&days=7`);
    setWeather(data);
    setForecast(data?.forecast?.forecastday);
    setLoading(false);
  }

  const { current, location } = weather;



  useEffect(() => {
    getForecast();
  }, []);






  return (
    <>
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss} onPress={() => setLocations([])}>
        <SafeAreaView className='flex-1 py-'>
          {loading ? <ActivityIndicator size={100} className='flex-1 justify-center' /> : <>
            <View className={`rounded-full ${show ? `bg-white/20` : `bg-transparent`} mt-10 mx-4 relative z-50`}>
              <View className='items-center justify-end flex-row'>
                {show ? <TextInput onChangeText={getLocations} className='pl-5 h-full flex-1 text-white' placeholder='Search City...' placeholderTextColor={'lightgray'} /> : null}
                <TouchableOpacity onPress={() => setShow(!show)} className='bg-white/30 rounded-full p-3 m-1'>
                  <IconFont color={'white'} name='search' size={25} />
                </TouchableOpacity>
              </View>
              {
                locations.length > 0 && show ? (
                  <View className='bg-gray-300 w-full rounded-3xl top-14 absolute'>
                    {locations?.map((location, index) => {
                      return <TouchableOpacity onPress={() => { setLocations([]); getForecast(location?.name); }} key={index} className={`p-3 px-4 ${index + 1 == locations.length ? 'border-none' : 'border-b-2 border-b-gray-400'} flex-row items-center`}>
                        <Icon color={'gray'} name='location-on' size={20} />
                        <Text className='pl-2 text-lg'>{location?.name}, {location?.country}</Text>
                      </TouchableOpacity>
                    })}
                  </View>
                ) : null
              }
            </View>

            <View className='mt-5 items-center '>
              <Text className='text-gray-300 text-lg font-bold'><Text className='text-white text-2xl'>{location?.name}, </Text> {location?.country}</Text>
            </View>



            <View className='items-center mt-7'>
              <Image className='h-40 w-40 ' source={weatherIcons[current?.condition?.text]} />
            </View>

            <View className='text-center items-center mt-7'>
              <Text className='text-white font-bold text-6xl ml-3'>{current?.temp_c}&#176;</Text>
              <Text className='text-white text-xl'>{current?.condition?.text}</Text>
            </View>


            <View className='px-7 mt-10 flex-row justify-between'>
              <View className='flex-row items-center space-x-1.5'>
                <Image className='w-7 h-7' source={require('../assets/wind.png')} />
                <Text className='text-white font-semibold text-base'>{current?.wind_kph}km</Text>
              </View>
              <View className='flex-row items-center space-x-1.5'>
                <Image className='w-7 h-7' source={require('../assets/drop.png')} />
                <Text className='text-white font-semibold text-base'>{current?.humidity}%</Text>
              </View>
              <View className='flex-row items-center space-x-1.5'>
                <Image className='w-7 h-7' source={require('../assets/sun.png')} />
                <Text className='text-white font-semibold text-base'>{current?.last_updated.split(' ')[1]}</Text>
              </View>
            </View>


            <View className='space-y-5 mt-10'>
              <View className=' pl-5 flex-row'>
                <IconFont color={'lightgray'} name='calendar' size={20} />
                <Text className='ml-2 text-white'>Daily forecast</Text>
              </View>

              <FlatList
                horizontal
                contentContainerStyle={{flexDirection:'row', justifyContent:'space-evenly', width:'100%'}}
                showsHorizontalScrollIndicator={false}
                data={forecast}
                renderItem={({ item }) => {
                  let date = new Date(item?.date);
                  let dayName = date.toLocaleDateString('en-Us', { weekday: 'long' });
                  dayName = dayName.split(',')[0];
                  return <>
                    <View className='rounded-3xl bg-white/20 px-2 py-3 justify-between items-center w-24'>
                      <Image className='w-11 h-11' source={weatherIcons[item?.day?.condition?.text]} />
                      <Text className='text-white text-sm'>{dayName}</Text>
                      <Text className='text-white font-semibold text-xl'>{item?.day?.avgtemp_c}&#176;</Text>
                    </View>
                  </>
                }}
                keyExtractor={item => item.date}
              />
            </View>



          </>}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  )
}
