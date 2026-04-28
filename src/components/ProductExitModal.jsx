import { useNavigate } from "react-router";

export default function ProductExitModal({ setExitProductsModal }) {
  const navigate = useNavigate();
  function handleLogout() {
    setExitProductsModal(false);
    navigate("/");
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={() => setExitProductsModal(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative bg-white w-[90%] sm:w-96 p-6 flex flex-col justify-center items-center gap-6 rounded shadow-lg">
        <p className="font-medium text-black text-center px-4">
          آیا مطمئن هستید که می‌خواهید خارج شوید؟
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setExitProductsModal(false)}
            className="px-8 py-3 cursor-pointer bg-gray-500 hover:bg-gray-600 transition duration-300 rounded text-white"
          >
            خیر
          </button>

          <button
            onClick={handleLogout}
            className="px-8 py-3 cursor-pointer bg-red-400 hover:bg-red-500 transition duration-300 rounded text-white"
          >
            بله
          </button>
        </div>
      </div>
    </div>
  );
}
