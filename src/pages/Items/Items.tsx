import { ReactElement, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { deleteItem, fetchItems } from "../../store/features/itemSlice";
import { useAppDispatch, useAppSelector } from "../../store";

const Items = (): ReactElement => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleDelete = async (itemId: string) => {
    dispatch(deleteItem(itemId));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto flex bg-white min-h-screen p-2">
        <div className="w-1/4 border-r-2 border-gray-100">
          <Navbar />
        </div>

        <div className="w-3/4 ml-4">
          <div className="bg-white p-4">
            <Breadcrumb paths={[{ name: "Items" }]} />
            <div>
              {items.map((item) => (
                <div key={item.id} className="border-b py-2">
                  <div className="flex justify-between">
                    <div className="text-lg font-semibold">
                      #{item.id} - {item.title}
                    </div>
                    <div className="text-gray-600">${item.price}</div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to={`/items/edit/${item.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to={`/items/create`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Item
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
