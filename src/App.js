// import RecitationContainer from "./component/RecitationContainer";
import RecitationContainer from "./component/RecitationContainer";
import { RecitationProvider } from "./context/RecitationProvider";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import BecomeDev from './component/BecomeDev';

function App() {
  return (
    <RecitationProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecitationContainer />} />
        <Route path="/dev" element={<BecomeDev />} />
      </Routes>
      </BrowserRouter>
    </RecitationProvider>
  );
}

export default App;
