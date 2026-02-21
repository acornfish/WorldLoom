import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar';
import ArticlesPage from './pages/Articles';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="global.css" />
      <link rel="stylesheet" href="/libs/fontAwsome/css/all.min.css" />

      <BrowserRouter>
      <Navbar></Navbar>
        <Routes>
          <Route Component={ArticlesPage} path='/'></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
