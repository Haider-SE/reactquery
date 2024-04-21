import "./App.css";
import { Data } from "./components/Data";
import AddUserComponent from "./components/addUserData";

function App() {
  return (
    <div className="App">
      <>
        <AddUserComponent />
        <Data />
      </>
    </div>
  );
}

export default App;
