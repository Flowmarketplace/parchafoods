import { BrowserRouter, Routes, Route } from "react-router-dom";

function TestPage() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎉 ¡React funciona!</h1>
      <p>La aplicación está cargando correctamente</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
