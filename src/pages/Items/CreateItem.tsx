import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { addItem } from "../../store/features/itemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";

const CreateItemsPage = () => {
  const [formData, setFormData] = useState({ id: "", title: "", price: "" });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addItem(JSON.stringify(formData))).then(() => {
      navigate("/items");
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto flex bg-white min-h-screen p-2">
        {/* Sidebar */}
        <div className="w-1/4 border-r-2 border-gray-100">
          <Navbar />
        </div>

        {/* Form to create new item */}
        <div className="w-3/4 ml-4">
          <div className="bg-white p-4">
            <Breadcrumb
              paths={[{ name: "Items", url: "/items" }, { name: "Create" }]}
            />
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="id"
                  className="block text-gray-700 font-bold mb-2"
                >
                  ID
                </label>
                <input
                  placeholder="101"
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Title
                </label>
                <input
                  placeholder="Marvelous Mug"
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Price
                </label>
                <input
                  placeholder="10.99"
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItemsPage;
