import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, Plus, LogOut, Package, ShoppingCart, Edit, X, Users, Shield, BookOpen, Newspaper } from "lucide-react";
import AdminHistory from "./AdminHistory";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders"); // orders | products | staff | players | history | posts
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [players, setPlayers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Product Form states
  const [editingId, setEditingId] = useState(null); 
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    sizes: "S, M, L, XL",
    inStock: true,
    promoType: "none",
    promoValue: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Staff Form states
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "",
    description: "",
  });
  const [staffImageFile, setStaffImageFile] = useState(null);
  const [staffImagePreview, setStaffImagePreview] = useState("");

  // Player Form states
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [playerForm, setPlayerForm] = useState({
    name: "",
    position: "مهاجم",
    number: "",
    description: "",
  });
  const [playerImageFile, setPlayerImageFile] = useState(null);
  const [playerImagePreview, setPlayerImagePreview] = useState("");

  // Post Form states
  const [editingPostId, setEditingPostId] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, staffRes, playersRes, postsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/products"),
        fetch("http://localhost:5000/api/staff"),
        fetch("http://localhost:5000/api/players"),
        fetch("http://localhost:5000/api/posts"),
      ]);

      if (ordersRes.status === 401 || ordersRes.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const safeJson = async (res, label) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(`${label} failed (${res.status}):`, text.slice(0, 200));
          throw new Error(`${label} request failed`);
        }
        return res.json();
      };

      const [ordersData, productsData, staffData, playersData, postsData] = await Promise.all([
        safeJson(ordersRes, "orders"),
        safeJson(productsRes, "products"),
        safeJson(staffRes, "staff"),
        safeJson(playersRes, "players"),
        safeJson(postsRes, "posts"),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
      setStaffList(Array.isArray(staffData) ? staffData : []);
      setPlayers(Array.isArray(playersData) ? playersData : []);
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Product Handlers ---------- */
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("تم حذف المنتج بنجاح");
        setProducts(products.filter((p) => p.id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    
    let parsedSizes = product.sizes;
    if (typeof product.sizes === "string") {
      try { parsedSizes = JSON.parse(product.sizes); } catch (e) { parsedSizes = [product.sizes]; }
    }
    const sizeStr = Array.isArray(parsedSizes) ? parsedSizes.join(", ") : parsedSizes;

    let parsedImages = product.images;
    if (typeof product.images === "string") {
      try { parsedImages = JSON.parse(product.images); } catch (e) { parsedImages = [product.images]; }
    }
    const currentImages = Array.isArray(parsedImages) ? parsedImages : [parsedImages];

    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      sizes: sizeStr,
      inStock: Boolean(product.inStock),
      promoType: product.promoType || "none",
      promoValue: product.promoValue || "",
    });
    
    setImageFiles([]);
    setImagePreviews(currentImages.filter(Boolean));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProductForm({ name: "", price: "", description: "", sizes: "S, M, L, XL", inStock: true, promoType: "none", promoValue: "" });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index >= imagePreviews.length - imageFiles.length) {
      const fileIndex = index - (imagePreviews.length - imageFiles.length);
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (editingId) {
        formData.append("id", editingId);
      }
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("description", productForm.description);
      formData.append("sizes", productForm.sizes);
      formData.append("inStock", productForm.inStock);
      formData.append("promoType", productForm.promoType);
      formData.append("promoValue", productForm.promoValue || 0);

      const keptImages = imagePreviews.filter(url => url.startsWith("http"));
      formData.append("existingImages", JSON.stringify(keptImages));

      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }

      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingId ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
        handleCancelEdit();
        fetchData();
      } else {
        throw new Error(data.message || "فشل العملية");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ، تأكد من صحة المدخلات");
    }
  };

  /* ---------- Staff Handlers ---------- */
  const handleEditStaffClick = (staff) => {
    setEditingStaffId(staff.id);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      description: staff.description || "",
    });
    setStaffImageFile(null);
    setStaffImagePreview(staff.image || "");
  };

  const handleCancelStaffEdit = () => {
    setEditingStaffId(null);
    setStaffForm({ name: "", role: "", description: "" });
    setStaffImageFile(null);
    setStaffImagePreview("");
  };

  const handleStaffImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStaffImageFile(file);
      setStaffImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف عضو الطاقم هذا؟")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("تم حذف عضو الطاقم بنجاح");
        setStaffList(staffList.filter((s) => s.id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", staffForm.name);
      formData.append("role", staffForm.role);
      formData.append("description", staffForm.description);
      
      if (staffImageFile) {
        formData.append("image", staffImageFile);
      } else if (staffImagePreview && staffImagePreview.startsWith("http")) {
        formData.append("existingImage", staffImagePreview);
      }

      const url = editingStaffId 
        ? `http://localhost:5000/api/staff/${editingStaffId}`
        : "http://localhost:5000/api/staff";
      
      const method = editingStaffId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingStaffId ? "تم تحديث عضو الطاقم بنجاح" : "تم إضافة عضو الطاقم بنجاح");
        handleCancelStaffEdit();
        fetchData();
      } else {
        throw new Error(data.message || "فشل العملية");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ، تأكد من المدخلات");
    }
  };

  /* ---------- Player Handlers ---------- */
  const handleEditPlayerClick = (player) => {
    setEditingPlayerId(player.id);
    setPlayerForm({
      name: player.name,
      position: player.position,
      number: player.number || "",
      description: player.description || "",
    });
    setPlayerImageFile(null);
    setPlayerImagePreview(player.image || "");
  };

  const handleCancelPlayerEdit = () => {
    setEditingPlayerId(null);
    setPlayerForm({ name: "", position: "مهاجم", number: "", description: "" });
    setPlayerImageFile(null);
    setPlayerImagePreview("");
  };

  const handlePlayerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlayerImageFile(file);
      setPlayerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeletePlayer = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا اللاعب؟")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/players/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("تم حذف اللاعب بنجاح");
        setPlayers(players.filter((p) => p.id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleSubmitPlayer = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", playerForm.name);
      formData.append("position", playerForm.position);
      formData.append("number", playerForm.number);
      formData.append("description", playerForm.description);
      
      if (playerImageFile) {
        formData.append("image", playerImageFile);
      } else if (playerImagePreview && playerImagePreview.startsWith("http")) {
        formData.append("existingImage", playerImagePreview);
      }

      const url = editingPlayerId 
        ? `http://localhost:5000/api/players/${editingPlayerId}`
        : "http://localhost:5000/api/players";
      
      const method = editingPlayerId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingPlayerId ? "تم تحديث بيانات اللاعب بنجاح" : "تم إضافة اللاعب بنجاح");
        handleCancelPlayerEdit();
        fetchData();
      } else {
        throw new Error(data.message || "فشل العملية");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ، تأكد من المدخلات");
    }
  };

  /* ---------- Post Handlers ---------- */
  const handleEditPostClick = (post) => {
    setEditingPostId(post.id);
    setPostForm({ title: post.title, content: post.content });
    setPostImageFile(null);
    setPostImagePreview(post.image || "");
  };

  const handleCancelPostEdit = () => {
    setEditingPostId(null);
    setPostForm({ title: "", content: "" });
    setPostImageFile(null);
    setPostImagePreview("");
  };

  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImageFile(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("تم حذف الخبر بنجاح");
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      
      if (postImageFile) {
        formData.append("image", postImageFile);
      } else if (postImagePreview && postImagePreview.startsWith("http")) {
        formData.append("existingImage", postImagePreview);
      }

      const url = editingPostId 
        ? `http://localhost:5000/api/posts/${editingPostId}`
        : "http://localhost:5000/api/posts";
      
      const method = editingPostId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingPostId ? "تم تحديث الخبر بنجاح" : "تم إضافة الخبر بنجاح");
        handleCancelPostEdit();
        fetchData();
      } else {
        throw new Error(data.message || "فشل العملية");
      }
    } catch (error) {
      toast.error(error.message || "حدث خطأ، تأكد من المدخلات");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center transition-colors">
        <h1 className="text-base font-bold tracking-wide">لوحة التحكم — مستقبل المرسى</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          تسجيل الخروج
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "orders" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <ShoppingCart size={18} />
            الطلبات الواردة ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "products" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Package size={18} />
            إدارة المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "staff" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Users size={18} />
            إدارة الطاقم ({staffList.length})
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "players" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Shield size={18} />
            إدارة اللاعبين ({players.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "history" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <BookOpen size={18} />
            إدارة صفحة التاريخ
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 text-sm font-semibold pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "posts" ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <Newspaper size={18} />
            إدارة الأخبار ({posts.length})
          </button>
        </div>

        {loading && activeTab !== "history" ? (
          <div className="text-center py-20 text-neutral-400 text-sm">جاري تحميل البيانات...</div>
        ) : activeTab === "orders" ? (
          /* ORDERS TAB */
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <p className="text-neutral-400 text-sm text-center py-12">لا توجد طلبات حتى الآن.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-colors">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold bg-neutral-900 dark:bg-neutral-800 text-white px-2.5 py-1 rounded">طلب #{order.id}</span>
                      <span className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString("ar-MA")}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                      الزبون: {order.first_name} {order.last_name}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">الهاتف: <span className="font-semibold">{order.phone}</span></p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">العنوان: {order.address}, {order.city}</p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg md:w-1/2 flex flex-col justify-between border border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">المنتجات المطلوبة:</h4>
                    <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                      {typeof order.items === "string" ? JSON.parse(order.items).map((item, i) => (
                        <div key={i} className="text-xs text-neutral-600 dark:text-neutral-400 flex justify-between">
                          <span>{item.name} ({item.size}) × {item.quantity || 1}</span>
                          <span className="font-medium">{item.price * (item.quantity || 1)} درهم</span>
                        </div>
                      )) : null}
                    </div>
                    <div className="border-t border-neutral-200 dark:border-neutral-800 mt-3 pt-2 flex justify-between text-xs font-bold">
                      <span className="text-neutral-900 dark:text-neutral-100">المجموع الكلي:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{order.total_price} درهم</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "products" ? (
          /* PRODUCTS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                    <X size={14} /> إلغاء التعديل
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitProduct} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                <input
                  type="number"
                  placeholder="السعر الأصلي (درهم)"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={productForm.promoType}
                    onChange={(e) => setProductForm({ ...productForm, promoType: e.target.value })}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white bg-white dark:bg-neutral-800 transition-colors"
                  >
                    <option value="none">بدون تخفيض</option>
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">قيمة ثابتة (درهم)</option>
                  </select>

                  {productForm.promoType !== "none" && (
                    <input
                      type="number"
                      placeholder="قيمة التخفيض"
                      value={productForm.promoValue}
                      onChange={(e) => setProductForm({ ...productForm, promoValue: e.target.value })}
                      required
                      className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                    />
                  )}
                </div>

                <textarea
                  placeholder="وصف المنتج"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows="2"
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">صور المنتج (اختر عدة صور)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-200 cursor-pointer"
                  />
                  
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {imagePreviews.map((src, index) => (
                        <div key={index} className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 overflow-hidden relative shadow-sm group">
                          <img src={src} alt="معاينة" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePreview(index)}
                            className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 opacity-80 hover:opacity-100"
                            title="إزالة"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="المقاسات مفصولة بفاصلة (S, M, L)"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="inStockCheck"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 accent-neutral-900 dark:accent-white cursor-pointer"
                  />
                  <label htmlFor="inStockCheck" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">المنتج متوفر في المخزون</label>
                </div>

                <button
                  type="submit"
                  className="mt-3 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {editingId ? <Edit size={15} /> : <Plus size={15} />}
                  {editingId ? "تحديث المنتج" : "حفظ وإضافة المنتج"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
              <h3 className="text-sm font-bold mb-4">قائمة المنتجات الحالية</h3>
              <div className="flex flex-col gap-3">
                {products.map((product) => {
                  let imgUrl = product.images;
                  if (typeof product.images === "string") {
                    try { imgUrl = JSON.parse(product.images)[0]; } catch (e) { imgUrl = product.images; }
                  } else if (Array.isArray(product.images)) {
                    imgUrl = product.images[0];
                  }

                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center overflow-hidden shrink-0">
                          {imgUrl && <img src={imgUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{product.name}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{product.price} درهم</p>
                            {product.promoType && product.promoType !== 'none' && (
                              <span className="bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                تخفيض {product.promoType === 'percentage' ? `${product.promoValue}%` : `${product.promoValue} درهم`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-2 rounded-lg transition-colors"
                          title="تعديل المنتج"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 p-2 rounded-lg transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === "staff" ? (
          /* STAFF TAB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">{editingStaffId ? "تعديل عضو الطاقم" : "إضافة عضو طاقم جديد"}</h3>
                {editingStaffId && (
                  <button onClick={handleCancelStaffEdit} className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                    <X size={14} /> إلغاء التعديل
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitStaff} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="اسم الشخص"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                <input
                  type="text"
                  placeholder="الدور (مثال: Trainer, Assistant...)"
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">صورة عضو الطاقم</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStaffImageChange}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-200 cursor-pointer"
                  />
                  {staffImagePreview && (
                    <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden mt-2 relative shadow-sm">
                      <img src={staffImagePreview} alt="معاينة" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="وصف (اختياري)"
                  value={staffForm.description}
                  onChange={(e) => setStaffForm({ ...staffForm, description: e.target.value })}
                  rows="3"
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />

                <button
                  type="submit"
                  className="mt-3 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {editingStaffId ? <Edit size={15} /> : <Plus size={15} />}
                  {editingStaffId ? "تحديث عضو الطاقم" : "حفظ وإضافة عضو الطاقم"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
              <h3 className="text-sm font-bold mb-4">قائمة طاقم النادي</h3>
              <div className="flex flex-col gap-3">
                {staffList.length === 0 ? (
                  <p className="text-neutral-400 text-xs text-center py-8">لا يوجد أعضاء طاقم مسجلين حالياً.</p>
                ) : (
                  staffList.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                          {staff.image ? (
                            <img src={staff.image} alt={staff.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users size={20} className="text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{staff.name}</h4>
                            <span className="bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] px-2 py-0.5 rounded font-medium">{staff.role}</span>
                          </div>
                          {staff.description && <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{staff.description}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditStaffClick(staff)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-2 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 p-2 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "players" ? (
          /* PLAYERS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">{editingPlayerId ? "تعديل بيانات اللاعب" : "إضافة لاعب جديد"}</h3>
                {editingPlayerId && (
                  <button onClick={handleCancelPlayerEdit} className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                    <X size={14} /> إلغاء التعديل
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitPlayer} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="اسم اللاعب"
                  value={playerForm.name}
                  onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={playerForm.position}
                    onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white bg-white dark:bg-neutral-800 transition-colors"
                  >
                    <option value="حارس مرمى">حارس مرمى</option>
                    <option value="مدافع">مدافع</option>
                    <option value="وسط ميدان">وسط ميدان</option>
                    <option value="مهاجم">مهاجم</option>
                  </select>

                  <input
                    type="number"
                    placeholder="رقم القميص"
                    value={playerForm.number}
                    onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
                    className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">صورة اللاعب</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePlayerImageChange}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-200 cursor-pointer"
                  />
                  {playerImagePreview && (
                    <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden mt-2 relative shadow-sm">
                      <img src={playerImagePreview} alt="معاينة" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="نبذة أو ملاحظات (اختياري)"
                  value={playerForm.description}
                  onChange={(e) => setPlayerForm({ ...playerForm, description: e.target.value })}
                  rows="3"
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />

                <button
                  type="submit"
                  className="mt-3 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {editingPlayerId ? <Edit size={15} /> : <Plus size={15} />}
                  {editingPlayerId ? "تحديث بيانات اللاعب" : "حفظ وإضافة اللاعب"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
              <h3 className="text-sm font-bold mb-4">تشكيلة اللاعبين</h3>
              <div className="flex flex-col gap-3">
                {players.length === 0 ? (
                  <p className="text-neutral-400 text-xs text-center py-8">لا يوجد لاعبيـن مسجلين حالياً.</p>
                ) : (
                  players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700 relative">
                          {player.image ? (
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <Shield size={20} className="text-neutral-400" />
                          )}
                          {player.number && (
                            <span className="absolute bottom-0 right-0 bg-neutral-900 dark:bg-neutral-700 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                              {player.number}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{player.name}</h4>
                            <span className="bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] px-2 py-0.5 rounded font-medium">{player.position}</span>
                            {player.number && <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">#{player.number}</span>}
                          </div>
                          {player.description && <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">{player.description}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPlayerClick(player)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-2 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 p-2 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "history" ? (
          /* HISTORY TAB */
          <AdminHistory />
        ) : activeTab === "posts" ? (
          /* POSTS TAB CONTENT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold">{editingPostId ? "تعديل الخبر" : "إضافة خبر جديد"}</h3>
                {editingPostId && (
                  <button onClick={handleCancelPostEdit} className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                    <X size={14} /> إلغاء التعديل
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitPost} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="عنوان الخبر"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  required
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
                
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">صورة الخبر</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageChange}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-200 cursor-pointer"
                  />
                  {postImagePreview && (
                    <div className="w-full h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden mt-2 relative shadow-sm">
                      <img src={postImagePreview.startsWith("blob:") || postImagePreview.startsWith("http") ? postImagePreview : `http://localhost:5000${postImagePreview}`} alt="معاينة" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="محتوى الخبر التفصيلي..."
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  required
                  rows="6"
                  className="w-full border border-neutral-200 dark:border-neutral-700 bg-transparent rounded-lg p-2.5 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none"
                />

                <button type="submit" className="mt-3 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  {editingPostId ? <Edit size={15} /> : <Plus size={15} />}
                  {editingPostId ? "تحديث الخبر" : "نشر الخبر"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
              <h3 className="text-sm font-bold mb-4">قائمة الأخبار</h3>
              <div className="flex flex-col gap-3">
                {posts.length === 0 ? (
                  <p className="text-neutral-400 text-xs text-center py-8">لا توجد أخبار منشورة حالياً.</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                          {post.image ? (
                            <img src={post.image.startsWith("http") ? post.image : `http://localhost:5000${post.image}`} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <Newspaper size={20} className="text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">{post.title}</h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">{post.content}</p>
                          <p className="text-[10px] text-neutral-400 mt-1">{new Date(post.created_at).toLocaleDateString("ar-MA")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleEditPostClick(post)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-2 rounded-lg transition-colors" title="تعديل">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeletePost(post.id)} className="text-red-500 dark:text-red-400 hover:text-red-700 p-2 rounded-lg transition-colors" title="حذف">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}