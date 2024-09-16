import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BingoBoard from './BingoBoard';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/bingo' element={<BingoBoard />} />
			</Routes>
		</Router>
	);
}

export default App;
