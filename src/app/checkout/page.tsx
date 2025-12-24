"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/authlib/client";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {

      const payWithPaystack = () => {
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: "testuser@gmail.com",
      amount: 5000 * 100,
      currency: "NGN",
      callback: (response: any) => {
        console.log("Payment successful:", response.reference);
      },
      onClose: () => {
        alert("Payment cancelled");
      },
    });

    handler.openIframe();
  };
  const { cart, fetchCartFromDB, clearCart } = useCartStore();
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      setUserId(data.user.id);
      await fetchCartFromDB(data.user.id);
    };

    loadUser();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!userId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold">Please login to checkout.</h2>
      </div>
    );
  }



  return (
    <>
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT – CART SUMMARY */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">🛒 Order Summary</h2>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border rounded-lg p-3 items-center bg-white"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT – CHECKOUT FORM */}
      <div className="border rounded-lg p-5 bg-gray-50 space-y-5">
        <h2 className="text-xl font-bold">💳 Checkout</h2>

        {/* SHIPPING INFO */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="City"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-semibold text-lg border-t pt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* PLACE ORDER */}
        <button
          onClick={payWithPaystack}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
      
    </div>
    
    
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
      />
    </>
  );
}


// "use client";

// import Script from "next/script";

// export default function CheckoutPage() {
//   const payWithPaystack = () => {
//     const handler = (window as any).PaystackPop.setup({
//       key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//       email: "testuser@gmail.com",
//       amount: 5000 * 100,
//       currency: "NGN",
//       callback: (response: any) => {
//         console.log("Payment successful:", response.reference);
//       },
//       onClose: () => {
//         alert("Payment cancelled");
//       },
//     });

//     handler.openIframe();
//   };

//   return (
    // <>
    //   <Script
    //     src="https://js.paystack.co/v1/inline.js"
    //     strategy="afterInteractive"
    //   />

//       <button
//         onClick={payWithPaystack}
//         className="bg-green-600 text-white px-6 py-3 rounded"
//       >
//         Pay ₦5,000
//       </button>
//     </>
//   );
// }
