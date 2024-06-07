import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage imports
import { useAuth } from "../navigation/AuthProvider"; // Ensure this is the correct path to your AuthProvider

const AddPostScreen = () => {
  const { user } = useAuth(); // Access the authenticated user
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add a unique ID to the filename
    const uniqueID = `${user.uid}-${Date.now()}`;
    filename = `${uniqueID}-${filename}`;

    setUploading(true);
    setTransferred(0);

    try {
      const response = await fetch(uploadUri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          setTransferred(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        }, 
        (error) => {
          console.error(error);
          setUploading(false);
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            Alert.alert(
              'Image uploaded!',
              'Your image has been uploaded to Firebase Cloud Storage!'
            );
            setUploading(false);
            setImage(null);
          });
        }
      );

    } catch (e) {
      console.log(e);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>What's on your mind?</Text>
      <Button
        title="Choose Photo"
        onPress={pickImage}
      />
      <Button
        title="Take Photo"
        onPress={takePhoto}
      />
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <Button
            title="Submit"
            onPress={submitPost}
            disabled={uploading}
          />
        </>
      )}
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
});
