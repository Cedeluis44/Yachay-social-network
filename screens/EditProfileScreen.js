import React from 'react';
import { View, Text} from 'react-native';

const EditProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Edit Profile Screen</Text>
        </View>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
