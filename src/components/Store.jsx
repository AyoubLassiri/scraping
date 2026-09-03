import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Eye,
  ShoppingBag,
  Check,
} from "lucide-react";
import heroImage from "../assets/championsheroimage.jpg";

/* ---------- Helper function to calculate final discounted price ---------- */
function calculateFinalPrice(price, promoType, promoValue) {
  if (!promoType || promoType === 'none' || !promoValue) return Number(price);
  if (promoType === 'percentage') {
    return Number(price) - (Number(price) * Number(promoValue)) / 100;
  }
  if (promoType === 'fixed') {
    return Math.max(0, Number(price) - Number(promoValue));
  }
  return Number(price);
}

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [stockFilter, setStockFilter] = useState("all"); // all | inStock | outOfStock
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Handle MySQL JSON columns if returned as strings
        const formattedData = data.map((item) => ({
          ...item,
          images: typeof item.images === "string" ? JSON.parse(item.images) : item.images,
          sizes: typeof item.sizes === "string" ? JSON.parse(item.sizes) : item.sizes,
          price: Number(item.price),
          promoValue: item.promoValue ? Number(item.promoValue) : 0,
        }));
        setProducts(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products from server:", err);
        setLoading(false);
      });
  }, []);

  // Lock body scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = quickViewProduct ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickViewProduct]);

  const handleAddToCart = (product, size) => {
    const finalPrice = calculateFinalPrice(product.price, product.promoType, product.promoValue);
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.images?.[0] || "",
        size: size || product.sizes?.[0] || "Standard",
        promoType: product.promoType || 'none',
        promoValue: product.promoValue || 0,
      })
    );

    toast.success("تمت الإضافة إلى السلة", {
      style: {
        border: "1px solid #222",
        padding: "16px",
        color: "#222",
        fontWeight: "bold",
      },
      iconTheme: { primary: "#222", secondary: "#fff" },
    });
  };

  const maxPrice = useMemo(
    () => (products.length ? Math.max(...products.map((p) => calculateFinalPrice(p.price, p.promoType, p.promoValue))) : 500),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    result = result.filter((p) => {
      const finalPrice = calculateFinalPrice(p.price, p.promoType, p.promoValue);
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });

    if (stockFilter === "inStock") result = result.filter((p) => p.inStock);
    if (stockFilter === "outOfStock") result = result.filter((p) => !p.inStock);

    if (sortBy === "priceAsc") result.sort((a, b) => calculateFinalPrice(a.price, a.promoType, a.promoValue) - calculateFinalPrice(b.price, b.promoType, b.promoValue));
    if (sortBy === "priceDesc") result.sort((a, b) => calculateFinalPrice(b.price, b.promoType, b.promoValue) - calculateFinalPrice(a.price, a.promoType, a.promoValue));
    if (sortBy === "nameAsc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, priceRange, stockFilter, sortBy]);

  const bestSeller = products[0];

  const sortLabels = {
    featured: "مميز",
    priceAsc: "السعر: من الأقل للأعلى",
    priceDesc: "السعر: من الأعلى للأقل",
    nameAsc: "الاسم: أ - ي",
  };

  return (
    <div dir="rtl" className="w-full font-sans bg-white dark:bg-neutral-950 min-h-screen text-[#1a1a1a] dark:text-neutral-100 transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[220px] md:h-[280px] bg-neutral-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent dark:from-neutral-950/80" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-2xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3">
            المنتجات
          </h1>
          <p className="text-white/60 text-xs font-medium tracking-widest uppercase">
            الرئيسية <span className="mx-1.5">/</span> المتجر
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-10 md:py-14 flex gap-12">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex w-[260px] shrink-0 flex-col gap-10 sticky top-6 self-start">
          <FilterPanel
            bestSeller={bestSeller}
            onAddToCart={handleAddToCart}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            products={products}
          />
        </aside>

        {/* Product area */}
        <div className="w-full min-w-0">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-8 pb-5 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-300"
            >
              <SlidersHorizontal size={15} />
              الفلاتر
            </button>

            <p className="hidden lg:block text-xs text-neutral-400 dark:text-neutral-500 tracking-wide">
              {filteredProducts.length} منتج
            </p>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs font-medium tracking-wide cursor-pointer focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors text-neutral-800 dark:text-neutral-200"
              >
                {Object.entries(sortLabels).map(([key, label]) => (
                  <option key={key} value={key} className="dark:bg-neutral-900">
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <GridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-400 text-sm tracking-wide">
                لا توجد منتجات مطابقة لهذا الفلتر
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>

              <div className="mt-16 flex flex-col items-center pt-10">
                <p className="text-[11px] text-neutral-400 mb-4 tracking-wide">
                  تشاهد {filteredProducts.length} من أصل {products.length} منتج
                </p>
                {filteredProducts.length < products.length && (
                  <button className="border border-neutral-800 dark:border-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-semibold px-10 py-3 uppercase tracking-widest hover:bg-neutral-800 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors duration-300">
                    عرض المزيد
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-neutral-900 p-6 overflow-y-auto transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 dark:text-neutral-100">الفلاتر</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-neutral-700 dark:text-neutral-300">
                <X size={20} />
              </button>
            </div>
            <FilterPanel
              bestSeller={bestSeller}
              onAddToCart={handleAddToCart}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              products={products}
            />
          </div>
        </div>
      )}

      {/* Quick view modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function FilterPanel({
  bestSeller,
  onAddToCart,
  priceRange,
  setPriceRange,
  maxPrice,
  stockFilter,
  setStockFilter,
  products,
}) {
  const inStockCount = products.filter((p) => p.inStock).length;
  const outStockCount = products.filter((p) => !p.inStock).length;

  return (
    <>
      {/* Availability */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-800 dark:text-neutral-200 mb-4">
          التوفر
        </h3>
        <div className="flex flex-col gap-2.5">
          {[
            { key: "all", label: "الكل", count: products.length },
            { key: "inStock", label: "متوفر", count: inStockCount },
            { key: "outOfStock", label: "نفذت الكمية", count: outStockCount },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStockFilter(opt.key)}
              className={`flex justify-between items-center text-sm py-1 transition-colors text-right ${
                stockFilter === opt.key
                  ? "text-neutral-900 dark:text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-xs">({opt.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-800 dark:text-neutral-200 mb-4">
          السعر
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          {priceRange[0]} — {priceRange[1]} درهم
        </p>
        <input
          type="range"
          min={0}
          max={maxPrice || 500}
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full accent-neutral-800 dark:accent-sky-500 cursor-pointer"
        />
      </div>

      {/* Best seller */}
      {bestSeller && (
        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-800 dark:text-neutral-200 mb-4">
            الأكثر مبيعاً
          </h3>
          <div className="flex gap-3 items-center">
            <div className="relative bg-neutral-50 dark:bg-neutral-800 w-20 h-20 shrink-0 flex items-center justify-center rounded-md overflow-hidden">
              <img
                src={bestSeller.images?.[0]}
                alt={bestSeller.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate mb-1">
                {bestSeller.name}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {calculateFinalPrice(bestSeller.price, bestSeller.promoType, bestSeller.promoValue)} درهم
                </p>
              </div>
              <button
                onClick={() => onAddToCart(bestSeller)}
                className="text-[11px] font-semibold text-neutral-900 dark:text-sky-400 underline underline-offset-2 hover:no-underline"
              >
                أضف إلى السلة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Image carousel used inside each product card ---- */
function ImageCarousel({ images, alt, product }) {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const touchStartX = React.useRef(null);

  const hasMultiple = images && images.length > 1;

  const goTo = (i, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIndex((i + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) goTo(index - 1);
      else goTo(index + 1);
    }
    touchStartX.current = null;
  };

  if (!images || images.length === 0 || imgError) {
    return (
      <span className="text-neutral-300 dark:text-neutral-600 text-[9px] tracking-widest uppercase">
        لا توجد صورة
      </span>
    );
  }

  const hasPromo = product.promoType && product.promoType !== 'none';

  return (
    <>
      {hasPromo && (
        <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-full z-10 shadow-sm">
          {product.promoType === 'percentage' ? `${product.promoValue}%-` : `${product.promoValue} د.م-`}
        </div>
      )}

      <div
        className="w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={index}
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className="max-h-[80%] max-w-[80%] object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          onError={() => setImgError(true)}
        />
      </div>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => goTo(index - 1, e)}
            aria-label="الصورة السابقة"
            className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={(e) => goTo(index + 1, e)}
            aria-label="الصورة التالية"
            className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
          >
            <ChevronRight size={14} />
          </button>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goTo(i, e)}
                aria-label={`صورة ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-3 bg-neutral-900 dark:bg-white" : "w-1.5 bg-neutral-900/30 dark:bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function ProductCard({ product, onAddToCart, onQuickView }) {
  const finalPrice = calculateFinalPrice(product.price, product.promoType, product.promoValue);
  const hasPromo = product.promoType && product.promoType !== 'none';

  return (
    <div className="flex flex-col group">
      <div
        className="relative bg-neutral-50 dark:bg-neutral-900 aspect-square w-full mb-2 flex items-center justify-center overflow-hidden rounded-md cursor-pointer transition-shadow duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.06)] border border-transparent dark:border-neutral-800"
        onClick={onQuickView}
      >
        <ImageCarousel
          images={product.images}
          alt={product.name}
          product={product}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView();
          }}
          aria-label="عرض سريع"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-md opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-10 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900"
        >
          <Eye size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!product.inStock}
          className="hidden md:flex absolute bottom-0 left-0 right-0 bg-neutral-900/90 dark:bg-neutral-800 text-white text-[9px] font-semibold py-1.5 uppercase tracking-wide justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 z-10"
        >
          {product.inStock ? "أضف" : "نفذت"}
        </button>
      </div>

      <h3 className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug truncate">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-2 mb-1.5">
        <p className={`text-xs ${hasPromo ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-neutral-500 dark:text-neutral-400'}`}>
          {finalPrice} درهم
        </p>
        {hasPromo && (
          <p className="text-[10px] text-neutral-400 line-through">
            {product.price} درهم
          </p>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product)}
        disabled={!product.inStock}
        className="md:hidden bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] font-semibold py-1.5 uppercase tracking-wide rounded disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400"
      >
        {product.inStock ? "أضف إلى السلة" : "نفذت الكمية"}
      </button>
    </div>
  );
}

/* ---- Quick view modal ---- */
function QuickViewModal({ product, onClose, onAddToCart }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [added, setAdded] = useState(false);

  const finalPrice = calculateFinalPrice(product.price, product.promoType, product.promoValue);
  const hasPromo = product.promoType && product.promoType !== 'none';

  const images = product.images?.length ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const goTo = (i) => setActiveImage((i + images.length) % images.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      <div
        dir="rtl"
        className="relative bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-[modalIn_0.25s_ease-out] flex flex-col md:flex-row transition-colors"
      >
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 z-20 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        <div className="md:w-1/2 bg-neutral-50 dark:bg-neutral-950 relative flex items-center justify-center aspect-square md:aspect-auto shrink-0">
          {images.length > 0 ? (
            <img
              key={activeImage}
              src={images[activeImage]}
              alt={product.name}
              className="max-w-[75%] max-h-[75%] object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          ) : (
            <span className="text-neutral-300 dark:text-neutral-600 text-xs tracking-widest uppercase">
              لا توجد صورة
            </span>
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={() => goTo(activeImage - 1)}
                aria-label="الصورة السابقة"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 hover:bg-white shadow-sm"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => goTo(activeImage + 1)}
                aria-label="الصورة التالية"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 hover:bg-white shadow-sm"
              >
                <ChevronRight size={15} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`صورة ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImage === i
                        ? "w-4 bg-neutral-900 dark:bg-white"
                        : "w-1.5 bg-neutral-900/30 dark:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 leading-snug mb-2 pl-8">
            {product.name}
          </h2>
          
          <div className="flex items-center gap-3 mb-4">
            <p className={`text-lg font-bold ${hasPromo ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
              {finalPrice} درهم
            </p>
            {hasPromo && (
              <p className="text-sm text-neutral-400 line-through">
                {product.price} درهم
              </p>
            )}
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
            {product.description}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <span className="block text-xs font-semibold tracking-widest uppercase text-neutral-800 dark:text-neutral-200 mb-3">
                المقاس
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-11 px-3 rounded-md text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p
            className={`text-xs font-medium mb-6 ${
              product.inStock ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"
            }`}
          >
            {product.inStock ? "متوفر حالياً" : "نفذت الكمية"}
          </p>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="mt-auto flex items-center justify-center gap-2.5 w-full bg-neutral-900 dark:bg-sky-600 text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-neutral-800 dark:hover:bg-sky-500 transition-colors disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            {added ? (
              <>
                <Check size={18} />
                أُضيف إلى السلة
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                {product.inStock ? "أضف إلى السلة" : "نفذت الكمية"}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="bg-neutral-100 dark:bg-neutral-800 aspect-square rounded-md" />
          <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
          <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}