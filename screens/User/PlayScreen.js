import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const PlayPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeBoard();
    setIsLoading(false);
  }, []);

  const initializeBoard = () => {
    const initialBoard = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
    addRandomNumber(initialBoard);
    addRandomNumber(initialBoard);
    setBoard(initialBoard);
    setScore(0);
  };

  const addRandomNumber = (board) => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: cellIndex });
        }
      });
    });
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

 const moveUp = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
  
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (newBoard[row][col] !== 0) {
          let currentRow = row;
          while (currentRow > 0 && newBoard[currentRow - 1][col] === 0) {
            newBoard[currentRow - 1][col] = newBoard[currentRow][col];
            newBoard[currentRow][col] = 0;
            currentRow--;
            moved = true;
          }
          if (currentRow > 0 && newBoard[currentRow - 1][col] === newBoard[currentRow][col]) {
            newBoard[currentRow - 1][col] *= 2;
            newBoard[currentRow][col] = 0;
            setScore(prevScore => prevScore + newBoard[currentRow - 1][col]);
            moved = true;
          }
        }
      }
    }
  
    if (moved) {
      addRandomNumber(newBoard);
      setBoard(newBoard);
    }
  };
  
  const moveDown = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
  
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (newBoard[row][col] !== 0) {
          let currentRow = row;
          while (currentRow < 3 && newBoard[currentRow + 1][col] === 0) {
            newBoard[currentRow + 1][col] = newBoard[currentRow][col];
            newBoard[currentRow][col] = 0;
            currentRow++;
            moved = true;
          }
          if (currentRow < 3 && newBoard[currentRow + 1][col] === newBoard[currentRow][col]) {
            newBoard[currentRow + 1][col] *= 2;
            newBoard[currentRow][col] = 0;
            setScore(prevScore => prevScore + newBoard[currentRow + 1][col]);
            moved = true;
          }
        }
      }
    }
  
    if (moved) {
      addRandomNumber(newBoard);
      setBoard(newBoard);
    }
  };
  
  const moveRight = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
  
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        if (newBoard[row][col] !== 0) {
          let currentCol = col;
          while (currentCol < 3 && newBoard[row][currentCol + 1] === 0) {
            newBoard[row][currentCol + 1] = newBoard[row][currentCol];
            newBoard[row][currentCol] = 0;
            currentCol++;
            moved = true;
          }
          if (currentCol < 3 && newBoard[row][currentCol + 1] === newBoard[row][currentCol]) {
            newBoard[row][currentCol + 1] *= 2;
            newBoard[row][currentCol] = 0;
            setScore(prevScore => prevScore + newBoard[row][currentCol + 1]);
            moved = true;
          }
        }
      }
    }
  
    if (moved) {
      addRandomNumber(newBoard);
      setBoard(newBoard);
    }
  };
  
  const moveLeft = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
  
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        if (newBoard[row][col] !== 0) {
          let currentCol = col;
          while (currentCol > 0 && newBoard[row][currentCol - 1] === 0) {
            newBoard[row][currentCol - 1] = newBoard[row][currentCol];
            newBoard[row][currentCol] = 0;
            currentCol--;
            moved = true;
          }
          if (currentCol > 0 && newBoard[row][currentCol - 1] === newBoard[row][currentCol]) {
            newBoard[row][currentCol - 1] *= 2;
            newBoard[row][currentCol] = 0;
            setScore(prevScore => prevScore + newBoard[row][currentCol - 1]);
            moved = true;
          }
        }
      }
    }
  
    if (moved) {
      addRandomNumber(newBoard);
      setBoard(newBoard);
    }
  };


  const renderCell = (value) => {
    if (value !== 0) {
      return <Text style={styles.cellText}>{value}</Text>;
    }
    return null;
  };

  const restartGame = () => {
    setIsLoading(true);
    initializeBoard();

    setIsLoading(false);
  };

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
      <TouchableOpacity style={styles.resetButton} onPress={restartGame}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <TouchableOpacity key={cellIndex} style={styles.cell}>
                {renderCell(cell)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={moveUp}>
          <Text style={styles.buttonText}>Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveDown}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveRight}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveLeft}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  board: {
    borderWidth: 5,
    borderColor: '#bbada0',
    borderRadius: 10,
    padding: 5,
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
    marginTop: 20,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#8f7a66',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayPage;