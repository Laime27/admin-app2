import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "@/routes/route"; 
import { Toaster } from "@/components/ui/toaster";

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
