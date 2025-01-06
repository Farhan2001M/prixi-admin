
import React from 'react';

import {NextUIProvider} from "@nextui-org/system";
import { ToastContainer } from 'react-toastify';

import LoginPage from './login/page'

const MainPage: React.FC = () => {

  return (
    <NextUIProvider>
      <main>
        {/* Main Entry point of my Admin Web-App */}
        <LoginPage />
      </main>
      {/* ToastContainer for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </NextUIProvider>
  );
};

export default MainPage;
