import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import { Octicons } from '@expo/vector-icons';

export default function SettingsPage({ setIsSignedIn }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const onFocusInput = (inputRef) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: '#007BFF' },
    });
  };

  const onBlurInput = (inputRef) => {
    inputRef.current?.setNativeProps({
      style: { borderColor: '#ddd' },
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      setSuccessMessage('');
      setIsLoading(true);

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      if (currentPassword === newPassword) {
        setError('New password must be different from the current password.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('New password and confirmation password do not match.');
        return;
      }

      await updatePassword(user, newPassword);
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password Change Error:', error.message);
      setError('Password change failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Octicons name="sign-in" size={35} color="black" justifyContent="center" />
        <Text style={styles.buttonText}></Text>
      </TouchableOpacity>

      <View style={styles.changePasswordContainer}>
        <Text style={styles.subtitle}>Change Password:</Text>
        <TextInput
          ref={currentPasswordRef}
          style={[styles.input, { borderColor: currentPasswordRef.current?.isFocused() ? '#007BFF' : '#ddd' }]}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={(text) => setCurrentPassword(text)}
          onFocus={() => onFocusInput(currentPasswordRef)}
          onBlur={() => onBlurInput(currentPasswordRef)}
        />
        <TextInput
          ref={newPasswordRef}
          style={[styles.input, { borderColor: newPasswordRef.current?.isFocused() ? '#007BFF' : '#ddd' }]}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeTexst={(text) => setNewPassword(text)}
          onFocus={() => onFocusInput(newPasswordRef)}
          onBlur={() => onBlurInput(newPasswordRef)}
        />
        <TextInput
          ref={confirmPasswordRef}
          style={[styles.input, { borderColor: confirmPasswordRef.current?.isFocused() ? '#007BFF' : '#ddd' }]}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          onFocus={() => onFocusInput(confirmPasswordRef)}
          onBlur={() => onBlurInput(confirmPasswordRef)}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8ef', // Önceki renk: #faf8ef
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#000', // Önceki renk: #000
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#8f7a66', // Önceki renk: #8f7a66
    padding: 12,
    borderRadius: 20,
    position: 'absolute',
    top: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePasswordContainer: {
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#776e65', // Önceki renk: #333
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    color: '#776e65', // Önceki renk: #333
  },
  button: {
    backgroundColor: '#8f7a66', // Önceki renk: #8f7a66
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c', // Önceki renk: #e74c3c
    textAlign: 'center',
    marginTop: 10,
  },
  successText: {
    color: '#2ecc71', // Önceki renk: #2ecc71
    textAlign: 'center',
    marginTop: 10,
  },
});
