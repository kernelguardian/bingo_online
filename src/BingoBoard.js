import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

const BingoBoard = () => {
	const { id } = useParams(); // Access the dynamic parameter
	const [maxNumberRange, setMaxNumberRange] = useState(75);
	const [numberOfCells, setNumberOfCells] = useState(5);
	const [username, setUsername] = useState('');
	const [showModal, setShowModal] = useState(true); // Modal is shown when the page loads
	const [bingoNumbers, setBingoNumbers] = useState([]);
	const [clickedCells, setClickedCells] = useState([]);
	const [completedRows, setCompletedRows] = useState(0);
	const [completedColumns, setCompletedColumns] = useState(0);
	const [completedDiagonals, setCompletedDiagonals] = useState(0);

	// Check for username in cookies on component mount
	useEffect(() => {
		const storedUsername = Cookies.get('username'); // Get username from cookie
		if (storedUsername) {
			setUsername(storedUsername); // Set username if cookie exists
			setShowModal(false);
		} else {
			setShowModal(true); // Show modal if cookie doesn't exist
		}
	}, []);
	// Fetch configuration data from Redis on component mount
	useEffect(() => {
		const fetchData = async () => {
			const redisUrl = `${process.env.REACT_APP_KV_REST_API_URL}/get/${id}`;
			console.log('Fetching from:', redisUrl);

			try {
				const response = await fetch(redisUrl, {
					headers: {
						Authorization: `Bearer ${process.env.REACT_APP_KV_REST_API_TOKEN}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				console.log('Data:', data);
				const [maxRange, numCells] = data['result'].split('_');
				setMaxNumberRange(parseInt(maxRange, 10) || 50);
				setNumberOfCells(parseInt(numCells, 10) || 5);
			} catch (error) {
				console.error('Error fetching data:', error);
				setMaxNumberRange(50);
				setNumberOfCells(5);
			}
		};

		fetchData();
	}, [id]); // Fetch data when the component mounts or id changes

	// Generate bingo numbers based on the number of cells
	const generateBingoNumbers = useCallback(() => {
		let numbers = [];
		while (numbers.length < numberOfCells * numberOfCells) {
			let randNum = Math.floor(Math.random() * maxNumberRange) + 1;
			if (!numbers.includes(randNum)) {
				numbers.push(randNum);
			}
		}
		setBingoNumbers(numbers);
		setClickedCells(Array(numberOfCells * numberOfCells).fill(false));
	}, [maxNumberRange, numberOfCells]);

	useEffect(() => {
		generateBingoNumbers();
	}, [generateBingoNumbers]); // Regenerate bingo numbers when maxNumberRange or numberOfCells changes

	// Function to handle username submission
	const handleUsernameSubmit = (e) => {
		e.preventDefault();
		if (username.trim()) {
			Cookies.set('username', username); // Save username to cookie
			setShowModal(false);
		}
	};

	// Toggle the clicked state of the cell
	const handleCellClick = (index) => {
		const updatedClickedCells = [...clickedCells];
		updatedClickedCells[index] = !updatedClickedCells[index];
		setClickedCells(updatedClickedCells);
		checkCompletedLines(updatedClickedCells);
	};

	// Check completed lines
	const checkCompletedLines = (cells) => {
		let rowCount = 0;
		let colCount = 0;
		let diagCount1 = 0;
		let diagCount2 = 0;

		for (let row = 0; row < numberOfCells; row++) {
			let allRowSelected = true;
			let allColSelected = true;

			for (let col = 0; col < numberOfCells; col++) {
				if (!cells[row * numberOfCells + col]) {
					allRowSelected = false;
				}
				if (!cells[col * numberOfCells + row]) {
					allColSelected = false;
				}
			}

			if (allRowSelected) rowCount++;
			if (allColSelected) colCount++;
		}

		for (let i = 0; i < numberOfCells; i++) {
			if (cells[i * numberOfCells + i]) diagCount1++;
			if (cells[(numberOfCells - 1 - i) * numberOfCells + i]) diagCount2++;
		}

		setCompletedRows(rowCount);
		setCompletedColumns(colCount);
		setCompletedDiagonals(
			(diagCount1 === numberOfCells ? 1 : 0) +
				(diagCount2 === numberOfCells ? 1 : 0)
		);
	};

	// Function to start a new game
	const startNewGame = () => {
		window.location.reload();
	};

	// Generate headers for the Bingo board
	const getHeaders = () => {
		const headers = ['B', 'I', 'N', 'G', 'O'];
		while (headers.length < numberOfCells) {
			headers.push('O');
		}
		return headers;
	};

	const headers = getHeaders();

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center relative'>
			{/* Username Modal */}
			{showModal && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg z-50'>
						<h2 className='text-xl font-bold mb-4 text-center'>
							Enter your username
						</h2>
						<form
							onSubmit={handleUsernameSubmit}
							className='flex flex-col items-center'
						>
							<input
								type='text'
								placeholder='Your name'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='border border-gray-300 rounded-lg p-2 w-64 mb-4'
							/>
							<button
								type='submit'
								className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Bingo Game */}
			<div className='bg-white shadow-md rounded-lg p-8 relative'>
				{/* Player Name at the Top Left of the Card */}
				{username && (
					<h2 className='absolute top-4 left-8 text-lg font-semibold text-gray-800'>
						{username}
					</h2>
				)}

				{/* Conditional New Game Button */}
				{completedDiagonals + completedRows + completedColumns ===
					numberOfCells && (
					<div>
						<h2 className='absolute top-4 right-8 text-lg font-semibold text-gray-800'>
							WINNER!!!!!
						</h2>
					</div>
				)}

				<h1 className='text-2xl font-bold mb-6 text-center'>Bingo Board</h1>

				{/* Bingo Header */}
				<div
					className={`grid grid-cols-${numberOfCells} gap-4 mb-4`}
					style={{
						gridTemplateColumns: `repeat(${numberOfCells}, minmax(0, 1fr))`,
					}}
				>
					{headers.map((header, index) => (
						<div
							key={index}
							className={`flex items-center justify-center h-16 w-16  text-gray-800 text-4xl border font-bold  border-gray-400 rounded-md ${
								index < completedDiagonals + completedRows + completedColumns
									? 'line-through [text-decoration-color:orange] bg-green-500 shadow-lg shadow-green-500/50 text-white'
									: ''
							}`}
						>
							{header}
						</div>
					))}
				</div>

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
								clickedCells[index] ? 'bg-yellow-300 line-through' : ''
							}`}
						>
							{number}
						</div>
					))}
				</div>

				<div className='flex justify-center pt-5'>
					{/* Conditional New Game Button */}
					{completedDiagonals + completedRows + completedColumns ===
						numberOfCells && (
						<button
							onClick={startNewGame}
							className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
						>
							New Game
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default BingoBoard;
