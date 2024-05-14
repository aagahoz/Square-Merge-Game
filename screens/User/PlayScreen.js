import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import CustomAlert from './CustomAlert';
import Karekok from './Karekok.js';


const initialGridSize = 4;

const generateRandomNumber = () => {
  const possibleNumbers = [2, 4, 8];
  return possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
};


const PlayPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [okeyButtonEnabled, setOkeyButtonEnabled] = useState(false);
  
  useEffect(() => {
    const loadGameFromStorage = async () => {
      try
      {
        const savedBoard = await AsyncStorage.getItem('game_board');
        const savedScore = await AsyncStorage.getItem('game_score');
        setMaxScore(await getMaxScore(getUserEmail()));

        if (savedBoard && savedScore)
        {
          setBoard(JSON.parse(savedBoard));
          setScore(parseInt(savedScore, 10));
          console.log('Game data loaded successfully.');
        } else
        {
          initializeBoard();
        }
      } catch (error)
      {
        console.error('Error loading game data:', error);
        initializeBoard();
      }
    };

    loadGameFromStorage();
    setIsLoading(false);

  }, []);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const initializeBoard = () => {
    const newGrid = Array.from({ length: initialGridSize }, () =>
      Array.from({ length: initialGridSize }, () => generateRandomNumber())
    );
    setBoard(newGrid);
    
  };

  const saveGameToStorage = async () => {
    try
    {
      await AsyncStorage.setItem('game_board', JSON.stringify(board));
      await AsyncStorage.setItem('game_score', score.toString());
      console.log('Game data saved successfully.');
    } catch (error)
    {
      console.error('Error saving game data:', error);
    }
  };

  const getUserEmail = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserEmail = currentUser.email;
    return currentUserEmail;
  }

  const updateMaxScoreInFirestore = async (email, newMaxScore) => {
    try
    {
      const firestore = getFirestore();

      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));

      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty)
      {
        const userId = userSnapshot.docs[0].id;

        const userDataUpdate = { maxScore: newMaxScore };

        await updateDoc(doc(firestore, 'Users', userId), userDataUpdate);

        console.log('Max score updated successfully in Firestore');
      } else
      {
        console.log('User not found');
      }
    } catch (error)
    {
      console.error('Error updating max score in Firestore:', error);
    }
  };

  const getMaxScore = async (email) => {
    try
    {
      const firestore = getFirestore();
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty)
      {
        const userData = userSnapshot.docs[0].data();
        return userData.maxScore || 0;
      } else
      {
        console.log('User not found');
        return 0;
      }
    } catch (error)
    {
      console.error('Error getting max score from Firestore:', error);
      return 0;
    }
  };

  const addRandomNumber = (board) => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0)
        {
          emptyCells.push({ row: rowIndex, col: cellIndex });
        }
      });
    });
    if (emptyCells.length > 0)
    {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const isGameOver = (board) => {
    for (let row = 0; row < 4; row++)
    {
      for (let col = 0; col < 4; col++)
      {
        if (board[row][col] === 0)
        {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++)
    {
      for (let col = 0; col < 4; col++)
      {
        if (col < 3 && board[row][col] === board[row][col + 1])
        {
          return false;
        }
        if (row < 3 && board[row][col] === board[row + 1][col])
        {
          return false;
        }
      }
    }

    return true;
  };

  const renderCell = (cell, rowIndex, colIndex) => {
    const isSelected =
      selectedCells.find((selectedCell) => selectedCell.row === rowIndex && selectedCell.col === colIndex) !==
      undefined;
    const cellStyle = isSelected ? [styles.cell, styles.selectedCell] : styles.cell;
    return (
      <TouchableOpacity
        key={`${rowIndex}-${colIndex}`}
        style={cellStyle}
        onPress={() => handleCellPress(rowIndex, colIndex)}
      >
        <Text style={styles.cellText}>{cell !== null ? cell : ''}</Text>
      </TouchableOpacity>
    );
  };

  const restartGame = async () => {
    await setPopupVisible(true)
    setIsLoading(true);
    try
    {
      await AsyncStorage.removeItem('game_board');
      await AsyncStorage.removeItem('game_score');
      console.log('Saved game data removed successfully.');
    } catch (error)
    {
      console.error('Error removing saved game data:', error);
    }
    let NEW_MAX_SCORE = score;
    console.log("Skor : " + NEW_MAX_SCORE);
    const userEmail = getUserEmail();
    try
    {
      const firestore = getFirestore();
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', userEmail));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty)
      {
        const userId = userSnapshot.docs[0].id;
        const userData = userSnapshot.docs[0].data();
        const oldMaxScore = userData.maxScore || 0;

        if (NEW_MAX_SCORE > oldMaxScore)
        {
          console.log("new score : " + NEW_MAX_SCORE + " -- " + "old max score : " + oldMaxScore)
          await updateMaxScoreInFirestore(userEmail, NEW_MAX_SCORE);
          console.log('Max score updated successfully in Firestore');
        }
      }
    } catch (error)
    {
      console.error('Error updating max score in Firestore:', error);
    }
    initializeBoard();
    setIsLoading(false);
  };

  const handleCellPress = (rowIndex, colIndex) => {
    const cellIndex = selectedCells.findIndex((cell) => cell.row === rowIndex && cell.col === colIndex);
    if (cellIndex !== -1)
    {
      const updatedSelectedCells = [...selectedCells];
      updatedSelectedCells.splice(cellIndex, 1);
      setSelectedCells(updatedSelectedCells);
      if (updatedSelectedCells.length !== 2)
      {
        setOkeyButtonEnabled(false);
      }
      return;
    }

    if (selectedCells.length === 2) return;
    const cell = { row: rowIndex, col: colIndex };
    setSelectedCells([...selectedCells, cell]);
    if (selectedCells.length === 1)
    {
      setOkeyButtonEnabled(true);
    }
  };

  function carpimHesapla(karekok1, karekok2) {
    // Her iki karekök nesnesinin reel kısımlarını çarp
    const reelCarpim = karekok1.reelKisim * karekok2.reelKisim;

    // Her iki karekök nesnesinin köklü kısımlarını çarp
    const kokluCarpim = karekok1.kokluKisim * karekok2.kokluKisim;

    // Her iki karekök nesnesinin derecelerini topla
    const dereceToplam = karekok1.derece + karekok2.derece;

    // Yeni bir karekök nesnesi oluştur ve çarpımı bu nesneyle temsil et
    const carpim = new Karekok()
    carpim.reelKisim = reelCarpim
    carpim.kokluKisim = kokluCarpim
    carpim.derece = dereceToplam


    return carpim;
}

  const handleOkeyPress = () => {
    const [cell1, cell2] = selectedCells;
    var value1 = board[cell1.row][cell1.col];
    var value2 = board[cell2.row][cell2.col];

    console.log("\n")
    console.log("value 1 : " + value1)
    console.log("value 2 : " + value2)
 

    const karekok1 = new Karekok(value1);
    const karekok2 = new Karekok(value2);

    console.log()
    karekok1.sayiyiYazdir()

    console.log()

    karekok2.sayiyiYazdir()

    result = carpimHesapla(karekok1, karekok2).sayiyiYazdir()
    console.log("Result : " + result)

    const maxCellIndex = result > Math.sqrt(value1) ? 1 : 0;
    const [maxCell] = selectedCells.splice(maxCellIndex, 1);
    board[maxCell.row][maxCell.col] = result;
    selectedCells.forEach((cell) => {
      board[cell.row][cell.col] = null;
    });
    setSelectedCells([]);
    setOkeyButtonEnabled(false);
    setBoard([...board]);

  };

  if (isLoading)
  {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.maxScoreContainer}>
        <Text style={styles.maxScoreText}> Max Score > {maxScore}</Text>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={restartGame}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: okeyButtonEnabled ? 'green' : 'gray' }]}
        onPress={handleOkeyPress}
        disabled={!okeyButtonEnabled}
      >
        <Text style={styles.buttonText}>Tamam</Text>
      </TouchableOpacity>
      <CustomAlert
        visibility={isPopupVisible}
        dismissAlert={togglePopup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#faf8ef',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#8f7a66',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginBottom: 5,
    marginTop: 50,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8f7a66'
  },
  board: {
    borderWidth: 5,
    borderColor: '#bbada0',
    borderRadius: 10,
    padding: 0,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#cdc1b4',
    borderRadius: 5,
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#776e65',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  maxScoreContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#cdc1b4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  maxScoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',

  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8ef', // Önceki stile benzetmek için arka plan rengini değiştirdik
  },
  grid: {
    borderWidth: 5, // Önceki stile benzetmek için çizgi kalınlığını değiştirdik
    borderColor: '#bbada0', // Önceki stile benzetmek için çizgi rengini değiştirdik
    borderRadius: 10,
    padding: 0,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: '#cdc1b4', // Önceki stile benzetmek için hücre arka plan rengini değiştirdik
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedCell: {
    backgroundColor: 'lightgreen', // Önceki stile benzetmek için seçili hücre rengini değiştirdik
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#776e65',
  },
  button: {
    marginTop: 10, // Önceki stile benzetmek için düğme aralığını değiştirdik
    backgroundColor: '#8f7a66',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16, // Önceki stile benzetmek için metin boyutunu değiştirdik
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PlayPage;
