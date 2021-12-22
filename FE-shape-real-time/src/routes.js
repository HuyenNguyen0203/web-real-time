/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import VideoCall from "./components/VideoCall";
import { Shape } from './components/Shape';

export const routes = [
    {
        key: 'app.shape',
        path: '/shape',
        exact: true,
        main: <Shape />
    },
    {
        key: 'app.home',
        path: '/',
        name: "Home",
        exact: true,
        main: <VideoCall />
    }
];