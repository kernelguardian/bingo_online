import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BingoBoard from './BingoBoard';
import ReactGA from 'react-ga4';

function App() {
	ReactGA.initialize('G-WBTCC0H7T7');
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/bingo/:id' element={<BingoBoard />} />
			</Routes>
		</Router>
	);
}

export default App;
