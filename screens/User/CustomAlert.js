import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const CustomAlert = ({ displayTitle, displayMsg, visibility, dismissAlert, score }) => {
  const [maxScore, setMaxScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userEmail = getUserEmail();
    fetchMaxScore(userEmail);
  }, [score]); // useEffect, score değiştiğinde tekrar çalışacak

  useEffect(() => {
    if (score > maxScore) {
      setMessage(`Tebrikler, yeni bir rekor kırdınız! Eski skorunuz: ${maxScore}`);
    } else {
      setMessage(`Üzgünüz, en yüksek skorunuzu geçemediniz. En yüksek skorunuz: ${maxScore}`);
    }
  }, [score, maxScore]); // useEffect, score veya maxScore değiştiğinde tekrar çalışacak

  const fetchMaxScore = async (email) => {
    try {
      const firestore = getFirestore();
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const userMaxScore = userData.maxScore || 0;
        setMaxScore(userMaxScore);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error getting max score from Firestore:', error);
    }
  };

  const getUserEmail = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserEmail = currentUser.email;
    return currentUserEmail;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibility}
      onRequestClose={() => dismissAlert(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.message}>{displayMsg}</Text>
          <Text style={styles.score}>Skor: {score}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            onPress={() => dismissAlert(false)}
            style={styles.okButton}
          >
            <Text style={styles.okButtonText}>Tamam</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#faf8ef',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8f7a66',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  score: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  okButton: {
    backgroundColor: '#8f7a66',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
