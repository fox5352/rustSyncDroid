import {
  BrowserRouter,
  Route,
} from "react-router-dom";
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello World</h1>} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
