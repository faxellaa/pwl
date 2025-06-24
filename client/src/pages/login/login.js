import React, { Component } from "react";
import "./login.scss";
import { connect } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../config/firebase';
import logo from '../../image/logo_.png';

class Login extends Component {
    state = {
        email: "",
        password: "",
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    handleLogin = () => { 
        const { email, password } = this.state;
        if (!email || !password) {
            alert('Email dan password wajib diisi');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                localStorage.setItem('isLogin', 'true');
                window.location.href = '/admin';
            })
            .catch((error) => {
                alert('Login gagal: ' + error.message);
            });
    };

    render() {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <img
                        src={logo}
                        alt="Login Illustration"
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
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button className="auth-button" onClick={this.handleLogin}>Login</button>
                    <div style={{ marginTop: 22, fontSize: 15 }}>
                        Belum punya akun?{" "}
                        <a href="/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                            Daftar di sini
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popup: state.popup,
        isLogin: state.isLogin
    };
};

export default connect(mapStateToProps, null)(Login);