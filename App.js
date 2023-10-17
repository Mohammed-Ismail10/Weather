import { StatusBar } from 'expo-status-bar';
import { ImageBackground } from 'react-native';
import HomeScreen from './screens/HomeScreen.jsx';

export default function App() {
  return (<>
        <ImageBackground blurRadius={70} className='flex-1' source={require('./assets/images/bg.png')}>
          <HomeScreen />
        </ImageBackground>
        <StatusBar style="light" />
  </>
  );
}






