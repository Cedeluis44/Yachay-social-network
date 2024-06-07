import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../navigation/AuthProvider';
import { useIsFocused } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchImages();
    }
  }, [isFocused]);

  const fetchImages = async () => {
    const storage = getStorage();
    const listRef = ref(storage, `images/`);

    try {
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
      setImages(urls);
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  const openImage = (url) => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  const deleteImage = async () => {
    const storage = getStorage();
    const imageRef = ref(storage, selectedImage);

    try {
      await deleteObject(imageRef);
      Alert.alert('Deleted!', 'Your image has been deleted from Firebase Cloud Storage!');
      setImages(images.filter(image => image !== selectedImage));
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting image: ', error);
      Alert.alert('Error', 'There was an error deleting the image.');
    }
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => openImage(item)}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImage}
        numColumns={3}
        contentContainerStyle={styles.imageList}
      />
      <View style={styles.logoutButtonContainer}>
        <Button
          title="Log Out"
          onPress={() => {
            logout();
          }}
          color="#d9534f"
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <Button title="Delete" onPress={deleteImage} color="#d9534f" />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
  },
  imageList: {
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  logoutButtonContainer: {
    position: 'center',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
