import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { Octicons } from '@expo/vector-icons';

export default function SignInPage({ navigation, setIsSignedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const SignIn = async () => {
    if (email !== '' && password !== '') {
      try {
        setIsLoading(true);
        // user tablosunda aktif pasif kontrolü
        const isActive = await checkUserIsActive(email);
        if (isActive == false) {
          setErrorMessage('Disabled User');
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;

          const firestore = getFirestore();
          const userDocRef = doc(firestore, 'Users', userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && 'isAdmin' in userData) {
              console.log('isAdmin:', userData.isAdmin);
              setIsSignedIn(true);
              setIsAdmin(userData.isAdmin === true);
            } else {
              console.log('User document does not have isAdmin field');
              setIsSignedIn(true);
              setIsAdmin(false);
            }
          } else {
            console.log('User document not found');
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Please enter an email and password');
    }
  };

  const checkUserIsActive = async (email) => {
    try {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'Users');
      const querySnapshot = await getDocs(usersCollection);

      // Kullanıcıların içinde gezin
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        if (userData.email === email) {
          return userData.isActive;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking user isActive:', error);
      return false;
    }
  };

  useEffect(() => {
    setIsLoading(false);
    return () => setIsLoading(false);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={60}
      style={styles.container}
    >
      <Octicons name="sign-in" size={44} color="black" />

      <TextInput
        ref={emailInputRef}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        marginTop={20}
        onFocus={() => emailInputRef.current.setNativeProps({ style: { borderColor: '#007BFF' } })}
        onBlur={() => emailInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } })}
      />

      <TextInput
        ref={passwordInputRef}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        marginTop={20}
        onFocus={() => passwordInputRef.current.setNativeProps({ style: { borderColor: '#007BFF' } })}
        onBlur={() => passwordInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } })}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.linkText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={SignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8ef', // Önceki renk: #f7f7f7
  },
  errorMessage: {
    color: '#e74c3c', // Önceki renk: red
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd', // Önceki renk: borderColor: '#ddd'
  },
  linkText: {
    color: '#776e65',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#8f7a66',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
