import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Karekok from './Karekok.js';

const initialGridSize = 4;

const generateRandomNumber = () => {
  const possibleNumbers = [2, 4, 8];
  return possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
};

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [okeyButtonEnabled, setOkeyButtonEnabled] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: initialGridSize }, () =>
      Array.from({ length: initialGridSize }, () => generateRandomNumber())
    );
    setGrid(newGrid);
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

  const handleOkeyPress = () => {
    const [cell1, cell2] = selectedCells;
    var value1 = grid[cell1.row][cell1.col];
    var value2 = grid[cell2.row][cell2.col];

    console.log("\n")
    console.log("value 1 : " + value1)
    console.log("value 2 : " + value2)

    value1 = isSquaredNumberReturnPowOfTwo(value1)
    value2 = isSquaredNumberReturnPowOfTwo(value2)

    console.log("IsSquereDenSonra Value 1 : " + value1)
    console.log("IsSquereDenSonra Value 2 : " + value2)

    result = calculateSquareRoot(value1 * value2)
    result = calculateSquareRoot(result)

    console.log("Result : " + result)

    const maxCellIndex = result > Math.sqrt(value1) ? 1 : 0;
    const [maxCell] = selectedCells.splice(maxCellIndex, 1);
    grid[maxCell.row][maxCell.col] = result;
    selectedCells.forEach((cell) => {
      grid[cell.row][cell.col] = null;
    });
    setSelectedCells([]);
    setOkeyButtonEnabled(false);
    setGrid([...grid]);


    const karekok1 = Karekok()
  };
 

  function isSquaredNumberReturnPowOfTwo(value) {
    const arananKarakter = "√";

    const stringValue = String(value);

    if (stringValue.includes(arananKarakter))
    {
      console.log(`${stringValue} içinde ${arananKarakter} karakteri bulunuyor.`);
      const index = stringValue.indexOf(arananKarakter);
      const kisim = stringValue.substring(0, index);
      console.log("Kısım : " + kisim)
      const integerSayi = parseInt(kisim);
      value = integerSayi * integerSayi * 2;
    }
    else
    {
      value = value * value
    }
    return value
  }

  function calculateSquareRoot(value) {

    console.log("CalculateSquareRoot value is : " + value)

    var exponent = Math.log2(value);
    console.log("exponent : " + exponent)

    if (exponent % 2 === 1)
    {
      console.log("Sonuc Köklü")
      exponent = exponent - 1 // köke ayrıldı
      exponent = exponent / 2 // karekoke alındı
      result = Math.pow(2, exponent)
      return `${result}√2`
    }
    else
    {
      console.log("Sonuç Köksüz")
      exponent = exponent / 2
      result = Math.pow(2, exponent)
      return `${result}`
    }
  } 

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

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  grid: {
    borderWidth: 2,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: 'lightgreen',
  },
  cellText: {
    fontSize: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default App;
