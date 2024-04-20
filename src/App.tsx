import "./App.css";
import { Data } from "./components/Data";
import UpdateUserComponent from "./components/updateUserData";

function App() {
  return (
    <div className="App">
      <>
        <UpdateUserComponent />
        <Data />
      </>
    </div>
  );
}

export default App;
