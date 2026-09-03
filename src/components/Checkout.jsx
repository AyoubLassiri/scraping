import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';
import heroImage from "../assets/championsheroimage.jpg";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
  });

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          items: cartItems,
          totalPrice: totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      toast.success("تم تسجيل طلبك بنجاح في النظام!", {
        style: { border: "1px solid #222", padding: "16px", color: "#222", fontWeight: "bold" },
        iconTheme: { primary: "#222", secondary: "#fff" },
      });

      dispatch(clearCart());
      navigate("/store");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div dir="rtl" className="w-full font-sans bg-white dark:bg-neutral-950 min-h-screen text-[#1a1a1a] dark:text-neutral-100 transition-colors duration-300">
        <Navbar />
        <section className="relative h-[220px] md:h-[280px] bg-neutral-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 scale-105" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent dark:from-neutral-950/80" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-white text-2xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3">إتمام الطلب</h1>
          </div>
        </section>
        
        <div className="text-center py-32 flex flex-col items-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-6">لا توجد منتجات للدفع.</p>
          <Link to="/store" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold px-10 py-4 uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full font-sans bg-white dark:bg-neutral-950 min-h-screen text-[#1a1a1a] dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative h-[220px] md:h-[280px] bg-neutral-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent dark:from-neutral-950/80" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-2xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3">
            إتمام الطلب
          </h1>
          <p className="text-white/60 text-xs font-medium tracking-widest uppercase">
            السلة <span className="mx-1.5">/</span> الدفع
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <form onSubmit={handleSubmitOrder} className="flex flex-col lg:flex-row gap-12">
          
          {/* Shipping Form */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-sm font-bold border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8 uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              معلومات التوصيل
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">الاسم الشخصي *</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-md p-3 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">الاسم العائلي *</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-md p-3 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">رقم الهاتف *</label>
              <input required type="tel" name="phone" placeholder="+212 6..." value={formData.phone} onChange={handleInputChange} className="border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-md p-3 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors text-left" dir="ltr" />
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">العنوان بالتفصيل *</label>
              <input required type="text" name="address" placeholder="اسم الشارع، رقم المنزل..." value={formData.address} onChange={handleInputChange} className="border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-md p-3 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">المدينة *</label>
              <input required type="text" name="city" placeholder="العيون، المرسى..." value={formData.city} onChange={handleInputChange} className="border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-md p-3 text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors" />
            </div>

            <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider">
              <ArrowRight size={16} />
              العودة إلى السلة
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-xl border border-neutral-100 dark:border-neutral-800 sticky top-24 transition-colors">
              <h3 className="text-sm font-bold border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6 uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                طلبك
              </h3>
              
              <div className="flex flex-col gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                {cartItems.map((item) => {
                  const hasPromo = item.promoType && item.promoType !== 'none' && item.promoValue > 0;

                  return (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-1 rounded flex items-center justify-center shrink-0">
                          {hasPromo && (
                            <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] px-1 font-bold rounded-full z-10">
                              {item.promoType === 'percentage' ? `${item.promoValue}%-` : `${item.promoValue} د.م-`}
                            </span>
                          )}
                          <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">الكمية: {item.quantity} | المقاس: {item.size}</p>
                        </div>
                      </div>
                      <span className="font-semibold whitespace-nowrap text-neutral-900 dark:text-neutral-100">{item.price * item.quantity} درهم</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-6 text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">المجموع الفرعي</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalPrice} درهم</span>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase">الإجمالي</span>
                <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100">{totalPrice} درهم</span>
              </div>
              
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 dark:bg-sky-600 text-white py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-sky-500 transition-colors"
              >
                <CheckCircle size={18} />
                تأكيد الطلب
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}