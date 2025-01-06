
import React from 'react';

import {NextUIProvider} from "@nextui-org/system";
import LoginPage from './login/page'

const MainPage: React.FC = () => {

  return (
    <NextUIProvider>
      <main>
        <LoginPage />
      </main>
    </NextUIProvider>
  );
};

export default MainPage;
