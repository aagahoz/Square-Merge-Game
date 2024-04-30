import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredUsers = users.filter(user => !user.isAdmin); 
  
        const updatedUsers = await Promise.all(filteredUsers.map(async user => {
          if (!user.hasOwnProperty('maxScore')) {
            const userRef = doc(firestore, 'Users', user.id);
            await updateDoc(userRef, { maxScore: 0 });
            return { ...user, maxScore: 0 };
          }
          return user;
        }));

        updatedUsers.sort((a, b) => b.maxScore - a.maxScore);
  
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
      <FlatList
        data={usersData}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.userContainer, index === 0 ? styles.highlightedUser : null]}>
            <Text style={styles.emailText}>Email: {item.email}</Text>
            <Text style={styles.scoreText}>Max Score: {item.maxScore}</Text>
            {index === 0 && <Text style={styles.highestScoreText}>🏆 Highest Score 🏆</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffebcd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', 
  },
  highlightedUser: {
    borderColor: '#3498db', 
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  scoreText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  highestScoreText: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Statistics;
