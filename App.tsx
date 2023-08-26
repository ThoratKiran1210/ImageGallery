import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

interface ImageInfo {
  uri: string;
  id: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  const handleImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const newImage: ImageInfo = {
          uri: response.assets[0].uri,
          id: String(new Date().getTime()),
        };
        setImages([...images, newImage]);
      }
    });
  };

  const handleImageDelete = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
  };

  const openImageModal = (item: ImageInfo) => {
    setSelectedImage(item);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderImageItem = ({ item }: { item: ImageInfo }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => openImageModal(item)}>
      <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
      <View style={styles.removeButton}>
        <Button title="Remove" onPress={() => handleImageDelete(item.id)} color="red" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('')} // Specify the path to your background image
      style={styles.container} 
    >
      <Text style={styles.title}>Image Gallery</Text>
      <Button title="Pick Image" onPress={handleImagePicker} />
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
      <Modal visible={selectedImage !== null} onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage?.uri }} style={styles.modalImage} />
          <Button title="Close" onPress={closeImageModal} />
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Arial',
  },
  imageContainer: {
    padding: 5,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
  },
  removeButton: {
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default ImageGallery;


