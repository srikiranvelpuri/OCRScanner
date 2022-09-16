import React from 'react'
import { StyleSheet, Button, View, Text } from 'react-native'

import RNFS from 'react-native-fs'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'

const Camera = ({ route, navigation }) => {
  const [{ cameraRef }, { takePicture }] = useCamera(null)
  const { setImageUri } = route.params

  const captureHandler = async () => {
    try {
      const data = await takePicture()
      const newUri = `file://${RNFS.TemporaryDirectoryPath}/${Date.now()}.jpg`
      RNFS.moveFile(data.uri, newUri)
      setImageUri(newUri)
    } catch (err) {
      console.log(err)
    } finally {
      navigation.navigate('Home')
    }
  }
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}>
        <View style={styles.button}>
          <Button title="Capture" onPress={() => captureHandler()} />
        </View>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 40,
  },
})

export default Camera
