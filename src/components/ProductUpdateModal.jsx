import { useMutation } from "@apollo/client/react/compiled";
import { X } from "lucide-react";
import { useState } from "react";
import { UPDATE_PRODUCT } from "../graphql/product";

export default function ProductUpdateModal({
  setUpdateProductsModal,
  product,
  refetch,
}) {
  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT);
  const [loginError, setLoginError] = useState();

  async function handelSubmit(e) {
    e.preventDefault();

    const name = e.target.name.value;
    const price = Number(e.target.price.value);
    const inStockCount = Number(e.target.inStockCount.value);
    const description = e.target.description.value;

    try {
      const { data } = await updateProduct({
        variables: {
          input: {
            productId: product._id,
            name,
            price,
            description,
            inStockCount,
          },
        },
      });
      setUpdateProductsModal({});
      refetch();
    } catch (error) {
      setLoginError(error.message);

      setTimeout(() => {
        setLoginError("");
      }, 3000);
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setUpdateProductsModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setUpdateProductsModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form action="" onSubmit={handelSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                نام جنس
              </h2>
              <input
                type="text"
                placeholder=".نام جنس را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="name"
                defaultValue={product.name}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                قیمت جنس
              </h2>
              <input
                type="tel"
                placeholder=".قیمت را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="price"
                defaultValue={product.price}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                تعداد جنس
              </h2>
              <input
                type="text"
                placeholder=".تعداد جنس را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="inStockCount"
                defaultValue={product.inStockCount}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-black text-lg text-right">
                توضیحات
              </h2>
              <input
                type="text"
                placeholder=". توضیحات را وارد کنید"
                className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
                name="description"
                defaultValue={product.description}
              />
            </div>

            <span
              className={`text-red-600 text-center transition-all duration-300 ${
                loginError ? "opacity-100" : "opacity-0"
              }`}
            >
              {loginError}
            </span>

            <input
              type="submit"
              value={loading ? "...در حال ثبت" : "ثبت"}
              disabled={loading}
              className="bg-blue-400 text-white w-full h-12 text-lg font-medium rounded hover:bg-blue-500 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
