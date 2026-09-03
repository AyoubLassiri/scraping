import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../redux/cartSlice';
import { Trash2, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import heroImage from "../assets/championsheroimage.jpg";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
            سلة المشتريات
          </h1>
          <p className="text-white/60 text-xs font-medium tracking-widest uppercase">
            الرئيسية <span className="mx-1.5">/</span> السلة
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-16">
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-6">سلة التسوق الخاصة بك فارغة.</p>
            <Link 
              to="/store" 
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold px-10 py-4 uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              مواصلة التسوق
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items Table */}
            <div className="w-full lg:w-2/3">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <div className="col-span-3">المنتج</div>
                <div className="text-center">السعر</div>
                <div className="text-center">الكمية</div>
                <div className="text-left">المجموع</div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-6 md:gap-0">
                {cartItems.map((item) => {
                  const hasPromo = item.promoType && item.promoType !== 'none' && item.promoValue > 0;

                  return (
                    <div 
                      key={`${item.id}-${item.size}`} 
                      className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b border-neutral-100 dark:border-neutral-900 py-6"
                    >
                      {/* Image & Title */}
                      <div className="col-span-3 flex items-center gap-6 w-full">
                        <div className="relative w-24 h-32 bg-neutral-50 dark:bg-neutral-900 flex-shrink-0 flex items-center justify-center p-2 rounded-md">
                          {hasPromo && (
                            <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-full z-10">
                              {item.promoType === 'percentage' ? `${item.promoValue}%-` : `${item.promoValue} د.م-`}
                            </span>
                          )}
                          <img src={item.image} alt={item.name} className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex flex-col">
                          <Link to={`/store/${item.id}`} className="font-bold text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors mb-1 line-clamp-2">
                            {item.name}
                          </Link>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">المقاس: {item.size}</p>
                          <button 
                            onClick={() => dispatch(removeFromCart(item))} 
                            className="text-xs text-neutral-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 w-fit transition-colors"
                          >
                            <Trash2 size={12} />
                            إزالة
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:block text-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        <span className="font-semibold text-neutral-900 dark:text-white">{item.price} درهم</span>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 w-28 h-10 rounded-md">
                          <button 
                            onClick={() => dispatch(decrementQuantity(item))} 
                            className="w-10 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(incrementQuantity(item))} 
                            className="w-10 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-left w-full md:w-auto text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        <span className="md:hidden text-neutral-500 dark:text-neutral-400 font-normal mr-2">المجموع:</span>
                        {item.price * item.quantity} درهم
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <Link to="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider">
                  <ArrowRight size={16} />
                  العودة للتسوق
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-xl border border-neutral-100 dark:border-neutral-800 transition-colors">
                <h3 className="text-sm font-bold border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6 uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                  ملخص الطلب
                </h3>
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-neutral-600 dark:text-neutral-400">المجموع الفرعي</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalPrice} درهم</span>
                </div>
                
                <div className="flex justify-between text-sm mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                  <span className="text-neutral-600 dark:text-neutral-400">التوصيل</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">يحسب في الخطوة التالية</span>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">الإجمالي</span>
                  <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100">{totalPrice} درهم</span>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 dark:bg-sky-600 text-white py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-sky-500 transition-colors"
                >
                  المتابعة للدفع
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}