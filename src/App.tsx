import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemsResponse = await fetch("/api/Items");

      if (!itemsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const itemsData = await itemsResponse.json();

      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto flex bg-white min-h-screen p-2">
        <div className="w-1/4 border-r-2 border-gray-100">
          <Navbar />
        </div>

        <div className="w-3/4 ml-4">
          <div className="bg-white p-4">
            <Breadcrumb paths={[{ name: "Overview" }]} />

            <div className="mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
