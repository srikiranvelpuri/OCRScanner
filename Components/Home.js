import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  StatusBar,
  Button,
  Image,
  Text,
  View,
} from 'react-native'

import { launchImageLibrary } from 'react-native-image-picker'
import TextRecognition from 'react-native-text-recognition'

const Home = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [detectedText, setDetectedText] = useState([])
  const [imageUri, setImageUri] = useState(null)

  const uploadImage = () => {
    launchImageLibrary({}, setSelectedImage)
  }

  const getText = async uri => {
    const result = await TextRecognition.recognize(uri)
    return result
  }

  useEffect(() => {
    const didCancel = selectedImage?.didCancel
    if (selectedImage && !didCancel) {
      const { uri } = selectedImage?.assets?.[0]
      setImageUri(uri)
      getText(uri)
        .then(result => setDetectedText(result))
        .catch(err => console.log(err))
    }
  }, [selectedImage])

  useEffect(() => {
    if (imageUri) {
      getText(imageUri)
        .then(result => setDetectedText(result))
        .catch(err => console.log(err))
    }
  }, [imageUri])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OCR Scanner</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          alt="selectImage"
          source={{ uri: imageUri }}
        />
      </View>
      <ScrollView style={styles.textContainer}>
        {detectedText?.map(text => (
          <Text style={styles.text} key={Math.random() * 9999}>
            {text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Select Image" onPress={uploadImage} />
          </View>
          <View style={styles.button}>
            <Button
              title="Take Image"
              onPress={() => navigation.navigate('Camera', { setImageUri })}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header: {
    fontSize: 20,
    padding: 15,
  },
  textContainer: {
    width: 350,
    height: 200,
    borderWidth: 1,
    borderColor: 'black',
  },
  text: {
    fontSize: 15,
    padding: 15,
  },
  imageContainer: {
    width: 350,
    height: 250,
    borderWidth: 1,
    marginHorizontal: 3,
    borderColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 40,
  },
})

export default Home
