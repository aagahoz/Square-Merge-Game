import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

export default function SignUpPage({ navigation, setIsSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const signUp = async () => {
    try {
      setLoading(true);

      if (email !== '' && password !== '' && confirmPassword !== '') {
        if (await checkEmailExists(email)) {
          setErrorMessage('Email Already Exists');
        } else {
          if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                setIsSignedIn(true);
                setErrorMessage('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                const auth = getAuth();
                const user = auth.currentUser;
                addUser(user.uid, email, isAdmin = false, isActive = true, maxScore = 0);
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          } else {
            setErrorMessage('Passwords do not match');
          }
        }
      } else {
        setErrorMessage('Please enter an email, password, and confirm password');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'Users');
      const querySnapshot = await getDocs(usersCollection);

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        if (userData.email === email) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  const addUser = async (userId, email, isAdmin = false, isActive = true, maxScore =  0) => {
    try {
      const firestore = getFirestore();
      const userRef = doc(firestore, 'Users', userId);

      const newUser = {
        email,
        isAdmin,
        isActive,
        maxScore,
      };

      await setDoc(userRef, newUser);

      return userId;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={60}
      style={styles.container}
    >
      <AntDesign name="adduser" size={44} color="black" />
      <TextInput
        ref={emailInputRef}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#BEBEBE"
        value={email}
        onChangeText={setEmail}
        marginTop={20}
        onFocus={() => emailInputRef.current.setNativeProps({ style: { borderColor: '#007BFF' } })}
        onBlur={() => emailInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } })}
      />
      <TextInput
        ref={passwordInputRef}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#BEBEBE"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => passwordInputRef.current.setNativeProps({ style: { borderColor: '#007BFF' } })}
        onBlur={() => passwordInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } })}
      />
      <TextInput
        ref={confirmPasswordInputRef}
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#BEBEBE"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onFocus={() => confirmPasswordInputRef.current.setNativeProps({ style: { borderColor: '#007BFF' } })}
        onBlur={() => confirmPasswordInputRef.current.setNativeProps({ style: { borderColor: '#ccc' } })}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={signUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    padding: 20,
  },
  input: {
    width: '80%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  linkText: {
    color: '#776e65',
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: '#8f7a66',
    padding: 10,
    borderRadius: 5,
  },
  signUpButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#e74c3c', // Önceki renk: tomato
    marginTop: 15,
    fontSize: 14,
  },
});
