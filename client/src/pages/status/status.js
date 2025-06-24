import React, { useEffect, useState } from "react";
import "./status.scss";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function Status() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/pelaporan`)
      .then(res => res.json())
      .then(data => {
        setLaporan(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="status-page-bg">
      <div className="status-card">
        <h2 className="status-title">Status Laporan Anda</h2>
        {loading ? (
          <div>Memuat data...</div>
        ) : laporan.length === 0 ? (
          <div>Tidak ada laporan ditemukan.</div>
        ) : (
          <div className="status-table-responsive">
            <table className="status-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Jenis</th>
                  <th>Tanggal Kejadian</th>
                  <th>Status</th>
                  <th>Tanggal Input</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item) => (
                  <tr key={item._id}>
                    <td>{item.judul}</td>
                    <td>{item.jenis}</td>
                    <td>{new Date(item.tanggal_kejadian).toLocaleDateString()}</td>
                    <td>{item.status}</td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          className="back-button-minimal"
          onClick={() => window.location.href = '/'}
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default Status;