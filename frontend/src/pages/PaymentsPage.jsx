import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiDollarSign, FiLink } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const res = await fetch("https://rizeos-backend-o22d.onrender.com/api/payments/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        setPayments(result.payments || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-8">
        💰 Payment History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment records found.</p>
      ) : (
        <div className="bg-white shadow border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-3">
            <div className="col-span-2">Job Title</div>
            <div className="col-span-1 text-center">Amount</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Date</div>
            <div className="col-span-1 text-center">Explorer</div>
          </div>

          {payments.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-6 items-center px-4 py-3 border-t text-sm hover:bg-gray-50 transition"
            >
              <div className="col-span-2">
                <Link
                  to={`/jobs/${p.job?._id}`}
                  className="text-blue-700 font-medium hover:underline"
                >
                  {p.job?.title || "Untitled"}
                </Link>
              </div>

              <div className="col-span-1 text-center flex justify-center items-center gap-1 text-green-700 font-semibold">
                <FiDollarSign /> {p.amount} ETH
              </div>

              <div className="col-span-1 text-center">
                {p.status === "success" ? (
                  <span className="flex justify-center text-green-600 font-medium">
                    <FaCheckCircle className="mr-1" /> Success
                  </span>
                ) : (
                  <span className="flex justify-center text-red-500 font-medium">
                    <FaTimesCircle className="mr-1" /> Failed
                  </span>
                )}
              </div>

              <div className="col-span-1 text-center text-gray-600">
                {new Date(p.createdAt).toLocaleString()}
              </div>

              <div className="col-span-1 text-center">
                <a
                  href={`https://etherscan.io/tx/${p.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex justify-center"
                >
                  <FiLink />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
