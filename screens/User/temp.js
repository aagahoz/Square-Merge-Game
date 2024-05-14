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
    var value1 = grid[cell1.row][cell1.col];
    var value2 = grid[cell2.row][cell2.col];

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
    grid[maxCell.row][maxCell.col] = result;
    selectedCells.forEach((cell) => {
      grid[cell.row][cell.col] = null;
    });
    setSelectedCells([]);
    setOkeyButtonEnabled(false);
    setGrid([...grid]);

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
    backgroundColor: '#8f7a66', // Önceki stile benzetmek için seçili hücre rengini değiştirdik
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


export default App;


