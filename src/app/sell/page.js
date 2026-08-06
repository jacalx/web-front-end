"use client";
// ===== Sell Product Page =====
// Professional upload: drag & drop, multi-image, live preview, progress, draft saving.

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaCheckCircle, FaImage, FaUpload, FaTrash, FaTimes,
  FaSave, FaCloudUploadAlt,
} from "react-icons/fa";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";
import Modal from "../component/Modal/Modal";
import { categories, conditions, universities } from "../../data/products";

const DRAFT_KEY = "sm_sell_draft";

function SellProduct() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", category: "", price: "", condition: "",
    description: "", location: "", university: "", agreeFee: false,
  });

  const [images, setImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed.formData || parsed);
        if (parsed.images) setImages(parsed.images);
      } catch { setFormData(parsed); }
    }
  }, []);

  useEffect(() => {
    if (!formData.name && images.length === 0) return;
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, images }));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 1500);
    }, 1000);
    return () => clearTimeout(t);
  }, [formData, images]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFiles = (files) => {
    const fileArr = Array.from(files).slice(0, 5 - images.length);
    if (fileArr.length === 0) return;

    setUploading(true);
    setProgress(0);

    fileArr.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, { id: Date.now() + Math.random(), src: reader.result, name: file.name, file }]);
      };
      reader.readAsDataURL(file);
    });

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setUploading(false); return 100; }
        return p + 20;
      });
    }, 120);
  };

  const handleImageUpload = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Product name is required";
    if (!formData.category) e.category = "Please select a category";
    if (!formData.price || formData.price <= 0) e.price = "Enter a valid price";
    if (!formData.condition) e.condition = "Please select a condition";
    if (!formData.description) e.description = "Description is required";
    if (!formData.location) e.location = "Location is required";
    if (!formData.university) e.university = "Please select a university";
    if (!formData.agreeFee) e.agreeFee = "You must agree to the service fee";
    if (images.length === 0) e.images = "Add at least one image";
    return e;
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      // 1. Upload the real image files to Strapi's media library.
      const filesToUpload = images.map((img) => img.file).filter(Boolean);
      let imageUrls = [];
      if (filesToUpload.length > 0) {
        const uploadForm = new FormData();
        filesToUpload.forEach((file) => uploadForm.append("files", file));
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
        imageUrls = uploadData.urls;
      }

      // 2. Create the product, pointing at those uploaded image URLs.
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          price: Number(formData.price),
          images: imageUrls,
          university: formData.university,
          location: formData.location,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create listing");

      localStorage.removeItem(DRAFT_KEY);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "", category: "", price: "", condition: "",
      description: "", location: "", university: "", agreeFee: false,
    });
    setImages([]);
    setErrors({});
    localStorage.removeItem(DRAFT_KEY);
  };

  const completion = (() => {
    let c = 0;
    if (formData.name) c++;
    if (formData.category) c++;
    if (formData.price) c++;
    if (formData.condition) c++;
    if (formData.description) c++;
    if (formData.location) c++;
    if (formData.university) c++;
    if (formData.agreeFee) c++;
    if (images.length > 0) c++;
    return Math.round((c / 9) * 100);
  })();

  return (
    <div className="sellproduct page-fade">
      <div className="sellproduct-container">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Sell Product" }]} />

        <div className="sellproduct-header">
          <h1 className="sellproduct-title">Sell a Product</h1>
          <p className="sellproduct-subtitle">
            List your item for sale. Only verified students can post.
          </p>
          {draftSaved && (
            <span className="sellproduct-draft-saved">
              <FaSave /> Draft saved
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="sellproduct-progress">
          <div className="sellproduct-progress-info">
            <span>Listing completion</span>
            <span className="sellproduct-progress-pct">{completion}%</span>
          </div>
          <div className="sellproduct-progress-track">
            <div className="sellproduct-progress-fill" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <form className="sellproduct-form" onSubmit={handleSubmit}>
          {/* Image upload — drag & drop */}
          <div className="sellproduct-field">
            <label className="sellproduct-label">Product Images ({images.length}/5)</label>
            <div
              className={`sellproduct-upload-area ${isDragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="sellproduct-file-input"
              />
              <div className="sellproduct-upload-placeholder">
                <FaCloudUploadAlt className="sellproduct-upload-icon" />
                <span>Drag & drop images here, or click to browse</span>
                <span className="sellproduct-upload-hint">Up to 5 images. JPG, PNG up to 5MB.</span>
              </div>
            </div>
            {uploading && (
              <div className="sellproduct-upload-progress">
                <div className="sellproduct-upload-progress-bar" style={{ width: `${progress}%` }} />
              </div>
            )}
            {images.length > 0 && (
              <div className="sellproduct-image-grid">
                {images.map((img) => (
                  <div key={img.id} className="sellproduct-image-thumb">
                    <img src={img.src} alt={img.name} />
                    <button
                      type="button"
                      className="sellproduct-image-remove"
                      onClick={() => removeImage(img.id)}
                      aria-label="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && <span className="sellproduct-error">{errors.images}</span>}
          </div>

          {/* Product Name */}
          <div className="floating-field">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="x" required />
            <label>Product Name *</label>
          </div>
          {errors.name && <span className="sellproduct-error">{errors.name}</span>}

          {/* Category and Price */}
          <div className="sellproduct-row">
            <div className="floating-field">
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <label>Category *</label>
            </div>
            <div className="floating-field">
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="x" min="0" required />
              <label>Price ($) *</label>
            </div>
          </div>
          {(errors.category || errors.price) && (
            <span className="sellproduct-error">{errors.category || errors.price}</span>
          )}

          {/* Condition and University */}
          <div className="sellproduct-row">
            <div className="floating-field">
              <select name="condition" value={formData.condition} onChange={handleChange} required>
                <option value="">Select</option>
                {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
              </select>
              <label>Condition *</label>
            </div>
            <div className="floating-field">
              <select name="university" value={formData.university} onChange={handleChange} required>
                <option value="">Select</option>
                {universities.map((uni) => <option key={uni} value={uni}>{uni}</option>)}
              </select>
              <label>University *</label>
            </div>
          </div>
          {(errors.condition || errors.university) && (
            <span className="sellproduct-error">{errors.condition || errors.university}</span>
          )}

          {/* Location */}
          <div className="floating-field">
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="x" required />
            <label>Location *</label>
          </div>
          {errors.location && <span className="sellproduct-error">{errors.location}</span>}

          {/* Description */}
          <div className="floating-field">
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="x" rows="5" required />
            <label>Description *</label>
          </div>
          {errors.description && <span className="sellproduct-error">{errors.description}</span>}

          {/* Service fee agreement */}
          <div className="sellproduct-checkbox-wrapper">
            <label className="sellproduct-checkbox-label">
              <input type="checkbox" name="agreeFee" checked={formData.agreeFee} onChange={handleChange} />
              <span>I agree that when this item is sold I will pay a <strong>5% service fee</strong>.</span>
            </label>
            {errors.agreeFee && <span className="sellproduct-error">{errors.agreeFee}</span>}
          </div>

          {submitError && <div className="sellproduct-error" style={{ marginBottom: "12px" }}>{submitError}</div>}

          {/* Buttons */}
          <div className="sellproduct-buttons">
            <button type="submit" className="sellproduct-submit-btn" disabled={submitting}>
              <FaUpload /> {submitting ? "Submitting..." : "Submit Listing"}
            </button>
            <button type="button" className="sellproduct-reset-btn" onClick={handleReset} disabled={submitting}>
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} showClose={false}>
        <div className="sellproduct-success">
          <FaCheckCircle className="sellproduct-success-icon" />
          <h2>Product Listed Successfully!</h2>
          <p>
            Your product "{formData.name}" has been listed on the marketplace.
            You can manage it from your My Products page.
          </p>
          <div className="sellproduct-success-actions">
            <button className="sellproduct-success-btn-primary" onClick={() => router.push("/my-products")}>
              View My Products
            </button>
            <button className="sellproduct-success-btn-secondary" onClick={() => { handleReset(); setShowSuccess(false); }}>
              List Another
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SellProduct;
