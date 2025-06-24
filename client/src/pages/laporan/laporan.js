// File: Laporan.jsx
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./laporan.scss";

import { auth } from "../../config/firebase";
import { getIdToken } from "firebase/auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function Laporan() {
  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);

  const [provId, setProvId] = useState("");
  const [kabId, setKabId] = useState("");

  const [formData, setFormData] = useState({
    jenis: "",
    judul: "",
    laporan: "",
    tanggal_kejadian: "",
    tujuan: "",
    kategori: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    status: "belum terlaksana",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const unsub = auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = '/login';
    } else {
      const token = await user.getIdTokenResult();
      if (token.claims.admin) {
        alert("Halaman ini hanya untuk masyarakat.");
        window.location.href = '/admin';
      }
    }
  });

  return () => unsub();
}, []);

  // Ambil data provinsi
  useEffect(() => {
    fetch("/data/provinsi.json")
      .then((res) => res.json())
      .then(setProvinsi)
      .catch(() => setProvinsi([]));
  }, []);

  // Ambil data kabupaten berdasarkan provinsi
  useEffect(() => {
    if (provId) {
      fetch("/data/kabupaten.json")
        .then((res) => res.json())
        .then((data) => {
          setKabupaten(data[provId] || []);
          setFormData((f) => ({
            ...f,
            provinsi: provId,
            kabupaten: "",
            kecamatan: "",
          }));
          setKabId("");
          setKecamatan([]);
        })
        .catch(() => setKabupaten([]));
    } else {
      setKabupaten([]);
      setKabId("");
      setKecamatan([]);
    }
  }, [provId]);

  // Ambil data kecamatan berdasarkan kabupaten
  useEffect(() => {
    if (kabId) {
      fetch("/data/kecamatan.json")
        .then((res) => res.json())
        .then((data) => {
          setKecamatan(data[kabId] || []);
          setFormData((f) => ({ ...f, kabupaten: kabId, kecamatan: "" }));
        })
        .catch(() => setKecamatan([]));
    } else {
      setKecamatan([]);
    }
  }, [kabId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowPreview(false);
    setSuccessId(null);

    try {
      const user = auth.currentUser;
      const token = user ? await getIdToken(user) : null;

      const response = await fetch(`${API_URL}/api/pelaporan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tanggal_kejadian: new Date(formData.tanggal_kejadian),
        }),
      });

      if (!response.ok) throw new Error("Gagal mengirim laporan");

      const result = await response.json();
      setShowPreview(true);
      setSuccessId(result._id);

      // Reset form
      setFormData({
        jenis: "",
        judul: "",
        laporan: "",
        tanggal_kejadian: "",
        tujuan: "",
        kategori: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        status: "belum terlaksana",
      });
      setProvId("");
      setKabId("");
      setKabupaten([]);
      setKecamatan([]);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim laporan: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="laporan-page-bg">
      <div className="laporan-form-card">
        <h2 className="laporan-title">
          <span role="img" aria-label="lapor" style={{ marginRight: 8 }}>
            📝
          </span>
          Buat Laporan Anda
        </h2>
        <p className="laporan-subtitle">
          Isi formulir berikut untuk menyampaikan pengaduan atau aspirasi secara online.
        </p>

        <form className="form-laporan" onSubmit={handleSubmit} autoComplete="off">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="jenis"
                value="pengaduan"
                onChange={handleChange}
                checked={formData.jenis === "pengaduan"}
                required
              />
              Pengaduan
            </label>
            <label>
              <input
                type="radio"
                name="jenis"
                value="aspirasi"
                onChange={handleChange}
                checked={formData.jenis === "aspirasi"}
                required
              />
              Aspirasi
            </label>
          </div>

          <label htmlFor="judul">Judul Laporan</label>
          <input
            type="text"
            id="judul"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
            placeholder="Contoh: Jalan Rusak di Kecamatan X"
            maxLength={80}
          />

          <label htmlFor="laporan">Isi Laporan</label>
          <textarea
            id="laporan"
            name="laporan"
            value={formData.laporan}
            onChange={handleChange}
            required
            placeholder="Tuliskan detail laporan atau aspirasi Anda di sini..."
            maxLength={1000}
          />

          <label htmlFor="tanggal_kejadian">Tanggal Kejadian</label>
          <input
            type="date"
            id="tanggal_kejadian"
            name="tanggal_kejadian"
            value={formData.tanggal_kejadian}
            onChange={handleChange}
            required
          />

          <label htmlFor="provinsi">Provinsi</label>
          <select
            id="provinsi"
            value={provId}
            onChange={(e) => setProvId(e.target.value)}
            required
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinsi.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>

          <label htmlFor="kabupaten">Kabupaten/Kota</label>
          <select
            id="kabupaten"
            value={kabId}
            onChange={(e) => setKabId(e.target.value)}
            disabled={!kabupaten.length}
            required
          >
            <option value="">-- Pilih Kabupaten/Kota --</option>
            {kabupaten.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>

          <label htmlFor="kecamatan">Kecamatan</label>
          <select
            id="kecamatan"
            name="kecamatan"
            value={formData.kecamatan}
            onChange={handleChange}
            disabled={!kecamatan.length}
            required
          >
            <option value="">-- Pilih Kecamatan --</option>
            {kecamatan.map((kec, idx) => (
              <option key={kec.id || idx} value={kec.nama}>
                {kec.nama}
              </option>
            ))}
          </select>

          <label htmlFor="tujuan">Instansi Tujuan</label>
          <input
            type="text"
            id="tujuan"
            name="tujuan"
            value={formData.tujuan}
            onChange={handleChange}
            required
            placeholder="Contoh: Dinas PUPR"
            maxLength={60}
          />

          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="agama">Agama</option>
            <option value="ekonomi_keuangan">Ekonomi dan Keuangan</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="ketentraman">Ketentraman</option>
            <option value="perlindungan">Perlindungan</option>
          </select>

          <button type="submit" className="btn-laporan-kirim" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Laporan"}
          </button>

          <button
            type="button"
            className="btn-laporan-kembali"
            onClick={() => window.location.href = "/"}
          >
            ← Kembali ke Dashboard
          </button>
        </form>

        {showPreview && (
          <div className="preview-laporan" style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 90,
            background: "#f7fafc",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
            border: "1.5px solid #e5e7eb"
          }}>
            <span style={{
              color: "#2563eb",
              fontWeight: 700,
              fontSize: "1.18rem",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{display:'inline',verticalAlign:'middle'}}>
                <circle cx="12" cy="12" r="12" fill="#2563eb" fillOpacity="0.12"/>
                <path d="M8 12.5l3 3 5-5" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Laporan anda berhasil dikirim
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Laporan;
