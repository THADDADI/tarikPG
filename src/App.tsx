import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { ReactNode, useEffect } from "react";
import useNetworkStatus from "./hooks/networkStatus";
import { Bounce, ToastContainer, toast } from "react-toastify";
import NoInternet from "./assets/no-internet.jpg";

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [items, setItems] = useState([]);

  const { isOnline } = useNetworkStatus();

  const getBannerNetworkStatus = (): ReactNode => {
    return (
      <>
        <ToastContainer />
      </>
    );
  };

  useEffect(() => {
    if (isOnline) {
      toast("You're online", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        type: "success",
        transition: Bounce,
      });
    } else {
      toast("You're disconnected", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        type: "error",
        transition: Bounce,
      });
    }
    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // const fetchData = async () => {
  //   try {
  //     const itemsResponse = await fetch("/api/Items");

  //     if (!itemsResponse.ok) {
  //       throw new Error("Failed to fetch data");
  //     }

  //     const itemsData = await itemsResponse.json();

  //     setItems(itemsData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto flex bg-white min-h-screen p-2">
        <div className="w-1/4 border-r-2 border-gray-100">
          <Navbar />
        </div>

        <div className="w-3/4 ml-4">
          {getBannerNetworkStatus()}
          {!isOnline && <img src={NoInternet} alt="no internet" />}
          <div className="bg-white p-4">
            <Breadcrumb paths={[{ name: "Overview" }]} />

            <div className="mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
