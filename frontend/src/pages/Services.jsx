import { useEffect } from "react";

export default function Services() {
  
  const token = localStorage.getItem("token"); // JWT token

  // ----------------------------------
  // 1️⃣ Load Razorpay script
  // ----------------------------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay Loaded:", window.Razorpay);
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  
  // ----------------------------------
  // 2️⃣ Dummy booking_id for testing
  // ----------------------------------
  const selectedBookingId = "1234abcd";  // dummy booking for exam demo


  // ----------------------------------
  // 3️⃣ Create Razorpay Order
  // ----------------------------------
  const createOrder = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/payments/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: selectedBookingId,
          provider: "razorpay",
        }),
      });

      const data = await res.json();
      console.log("Order received:", data);

      if (data?.order && data?.key_id) {
        openRazorpay(data);
      } else {
        alert("Could not create Razorpay order");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };


  // ----------------------------------
  // 4️⃣ Open Razorpay popup
  // ----------------------------------
  const openRazorpay = (data) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded!");
      return;
    }

    const options = {
      key: data.key_id,
      amount: data.amount * 100,
      currency: data.currency,
      name: "Har Ghar Pooja",
      description: "Pooja Payment",
      order_id: data.order.id,

      handler: async function (response) {
        console.log("Payment response:", response);

        // Verify payment
        const verifyRes = await fetch("http://localhost:8000/api/payments/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();
        console.log("Verification:", verifyData);

        if (verifyData.status === "success") {
          alert("Payment Successful");
        } else {
          alert("Verification Failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <button onClick={createOrder} style={{ padding: "10px 20px", background: "green", color: "#fff" }}>
      Pay Now
    </button>
  );
}
