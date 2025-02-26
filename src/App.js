// import RecitationContainer from "./component/RecitationContainer";
import RecitationContainer from "./component/RecitationContainer";
import { RecitationProvider } from "./context/RecitationProvider";

function App() {
  return (
    <RecitationProvider>
      <RecitationContainer />
    </RecitationProvider>
  );
}

export default App;
