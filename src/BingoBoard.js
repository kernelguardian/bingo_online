import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BingoBoard() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);

	const maxNumberRange = parseInt(params.get('maxNumberRange')) || 75;
	const numberOfCells = parseInt(params.get('numberOfCells')) || 5;

	// Generate unique bingo numbers only once when the component is first rendered
	const generateBingoNumbers = () => {
		let numbers = [];
		while (numbers.length < numberOfCells * numberOfCells) {
			let randNum = Math.floor(Math.random() * maxNumberRange) + 1;
			if (!numbers.includes(randNum)) {
				numbers.push(randNum);
			}
		}
		return numbers;
	};

	const [bingoNumbers] = useState(generateBingoNumbers); // Bingo numbers remain fixed
	const [clickedCells, setClickedCells] = useState(
		Array(numberOfCells * numberOfCells).fill(false)
	);

	// Toggle the clicked state of the cell
	const handleCellClick = (index) => {
		const updatedClickedCells = [...clickedCells];
		updatedClickedCells[index] = !updatedClickedCells[index];
		setClickedCells(updatedClickedCells);
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='bg-white shadow-md rounded-lg p-8'>
				<h1 className='text-2xl font-bold mb-6 text-center'>Bingo Board</h1>
				<div
					className={`grid grid-cols-${numberOfCells} gap-4`}
					style={{
						gridTemplateColumns: `repeat(${numberOfCells}, minmax(0, 1fr))`,
					}}
				>
					{bingoNumbers.map((number, index) => (
						<div
							key={index}
							onClick={() => handleCellClick(index)}
							className={`flex items-center justify-center h-16 w-16 bg-indigo-200 text-indigo-800 font-semibold text-xl border border-gray-300 rounded-md shadow cursor-pointer transition-transform transform ${
								clickedCells[index] ? 'bg-red-300 line-through' : ''
							}`}
						>
							{number}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default BingoBoard;
