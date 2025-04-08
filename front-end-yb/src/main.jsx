import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";


export default App;

import "./index.css";
import ErrorPage from "./pages/404";
import DashboardPage from "./pages/dashboard";
import GalleryPage from "./pages/gallery";
import MainPage from "./pages/main";
import Aurora from "./pages/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

const router = createBrowserRouter([
  {
    path: "/main",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <MainPage />,
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
