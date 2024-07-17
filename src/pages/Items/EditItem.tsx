import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { IItem } from "../../../api/models/Item";
import {
  fetchItemByID,
  selectItems,
  updateItem,
} from "../../store/features/itemSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

const EditItemsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedItems = useAppSelector(selectItems);
  const [formData, setFormData] = useState<IItem | undefined>(undefined);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchItemByID(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (selectedItems) {
      setFormData({
        id: selectedItems[0]?.id,
        price: selectedItems[0]?.price,
        title: selectedItems[0]?.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData)
      dispatch(updateItem({ id: formData.id, item: formData })).then(() => {
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

        {/* Form to edit item */}
        {formData && (
          <div className="w-3/4 ml-4">
            <div className="bg-white p-4">
              <Breadcrumb
                paths={[{ name: "Items", url: "/items" }, { name: "Edit" }]}
              />
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="id"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    ID {formData?.id}
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData?.id}
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
                    type="text"
                    id="title"
                    name="title"
                    value={formData?.title}
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
                    type="text"
                    id="price"
                    name="price"
                    value={formData?.price}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditItemsPage;
