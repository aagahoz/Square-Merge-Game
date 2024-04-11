import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const makeAdmin = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isAdmin: true });
      updateLocalUser(userId, { isAdmin: true });
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const makeUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isAdmin: false });
      updateLocalUser(userId, { isAdmin: false });
    } catch (error) {
      console.error('Error making user a regular user:', error);
    }
  };

  const activateUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isActive: true });
      updateLocalUser(userId, { isActive: true });
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const disableUser = async (userId) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { isActive: false });
      updateLocalUser(userId, { isActive: false });
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const updateLocalUser = (userId, newData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, ...newData } : user))
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTitle}>ID:</Text>
        <Text style={styles.userInfoText}>{item.id}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTitle}>Email:</Text>
        <Text style={styles.userInfoText}>{item.email}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTitle}>Status:</Text>
        <Text style={[styles.userInfoText, item.isActive ? styles.activeText : styles.inactiveText]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoTitle}>Role:</Text>
        <Text style={[styles.userInfoText, item.isAdmin ? styles.adminText : styles.userText]}>
          {item.isAdmin ? 'Admin' : 'User'}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.blueButton]} onPress={() => makeAdmin(item.id)}>
          <Text>Make Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.yellowButton]} onPress={() => makeUser(item.id)}>
          <Text>Make User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.greenButton]} onPress={() => activateUser(item.id)}>
          <Text>Activate User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.redButton]} onPress={() => disableUser(item.id)}>
          <Text>Disable User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.userList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db', 
    textAlign: 'center', 
    textTransform: 'uppercase', 
  },
  userList: {
    width: '100%',
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  actionsContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    marginVertical: 4, 
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#2ecc71',
  },
  redButton: {
    backgroundColor: '#e74c3c',
  },
  blueButton: {
    backgroundColor: '#3498db',
  },
  yellowButton: {
    backgroundColor: '#f39c12',
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoTitle: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: '#555',
  },
  activeText: {
    color: '#2ecc71', 
  },
  inactiveText: {
    color: '#e74c3c', 
  },
  adminText: {
    color: '#3498db', 
  },
  userText: {
    color: '#f39c12', 
  },

});


export default UsersPage;