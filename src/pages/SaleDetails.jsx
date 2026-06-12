import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useParams, useNavigate } from "react-router";
import { SALE } from "../graphql/sales";
import { DarkContext } from "../hooks/DarkContext";
import Header from "../components/Header";
import { useContext } from "react";
import html2pdf from "html2pdf.js";

const formatDate = (date) => {
  if (!date) return "";
  return date.slice(0, 10).split("-").reverse().join("-");
};

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useContext(DarkContext);
  const [sale, setSale] = useState(null);

  const { data, loading } = useQuery(SALE, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.sale) setSale(data.sale);
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const handlePrint = () => {
    if (!sale) return;

    const productRows = (sale.products || [])
      .map(
        (p, i) =>
          `<tr>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${i + 1}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${p.product?.name || ""}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${p.count}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${p.price.toLocaleString()}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${(p.count * p.price).toLocaleString()}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center">${((p.price - p.buyPrice) * p.count).toLocaleString()}</td>
          </tr>`,
      )
      .join("");

    const element = document.createElement("div");
    element.innerHTML = `
      <div style="
        font-family: Tahoma, Vazir, Arial, sans-serif;
        direction: rtl;
        text-align: right;
        padding: 30px 40px;
        color: #000;
        font-size: 14px;
        line-height: 2;
      ">
        <div style="text-align:center; margin-bottom:30px; border-bottom: 2px solid #1e40af; padding-bottom:20px;">
          <h1 style="font-size:24px; font-weight:bold; color:#1e40af; margin:0;">مصالح فروشی برادران هاشمی</h1>
          <p style="color:#666; margin:5px 0 0 0;">فاکتور فروش</p>
        </div>

        <div style="
          background:#f8fafc;
          border:1px solid #e2e8f0;
          border-radius:8px;
          padding:20px 25px;
          margin-bottom:20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        ">
          <p style="margin:4px 0;"><b style="color:#1e40af;">شماره فاکتور:</b> ${sale.code || ""}</p>
          <p style="margin:4px 0;"><b style="color:#1e40af;">مشتری:</b> ${sale.customer?.fullName || ""}</p>
          <p style="margin:4px 0;"><b style="color:#1e40af;">تاریخ:</b> ${formatDate(sale.createdAt)}</p>
          <p style="margin:4px 0;"><b style="color:#1e40af;">الباقی:</b> ${(sale.remainingBalance ?? 0).toLocaleString()}</p>
          ${sale.description ? `<p style="margin:4px 0;grid-column:span 2;"><b style="color:#1e40af;">توضیحات:</b> ${sale.description}</p>` : ""}
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <thead>
            <tr style="background:#1e40af;color:#fff;">
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">ردیف</th>
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">نام محصول</th>
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">تعداد</th>
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">قیمت واحد</th>
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">مجموع</th>
              <th style="border:1px solid #1e40af;padding:10px;text-align:center;">فایده</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
          <tfoot>
            <tr style="background:#f1f5f9;font-weight:bold;">
              <td colspan="4" style="border:1px solid #ddd;padding:10px;text-align:center;">مجموع کل</td>
              <td style="border:1px solid #ddd;padding:10px;text-align:center;">${(sale.totalAmount || 0).toLocaleString()}</td>
              <td style="border:1px solid #ddd;padding:10px;text-align:center;">${(sale.income || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">
          <p>سیستم مدیریت فروش - مصالح فروشی برادران هاشمی</p>
        </div>
      </div>
    `;

    document.body.appendChild(element);

    html2pdf()
      .set({
        margin: 0.5,
        filename: `sale-invoice-${sale.code || "print"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  };

  if (loading && !sale) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-xl text-gray-500">در حال بارگذاری...</p>
        </div>
      </>
    );
  }

  if (!sale) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-xl text-red-500">فاکتور فروش یافت نشد</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-4 sm:p-8 max-w-5xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/sales")}
            className="px-5 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition"
          >
            ← بازگشت
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            پرینت فاکتور
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-l from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">فاکتور فروش</h1>
                <p className="text-blue-100 mt-1">مصالح فروشی برادران هاشمی</p>
              </div>
              <div className="text-left">
                <p className="text-3xl font-bold">#{sale.code}</p>
                <p className="text-blue-100 text-sm">{formatDate(sale.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">مشتری</p>
                <p className="text-lg font-bold mt-1">{sale.customer?.fullName}</p>
              </div>
              <div className="bg-green-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">مجموع فاکتور</p>
                <p className="text-lg font-bold mt-1 text-green-600">{sale.totalAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-amber-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">فایده</p>
                <p className="text-lg font-bold mt-1 text-amber-600">{sale.income?.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">الباقی</p>
                <p className="text-lg font-bold mt-1 text-purple-600">{(sale.remainingBalance ?? 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 sm:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">توضیحات</p>
                <p className="text-base mt-1">{sale.description || "بدون توضیحات"}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              محصولات
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">ردیف</th>
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">نام محصول</th>
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">تعداد</th>
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">قیمت واحد</th>
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">قیمت خرید</th>
                    <th className="border-l border-gray-200 dark:border-slate-600 py-3 px-4 text-center">مجموع</th>
                    <th className="py-3 px-4 text-center">فایده</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.products?.map((item, index) => (
                    <tr key={index} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center">{index + 1}</td>
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center font-medium">{item.product?.name}</td>
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center">{item.count}</td>
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center">{item.price.toLocaleString()}</td>
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center">{item.buyPrice.toLocaleString()}</td>
                      <td className="border-l border-gray-100 dark:border-slate-700 py-3 px-4 text-center font-semibold">{(item.count * item.price).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-green-600 font-semibold">{((item.price - item.buyPrice) * item.count).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-slate-700 font-bold text-gray-800 dark:text-gray-100">
                    <td colSpan={5} className="border-t border-gray-200 dark:border-slate-600 py-3 px-4 text-center">مجموع کل</td>
                    <td className="border-t border-gray-200 dark:border-slate-600 py-3 px-4 text-center text-blue-600">{sale.totalAmount?.toLocaleString()}</td>
                    <td className="border-t border-gray-200 dark:border-slate-600 py-3 px-4 text-center text-green-600">{sale.income?.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
