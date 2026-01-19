import { FaArrowLeft } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const OrderStatement = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/Orders");
  };
  return (
    <div className="flex w-full flex-col">
      <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">
        <div className="mb-6 flex items-center gap-3 font-medium text-center text-lg">
          <button
            className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center hover:bg-slate-100"
            type="button"
            onClick={handleGoBack}
          >
            <FaArrowLeft className="items-center" />
          </button>
          <div className="text-violet-600">Order / Order Details</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-6 border border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold">Order #46746</h1>
            <p className="text-sm text-green-600 m-1">Ready for ship</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-100 flex items-center gap-2 rounded-lg shadow-md border border-gray-300 hover:bg-slate-50 font-semibold">
              <FaFileExport /> Export
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600">
              Create shipping label
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {/* Top Section */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Customer & Order */}
            <div>
              <div className="border rounded-lg p-4 flex shadow-md border-gray-200 justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-3">Customer & Order</h2>
                  <div>
                    <p className="mb-1">Name: Ana Nancy</p>
                    <p className="mb-1">Email: example536@gmail.com</p>
                    <p className="mb-1">Phone: +8801683597934</p>
                    <p className="mb-1">PO: 793647432424824</p>
                    <p className="mb-1">Payment terms: Net 30</p>
                    <p>Delivery method: Embarcadero north</p>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-100 rounded-lg shadow-md border border-gray-300 hover:bg-slate-50 font-semibold">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="border flex rounded-lg p-4 shadow-md border-gray-200 justify-between">
                <div className="flex-col">
                  <h2 className="text-lg font-bold mb-3">Shipping Address</h2>
                  <div>
                    <p>
                      Michael Smith, 534 Fry drive, Washington, GA 33023, United
                      States.
                    </p>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-200 rounded-lg shadow-md border border-gray-300 hover:bg-slate-50 font-semibold">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <div className="border flex rounded-lg p-4 shadow-md border-gray-200 justify-between">
                <div className="flex-col">
                  <h2 className="text-lg font-bold mb-3">Billing Address</h2>
                  <div>
                    <p>Michael, 52464 Royal Ln, Mesa, New Jersey, 45643 drive Washington, United States.</p>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-200 rounded-lg shadow-md border border-gray-300 hover:bg-slate-50 font-semibold">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Items Ordered</h2>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-xl shadow-md border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">ITEMS NAME</th>
                    <th className="py-2 px-4 text-left">ITEMS ID</th>
                    <th className="py-2 px-4 text-left">LOCATION</th>
                    <th className="py-2 px-4 text-left">QUANTITY</th>
                    <th className="py-2 px-4 text-left">PRICE</th>
                    <th className="py-2 px-4 text-left">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-4 flex gap-1 items-center">
                      <img
                        src="https://cdn.loveandlemons.com/wp-content/uploads/2023/07/margherita-pizza-recipe.jpg"
                        className="w-6 h-6 rounded-lg"
                      />
                      <div>Margherita Pizza</div>
                    </td>
                    <td className="py-4 px-4">647FGDH7</td>
                    <td className="py-4 px-4">Shop 34 floor CA, US</td>
                    <td className="py-4 px-4">6</td>
                    <td className="py-4 px-4">₹1889.99</td>
                    <td className="py-4 px-4">₹1889.99</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 flex gap-1 items-center">
                      <img
                        src="https://www.sargento.com/assets/Uploads/Recipe/Image/GreatAmericanBurger__FillWzgwMCw4MDBd.jpg"
                        className="w-6 h-6 rounded-lg"
                      />
                      <div>Cheeseburger</div>
                    </td>
                    <td className="py-4 px-4">183GD983</td>
                    <td className="py-4 px-4">Shop 34 floor CA, US</td>
                    <td className="py-4 px-4">2</td>
                    <td className="py-4 px-4">₹320.50</td>
                    <td className="py-4 px-4">₹320.50</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-gray-700">Subtotal</td>
                    <td className="py-4 px-4">₹2210.49</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Free Shipping</td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-gray-700">
                      Shipping Handing
                    </td>
                    <td className="py-4 px-4">₹0.00</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Total</td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-gray-700">Tax Ammount</td>
                    <td className="py-4 px-4">10%</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Currency : INR</td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 font-bold">Total</td>
                    <td className="py-4 px-4 font-bold text-lg">₹2259.49</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoices */}
          <div>
            <h2 className="text-lg font-bold mb-2">Invoices</h2>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg">
                <thead className="">
                  <tr className="bg-gray-100">
                    <th className="py-4 px-4 text-left">NO</th>
                    <th className="py-4 px-4 text-left">AMOUNT</th>
                    <th className="py-4 px-4 text-left">CUSTOMERS</th>
                    <th className="py-4 px-4 text-left">STATUS</th>
                    <th className="py-4 px-4 text-left">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-4">3563788</td>
                    <td className="py-4 px-4">₹2389.63</td>
                    <td className="py-4 px-4">John Smith</td>
                    <td className="py-4 px-4">14</td>
                    <td className="py-4 px-4">21 Feb 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button className="px-6 py-2 bg-gray-200 rounded-lg shadow-md border border-gray-300 hover:bg-slate-50 font-semibold">
              Cancel
            </button>
            <button className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600">
              Ship Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatement;
