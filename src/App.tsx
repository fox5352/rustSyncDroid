import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Rootlayout from "./pages/Rootlayout";
// -----
import Home from "./pages/home/Home";
import Sync from "./pages/sync/Sync";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rootlayout />}>
          <Route index element={<Home />} />
          <Route path="sync" element={<Sync />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
