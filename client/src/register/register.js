import React, { Component } from "react";
import "./register.scss";
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from '../image/logo_.png'; // Pastikan path gambar sesuai

class Register extends Component {
    state = {
        email: "",
        password: "",
    };

    handlechangetext = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    }

    handleregistersubmit = () => {
        const { email, password } = this.state;
        if (!email || !password) {
            alert('Email dan password wajib diisi');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Simpan ke database MongoDB
                fetch(`${process.env.REACT_APP_API_URL}/api/user/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                    }),
                })
                .then(res => res.json())
                .then(data => {
                    console.log('✅ User saved to MongoDB:', data);
                })
                .catch(error => {
                    console.error('❌ Gagal simpan user ke MongoDB:', error);
                });

                alert('Akun berhasil dibuat! Silakan login.');
                window.location.href = '/login';
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert('Gagal register: ' + errorMessage);
            });
    }

    render() {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <img
                        src={logo}
                        alt="Register Illustration"
                        style={{ width: 120, marginBottom: 28, marginTop: 8, borderRadius: 12, boxShadow: "0 2px 12px rgba(30,64,175,0.08)" }}
                    />
                    <p style={{ color: "#888", marginBottom: 28, fontSize: 16, fontWeight: 500 }}>
                        Sistem Informasi Pelayanan Masyarakat Digital
                    </p>
                    <div className="input-group">
                        <span className="input-icon" role="img" aria-label="email">📧</span>
                        <input
                            className="auth-input"
                            id="email"
                            placeholder="Email"
                            type="email"
                            onChange={this.handlechangetext}
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-icon" role="img" aria-label="password">🔒</span>
                        <input
                            className="auth-input"
                            id="password"
                            placeholder="Password"
                            type="password"
                            onChange={this.handlechangetext}
                            autoComplete="new-password"
                        />
                    </div>
                    <button onClick={this.handleregistersubmit} className="auth-button">Register</button>
                    <div style={{ marginTop: 22, fontSize: 15 }}>
                        Sudah punya akun?{" "}
                        <a href="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                            Login di sini
                        </a>
                    </div>
                    <button
                        className="back-button-minimal"
                        onClick={() => window.location.href = '/'}
                    >
                        ← Kembali ke Dashboard
                    </button>
                </div>
            </div>
        )
    }
}

export default Register;
