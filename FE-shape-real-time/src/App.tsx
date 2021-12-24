import React, { FC, lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import socket from './utils/socket';

const VideoCall = lazy(() => import('./components/VideoCall'));
const Shape = lazy(() => import('./components/Shape'));

const App: FC = () => {
  return <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
          <Route path="/" element={<VideoCall socket={socket} />} />
          <Route
            path="/shape"
            element={<Shape socket={socket} />}
          />
        </Routes>
    </Suspense>
  </BrowserRouter>;
};

export default App;