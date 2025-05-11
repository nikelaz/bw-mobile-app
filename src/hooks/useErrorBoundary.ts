import { Alert } from 'react-native';

const useErrorBoundary = () => {
  return (error: any) => {
    if (error.message) {
      
      if (error.message.at(0) === '[') {
        const errorObj = JSON.parse(error.message);
        Alert.alert(errorObj[0].message);
        console.log(errorObj[0].message);
        return;
      }

      Alert.alert(error.message);
      console.log(error.message);
      return;
    }

    Alert.alert(error.toString());
    console.log(error.toString());
  };
}

export default useErrorBoundary;
