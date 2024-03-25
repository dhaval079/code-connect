import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './Pages/Home';
import EditorPage from './Pages/EditorPage';
import { Toaster } from 'react-hot-toast';
// App.jsx
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
import PreLoader from './components/Preloader';
import Layout from './Layout';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.14.0/cdn/');

function App() {
  return (
   <>
     <div>
      <Toaster position='top-center' toastOptions={{success :{
        theme :{
          primary:'#4aed88',  
        },
      },
      }}>
      </Toaster>
      </div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}></Route>
        <Route path='/editor/:id' element={<EditorPage/>}></Route>
      </Routes>
      </BrowserRouter>
   </>
  );
}

export default App;
