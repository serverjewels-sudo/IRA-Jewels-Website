"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ChevronUp, ChevronDown, Filter, RotateCcw, Download, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const dynamic = 'force-dynamic';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState("product"); // "product" | "order"
  
  const [reportsEnabled, setReportsEnabled] = useState(null); // null = checking, true = active, false = restricted

  // Data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [category, setCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [orderStatus, setOrderStatus] = useState("All");
  
  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "All",
    paymentMethod: "All",
    orderStatus: "All",
  });

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Categories extraction
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (ordersRes.ok && productsRes.ok) {
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        setOrders(ordersData);
        setProducts(productsData);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error loading reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkFeatureFlag() {
      try {
        const { data, error } = await supabase
          .from("feature_flags")
          .select("reports_enabled")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error checking reports feature flag:", error);
          setReportsEnabled(false);
        } else if (data) {
          setReportsEnabled(!!data.reports_enabled);
        } else {
          setReportsEnabled(false);
        }
      } catch (err) {
        console.error("Unexpected error checking reports feature flag:", err);
        setReportsEnabled(false);
      }
    }
    checkFeatureFlag();
  }, []);

  useEffect(() => {
    if (reportsEnabled === true) {
      fetchData();
    } else if (reportsEnabled === false) {
      setLoading(false);
    }
  }, [reportsEnabled]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      category,
      paymentMethod,
      orderStatus,
    });
  };

  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCategory("All");
    setPaymentMethod("All");
    setOrderStatus("All");
    setAppliedFilters({
      dateFrom: "",
      dateTo: "",
      category: "All",
      paymentMethod: "All",
      orderStatus: "All",
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 1. Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Date Range Filter
      if (appliedFilters.dateFrom) {
        const orderDate = new Date(order.created_at);
        const fromDate = new Date(appliedFilters.dateFrom);
        if (orderDate < fromDate) return false;
      }
      if (appliedFilters.dateTo) {
        const orderDate = new Date(order.created_at);
        const toDate = new Date(appliedFilters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) return false;
      }
      // Payment Method Filter
      if (appliedFilters.paymentMethod !== "All") {
        if (String(order.payment_method).toLowerCase() !== String(appliedFilters.paymentMethod).toLowerCase()) return false;
      }
      // Order Status Filter
      if (appliedFilters.orderStatus !== "All") {
        if (String(order.status).toLowerCase() !== String(appliedFilters.orderStatus).toLowerCase()) return false;
      }
      // Category Filter (Order Level check for Order Report)
      if (appliedFilters.category !== "All") {
        const hasCategory = order.items?.some(item => {
          const product = products.find(p => p.id === item.product_id);
          return product && String(product.category).toLowerCase() === String(appliedFilters.category).toLowerCase();
        });
        if (!hasCategory) return false;
      }
      return true;
    });
  }, [orders, products, appliedFilters]);

  // 2. Generate Product Report Data
  const productReportData = useMemo(() => {
    const agg = {};
    filteredOrders.forEach(order => {
      (order.items || []).forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        const itemCategory = product?.category || "Unknown";
        
        // If category filter is active, skip items that don't match
        if (appliedFilters.category !== "All" && String(itemCategory).toLowerCase() !== String(appliedFilters.category).toLowerCase()) {
          return;
        }

        if (!agg[item.product_id]) {
          agg[item.product_id] = {
            id: item.product_id,
            name: item.name,
            sku: product?.sku || "-",
            style_number: product?.style_number || "-",
            category: itemCategory,
            unitsSold: 0,
            totalRevenue: 0,
          };
        }
        agg[item.product_id].unitsSold += (item.quantity || 1);
        agg[item.product_id].totalRevenue += ((item.price || 0) * (item.quantity || 1));
      });
    });

    let data = Object.values(agg).map(item => ({
      ...item,
      avgPrice: item.unitsSold > 0 ? item.totalRevenue / item.unitsSold : 0
    }));

    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by revenue desc
      data.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
    return data;
  }, [filteredOrders, products, appliedFilters.category, sortConfig]);

  // 3. Generate Order Report Data
  const orderReportData = useMemo(() => {
    let data = filteredOrders.map(order => {
      const itemsString = (order.items || []).map(i => i.name).join(", ");
      return {
        id: order.id,
        order_number: order.order_number,
        date: order.created_at,
        customer_name: order.customer_name || "Guest User",
        itemsString,
        payment_method: order.payment_method,
        status: order.status || "placed",
        total: order.total || 0,
      };
    });

    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date desc
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return data;
  }, [filteredOrders, sortConfig]);


  const getStatusBadgeClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "placed": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "confirmed": return "bg-green-50 text-green-700 border border-green-200";
      case "shipped": return "bg-purple-50 text-purple-700 border border-purple-200";
      case "delivered": return "bg-gray-50 text-gray-700 border border-gray-200";
      case "cancelled": return "bg-red-50 text-red-700 border border-red-200";
      default: return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (String(method).toLowerCase()) {
      case "cod": return "COD";
      case "upi": return "UPI";
      case "card": return "Card";
      case "netbanking": return "Net Banking";
      default: return method ? method.toUpperCase() : "Demo";
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 inline-block" /> : <ChevronDown className="w-3 h-3 ml-1 inline-block" />;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    const title = activeTab === "product" ? "Product Report" : "Order Report";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`TATVAAN \u2014 ${title}`, 14, 22);

    // Filters info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateRangeStr = `${appliedFilters.dateFrom || "Start"} to ${appliedFilters.dateTo || "Today"}`;
    const filtersStr = `Filters: Date Range: ${dateRangeStr} | Category: ${appliedFilters.category} | Payment: ${appliedFilters.paymentMethod} | Status: ${appliedFilters.orderStatus}`;
    doc.text(filtersStr, 14, 30);

    let head = [];
    let body = [];

    if (activeTab === "product") {
      head = [["Product Name", "SKU", "Style Number", "Category", "Units Sold", "Total Revenue", "Average Price"]];
      body = productReportData.map(row => [
        row.name,
        row.sku,
        row.style_number,
        row.category,
        row.unitsSold,
        `Rs ${Number(row.totalRevenue).toLocaleString("en-IN")}`,
        `Rs ${Number(row.avgPrice.toFixed(2)).toLocaleString("en-IN")}`
      ]);
      
      // Add Totals row
      body.push([
        "TOTALS",
        "-",
        "-",
        "-",
        productReportData.reduce((sum, item) => sum + item.unitsSold, 0),
        `Rs ${Number(productReportData.reduce((sum, item) => sum + item.totalRevenue, 0)).toLocaleString("en-IN")}`,
        "-"
      ]);
    } else {
      head = [["Order #", "Date", "Customer", "Items", "Payment", "Status", "Total Amount"]];
      body = orderReportData.map(row => [
        row.order_number,
        new Date(row.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        row.customer_name,
        row.itemsString,
        getPaymentMethodLabel(row.payment_method),
        row.status,
        `Rs ${Number(row.total).toLocaleString("en-IN")}`
      ]);
      
      body.push([
        "TOTAL REVENUE",
        "-",
        "-",
        "-",
        "-",
        "-",
        `Rs ${Number(orderReportData.reduce((sum, item) => sum + item.total, 0)).toLocaleString("en-IN")}`
      ]);
    }

    autoTable(doc, {
      startY: 35,
      head: head,
      body: body,
      theme: "grid",
      headStyles: { fillColor: [46, 49, 53] },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, 14, finalY);

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `TATVAAN-${title.replace(" ", "-")}-${dateStr}.pdf`;
    doc.save(filename);
  };

  const handleDownloadExcel = () => {
    const title = activeTab === "product" ? "Product Report" : "Order Report";
    const dateRangeStr = `${appliedFilters.dateFrom || "Start"} to ${appliedFilters.dateTo || "Today"}`;
    const filtersStr = `Filters: Date Range: ${dateRangeStr} | Category: ${appliedFilters.category} | Payment: ${appliedFilters.paymentMethod} | Status: ${appliedFilters.orderStatus}`;

    let excelData = [];
    
    if (activeTab === "product") {
      excelData = productReportData.map(row => ({
        "Product Name": row.name,
        "SKU": row.sku,
        "Style Number": row.style_number,
        "Category": row.category,
        "Units Sold": row.unitsSold,
        "Total Revenue": Number(row.totalRevenue),
        "Average Price": Number(row.avgPrice.toFixed(2))
      }));
      
      excelData.push({
        "Product Name": "TOTALS",
        "SKU": "-",
        "Style Number": "-",
        "Category": "-",
        "Units Sold": productReportData.reduce((sum, item) => sum + item.unitsSold, 0),
        "Total Revenue": Number(productReportData.reduce((sum, item) => sum + item.totalRevenue, 0)),
        "Average Price": "-"
      });
    } else {
      excelData = orderReportData.map(row => ({
        "Order #": row.order_number,
        "Date": new Date(row.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        "Customer": row.customer_name,
        "Items": row.itemsString,
        "Payment": getPaymentMethodLabel(row.payment_method),
        "Status": row.status,
        "Total Amount": Number(row.total)
      }));
      
      excelData.push({
        "Order #": "TOTAL REVENUE",
        "Date": "-",
        "Customer": "-",
        "Items": "-",
        "Payment": "-",
        "Status": "-",
        "Total Amount": Number(orderReportData.reduce((sum, item) => sum + item.total, 0))
      });
    }

    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create a filters info sheet
    const filtersData = [
      ["TATVAAN - " + title],
      ["Generated on", new Date().toLocaleDateString("en-IN")],
      [],
      ["Date Range", dateRangeStr],
      ["Category", appliedFilters.category],
      ["Payment Method", appliedFilters.paymentMethod],
      ["Order Status", appliedFilters.orderStatus]
    ];
    const wsFilters = XLSX.utils.aoa_to_sheet(filtersData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report Data");
    XLSX.utils.book_append_sheet(wb, wsFilters, "Filters Info");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `TATVAAN-${title.replace(" ", "-")}-${dateStr}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  if (reportsEnabled === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#CDB38B] border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
        <p className="font-inter text-[13px] text-[#888888] font-light uppercase tracking-wider">Verifying access...</p>
      </div>
    );
  }

  if (reportsEnabled === false) {
    return (
      <div className="bg-white rounded-lg border border-[#2E3135]/5 p-12 text-center shadow-sm max-w-lg mx-auto my-12">
        <h2 className="font-serif text-[24px] text-[#2E3135] mb-2 uppercase tracking-wide">Access Restricted</h2>
        <p className="font-inter font-light text-[14px] text-[#888888]">
          This feature is not currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Reports
            <span className="font-inter text-[13px] text-[#888888] block mt-1 font-light normal-case">
              Analyze product performance and order trends.
            </span>
          </h1>
        </div>
        <div className="flex bg-[#F3F1EC] p-1 rounded-md">
          <button
            onClick={() => { setActiveTab("product"); setSortConfig({key: null, direction: 'asc'}); }}
            className={`px-4 py-2 font-inter text-[12px] font-medium tracking-wider uppercase transition-colors rounded ${
              activeTab === "product" ? "bg-white text-[#2E3135] shadow-sm" : "text-[#888888] hover:text-[#2E3135]"
            }`}
          >
            Product Report
          </button>
          <button
            onClick={() => { setActiveTab("order"); setSortConfig({key: null, direction: 'asc'}); }}
            className={`px-4 py-2 font-inter text-[12px] font-medium tracking-wider uppercase transition-colors rounded ${
              activeTab === "order" ? "bg-white text-[#2E3135] shadow-sm" : "text-[#888888] hover:text-[#2E3135]"
            }`}
          >
            Order Report
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-[#2E3135]/5 space-y-4">
        <div className="flex items-center gap-2 mb-2 border-b border-[#2E3135]/5 pb-3">
          <Filter className="w-4 h-4 text-[#CDB38B]" />
          <h3 className="font-inter text-[12px] font-semibold tracking-wider text-[#2E3135] uppercase">
            Filter Options
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label className="font-inter text-[11px] font-medium text-[#888888] mb-1.5 uppercase">From Date</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-white border border-[#E0E0E0] rounded px-3 py-2 font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B]"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-inter text-[11px] font-medium text-[#888888] mb-1.5 uppercase">To Date</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-white border border-[#E0E0E0] rounded px-3 py-2 font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B]"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-inter text-[11px] font-medium text-[#888888] mb-1.5 uppercase">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-[#E0E0E0] rounded px-3 py-2 font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-inter text-[11px] font-medium text-[#888888] mb-1.5 uppercase">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-white border border-[#E0E0E0] rounded px-3 py-2 font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B]"
            >
              <option value="All">All</option>
              <option value="razorpay">Razorpay</option>
              <option value="cod">COD</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-inter text-[11px] font-medium text-[#888888] mb-1.5 uppercase">Order Status</label>
            <select 
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="bg-white border border-[#E0E0E0] rounded px-3 py-2 font-inter text-[13px] text-[#2E3135] focus:outline-none focus:border-[#CDB38B]"
            >
              <option value="All">All</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between gap-3 pt-2">
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] text-[#2E3135] font-inter text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#F3F1EC] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button 
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] text-[#2E3135] font-inter text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#F3F1EC] transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Download Excel
            </button>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#E0E0E0] text-[#888888] font-inter text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#F3F1EC] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
            <button 
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-[#2E3135] text-white font-inter text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#CDB38B] transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse"></div>
              ))}
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
              </div>
            ))}
          </div>
        ) : activeTab === "product" ? (
          /* Product Report Table */
          productReportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                    <th 
                      onClick={() => handleSort('name')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Product Name <SortIcon columnKey="name" />
                    </th>
                    <th 
                      onClick={() => handleSort('sku')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      SKU <SortIcon columnKey="sku" />
                    </th>
                    <th 
                      onClick={() => handleSort('style_number')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Style Number <SortIcon columnKey="style_number" />
                    </th>
                    <th 
                      onClick={() => handleSort('category')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Category <SortIcon columnKey="category" />
                    </th>
                    <th 
                      onClick={() => handleSort('unitsSold')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Units Sold <SortIcon columnKey="unitsSold" />
                    </th>
                    <th 
                      onClick={() => handleSort('totalRevenue')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-right cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Total Revenue <SortIcon columnKey="totalRevenue" />
                    </th>
                    <th 
                      onClick={() => handleSort('avgPrice')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-right cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Average Price <SortIcon columnKey="avgPrice" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                  {productReportData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F3F1EC]/20 transition-colors">
                      <td className="p-5 font-medium">{row.name}</td>
                      <td className="p-5 font-mono text-[12px] text-[#2E3135] whitespace-nowrap">{row.sku}</td>
                      <td className="p-5 font-mono text-[12px] text-[#2E3135]/80 whitespace-nowrap">{row.style_number}</td>
                      <td className="p-5 text-gray-500 uppercase text-[11px] font-semibold tracking-wider">{row.category}</td>
                      <td className="p-5 text-center font-medium">{row.unitsSold}</td>
                      <td className="p-5 text-right font-medium text-[14px]">₹{Number(row.totalRevenue).toLocaleString("en-IN")}</td>
                      <td className="p-5 text-right text-gray-500">₹{Number(row.avgPrice.toFixed(2)).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                  {/* Summary Row */}
                  <tr className="bg-[#F3F1EC]/40 border-t-2 border-[#E0E0E0]">
                    <td colSpan="4" className="p-5 font-inter text-[12px] font-bold uppercase tracking-wider text-[#2E3135] text-right">Totals:</td>
                    <td className="p-5 text-center font-bold text-[#2E3135]">
                      {productReportData.reduce((sum, item) => sum + item.unitsSold, 0)}
                    </td>
                    <td className="p-5 text-right font-bold text-[14px] text-[#2E3135]">
                      ₹{Number(productReportData.reduce((sum, item) => sum + item.totalRevenue, 0)).toLocaleString("en-IN")}
                    </td>
                    <td className="p-5"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px]">
                No product data available for the selected filters.
              </p>
            </div>
          )
        ) : (
          /* Order Report Table */
          orderReportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                    <th 
                      onClick={() => handleSort('order_number')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Order # <SortIcon columnKey="order_number" />
                    </th>
                    <th 
                      onClick={() => handleSort('date')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Date <SortIcon columnKey="date" />
                    </th>
                    <th 
                      onClick={() => handleSort('customer_name')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Customer <SortIcon columnKey="customer_name" />
                    </th>
                    <th 
                      onClick={() => handleSort('itemsString')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase cursor-pointer hover:text-[#2E3135] transition-colors max-w-xs"
                    >
                      Items <SortIcon columnKey="itemsString" />
                    </th>
                    <th 
                      onClick={() => handleSort('payment_method')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Payment <SortIcon columnKey="payment_method" />
                    </th>
                    <th 
                      onClick={() => handleSort('status')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Status <SortIcon columnKey="status" />
                    </th>
                    <th 
                      onClick={() => handleSort('total')} 
                      className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-right cursor-pointer hover:text-[#2E3135] transition-colors"
                    >
                      Total Amount <SortIcon columnKey="total" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                  {orderReportData.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F3F1EC]/20 transition-colors">
                      <td className="p-5 font-mono text-[12px] font-medium">{row.order_number}</td>
                      <td className="p-5 text-gray-500 whitespace-nowrap">
                        {new Date(row.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="p-5 font-medium">{row.customer_name}</td>
                      <td className="p-5 text-gray-500 max-w-xs truncate" title={row.itemsString}>{row.itemsString}</td>
                      <td className="p-5 text-center font-medium">{getPaymentMethodLabel(row.payment_method)}</td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${getStatusBadgeClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-5 text-right font-medium text-[14px]">₹{Number(row.total).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                  {/* Summary Row */}
                  <tr className="bg-[#F3F1EC]/40 border-t-2 border-[#E0E0E0]">
                    <td colSpan="6" className="p-5 font-inter text-[12px] font-bold uppercase tracking-wider text-[#2E3135] text-right">Total Revenue:</td>
                    <td className="p-5 text-right font-bold text-[14px] text-[#2E3135]">
                      ₹{Number(orderReportData.reduce((sum, item) => sum + item.total, 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px]">
                No order data available for the selected filters.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
