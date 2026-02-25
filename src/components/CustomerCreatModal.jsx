import { X } from "lucide-react";
export default function CustomerCreatModal({ setCreatCustomersModal }) {
  function handleSubmit(e) {
    e.preventDefault();
    const fullName = e.target.fullName.value;
    const phoneNumber = e.target.phoneNumber.value;

    let variables = { fullName, phoneNumber };

    console.log(variables);
    setCreatCustomersModal({});
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      <div
        onClick={() => setCreatCustomersModal({})}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white rounded flex flex-col gap-4 shadow-md w-full max-w-md py-8 px-6 sm:px-8">
        <button
          onClick={() => setCreatCustomersModal({})}
          className="absolute top-2 left-2 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              نام و تخلص مشتری
            </h2>
            <input
              type="text"
              placeholder=".نام و تخلص مشتری را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="fullName"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-black text-lg text-right">
              شماره تماس
            </h2>
            <input
              type="tel"
              placeholder=".شماره تماس را وارد کنید"
              className="w-full py-3 text-gray-900 border-2 border-gray-300 text-right px-2 rounded"
              name="phoneNumber"
            />
          </div>

          <input
            type="submit"
            value="ثبت"
            className="bg-blue-400 text-white w-full h-12 text-lg font-medium rounded hover:bg-blue-500 duration-300 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
