import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Scores = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredUsers = users.filter(user => !user.isAdmin); // Filter users where isAdmin is false
  
        // Check if MaxScore field exists for each user, if not, create it with a value of 0
        const updatedUsers = await Promise.all(filteredUsers.map(async user => {
          if (!user.hasOwnProperty('maxScore')) {
            const userRef = doc(firestore, 'Users', user.id);
            await updateDoc(userRef, { maxScore: 0 });
            return { ...user, maxScore: 0 };
          }
          return user;
        }));
  
        setUsersData(updatedUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {usersData.map(user => (
        <View key={user.id} style={styles.userContainer}>
          <Text>Email: {user.email}</Text>
          <Text>Max Score: {user.maxScore}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    marginBottom: 10,
  },
});

export default Scores;
