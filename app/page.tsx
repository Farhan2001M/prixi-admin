
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





















// export default function Home() {
//   return (
//     <div>
//       <p>Hello World..!</p>

//       <h1 className="text-6xl">Chceking font </h1>
//     </div>
//   );
// }
