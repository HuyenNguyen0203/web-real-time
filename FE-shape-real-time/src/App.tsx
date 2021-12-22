import React, { FC, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import VideoCall from './components/VideoCall';
import socket from './utils/socket';

const App: FC = () => {
  useEffect(() => {
    socket.connect();
  }, []);

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<VideoCall socket={socket} />} />
      
    </Routes>
  </BrowserRouter>;
};

export default App;