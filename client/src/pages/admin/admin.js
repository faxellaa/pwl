import React, { useEffect, useState } from "react";
import "./admin.scss";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const API_URL_FIREBASE = process.env.REACT_APP_API_URL_FIREBASE || "http://localhost:5000";

function Admin() {
  const [tab, setTab] = useState("pelaporans");
  const [pelaporans, setPelaporans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Proses");
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState({});
  const [newUser, setNewUser] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // ✅ Hanya izinkan admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const tokenResult = await getIdTokenResult(user);
        if (!tokenResult.claims.admin) {
          alert("Akses ditolak. Halaman ini hanya untuk admin.");
          navigate("/");
        }
      } catch (error) {
        console.error("Gagal memeriksa role admin:", error);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchPelaporans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/pelaporan`);
      const data = await res.json();
      setPelaporans(data);
    } catch {
      setPelaporans([]);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL_FIREBASE}/api/admin/firebase-users`);
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch("/data/provinsi.json")
      .then(res => res.json())
      .then(setProvinsiList)
      .catch(() => setProvinsiList([]));
    fetch("/data/kabupaten.json")
      .then(res => res.json())
      .then(setKabupatenList)
      .catch(() => setKabupatenList({}));
  }, []);

  useEffect(() => {
    if (tab === "pelaporans") fetchPelaporans();
    if (tab === "users") fetchUsers();
  }, [tab]);

  const openModal = (id, currentStatus) => {
    setSelectedId(id);
    setSelectedStatus(
      currentStatus === "proses"
        ? "Proses"
        : currentStatus === "sudah terlaksana"
        ? "Sudah Terlaksana"
        : "Proses"
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedId) return;
    await fetch(`${API_URL}/api/pelaporan/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus.toLowerCase() }),
    });
    closeModal();
    fetchPelaporans();
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Email dan password tidak boleh kosong");
      return;
    }
    try {
      const res = await fetch(`${API_URL_FIREBASE}/api/admin/firebase-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const result = await res.json();
      if (result.success) {
        alert("User berhasil ditambahkan");
        setNewUser({ email: "", password: "" });
        fetchUsers();
      } else {
        alert(`Gagal menambahkan user: ${result.message}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menambahkan user.");
    }
  };

  const handleDeleteFirebaseUser = async (uid) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      const res = await fetch(`${API_URL_FIREBASE}/api/admin/firebase-users/${uid}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        alert("User berhasil dihapus");
        fetchUsers();
      } else {
        alert(`Gagal menghapus user: ${result.message}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus user.");
    }
  };

  const getNamaProvinsi = (id) => {
    const prov = provinsiList.find((p) => p.id === id);
    return prov ? prov.nama : id;
  };

  const getNamaKabupaten = (provId, kabId) => {
    const list = kabupatenList[provId] || [];
    const kab = list.find((k) => k.id === kabId);
    return kab ? kab.nama : kabId;
  };

  const filteredPelaporans = pelaporans.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    Object.values(u).join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <div className="nav-tabs">
        <button className={tab === "pelaporans" ? "active" : ""} onClick={() => { setTab("pelaporans"); setFilter(""); }}>
          Pelaporan
        </button>
        <button className={tab === "users" ? "active" : ""} onClick={() => { setTab("users"); setFilter(""); }}>
          User
        </button>
      </div>

      <div className="tab-content">
        <div className="filter-container">
          <input
            type="text"
            placeholder={tab === "pelaporans" ? "Cari pelaporan..." : "Cari user..."}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="admin-filter-input"
          />
        </div>

        {/* === Tab Pelaporans === */}
        {tab === "pelaporans" && !loading && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Jenis</th>
                  <th>Laporan</th>
                  <th>Tanggal Kejadian</th>
                  <th>Provinsi</th>
                  <th>Kabupaten</th>
                  <th>Kecamatan</th>
                  <th>Tujuan</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal Input</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPelaporans.map((p) => (
                  <tr key={p._id}>
                    <td>{p.judul}</td>
                    <td>{p.jenis}</td>
                    <td>{p.laporan}</td>
                    <td>{new Date(p.tanggal_kejadian).toLocaleDateString()}</td>
                    <td>{getNamaProvinsi(p.provinsi)}</td>
                    <td>{getNamaKabupaten(p.provinsi, p.kabupaten)}</td>
                    <td>{p.kecamatan}</td>
                    <td>{p.tujuan}</td>
                    <td>{p.kategori}</td>
                    <td>{p.status}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</td>
                    <td>
                      <button onClick={() => openModal(p._id, p.status)}>Update Status</button>
                    </td>
                  </tr>
                ))}
                {filteredPelaporans.length === 0 && (
                  <tr><td colSpan={12}>Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* === Tab Users === */}
        {tab === "users" && !loading && (
          <>
            <div className="add-user-form" style={{ marginBottom: "1rem" }}>
              <h4>Tambah User Baru</h4>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{ marginRight: 8 }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{ marginRight: 8 }}
              />
              <button onClick={handleAddUser}>Tambah</button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>UID</th>
                    <th>Created At</th>
                    <th>Last Sign In</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.uid}>
                      <td>{u.email}</td>
                      <td>{u.uid}</td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                      <td>{u.lastSignIn ? new Date(u.lastSignIn).toLocaleString() : "-"}</td>
                      <td>
                        <button
                          style={{
                            background: "#e53935",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            cursor: "pointer"
                          }}
                          onClick={() => handleDeleteFirebaseUser(u.uid)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5}>Tidak ada data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* === Modal Status Update === */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3>Update Status Pelaporan</h3>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="Proses">Proses</option>
                <option value="Sudah Terlaksana">Sudah Terlaksana</option>
              </select>
              <div style={{ marginTop: 16 }}>
                <button onClick={handleUpdateStatus} style={{ marginRight: 8 }}>Simpan</button>
                <button onClick={closeModal}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
