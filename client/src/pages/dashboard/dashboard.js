import React, { Component } from "react";
import "./dasboard.scss";
import logo from '../../image/logo_.png';
import FullScreenLoader from "../../components/FullScreenLoader";

class Dashboard extends Component {
    state = {
        jumlahLaporan: 0,
        jumlahInstansi: 0,
        initialLoading: true, // untuk fullscreen loading awal
        loading: false,       // untuk loading fetch data
    };

    componentDidMount() {
        this.fetchLaporan();
        this.setState({ jumlahInstansi: 12 });
    }

    fetchLaporan = () => {
        this.setState({ loading: true });

        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/pelaporan`)
            .then(res => res.json())
            .then(data => {
                this.setState({ jumlahLaporan: data.length, loading: false, initialLoading: false });
            })
            .catch(() => {
                this.setState({ jumlahLaporan: 0, loading: false, initialLoading: false });
            });
    }

    handleLogout = () => {
        localStorage.removeItem('isLogin');
        window.location.href = '/';
    };

    render() {
        const { jumlahLaporan, jumlahInstansi, loading, initialLoading } = this.state;
        const isLogin = localStorage.getItem('isLogin') === 'true';

        return (
            <>
                <FullScreenLoader isVisible={initialLoading} />

                <div className="dashboard-fullscreen">
                    <nav className="modern-navbar">
                        <div className="modern-navbar-left">
                            <img src={logo} alt="Logo" className="modern-navbar-logo" />
                            <span className="modern-navbar-title">SiPelMasD</span>
                            <button className="modern-navbar-link" onClick={() => document.getElementById("fitur").scrollIntoView({ behavior: "smooth" })}>Fitur</button>
                            <button className="modern-navbar-link" onClick={() => document.getElementById("keunggulan").scrollIntoView({ behavior: "smooth" })}>Keunggulan</button>
                        </div>
                        <div className="modern-navbar-right">
                            {!isLogin ? (
                                <>
                                    <a href="/login" className="modern-navbar-btn modern-navbar-btn-primary">Login</a>
                                    <a href="/register" className="modern-navbar-btn modern-navbar-btn-outline">Register</a>
                                </>
                            ) : (
                                <button className="modern-navbar-btn modern-navbar-btn-outline" onClick={this.handleLogout}>Logout</button>
                            )}
                        </div>
                    </nav>

                    <main className="dashboard-main">
                        <div className="dashboard-bg-poly">
                            {/* SVG background jika ada */}
                        </div>

                        <section className="dashboard-section dashboard-hero-minimal" id="tentang">
                            <h1 className="dashboard-title-minimal">Layanan Aspirasi dan Pengaduan Online Rakyat</h1>
                            <p className="dashboard-desc-minimal">
                                Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
                            </p>

                            <div className="dashboard-stat-total">
                                <div className="dashboard-stat-total-label">JUMLAH LAPORAN SEKARANG</div>
                                <div className="dashboard-stat-total-value">
                                    {loading ? (
                                        <div className="skeleton skeleton-text" style={{ width: 100, height: 30 }}></div>
                                    ) : (
                                        jumlahLaporan
                                    )}
                                </div>
                            </div>

                            <div className="dashboard-stat-instances">
                                <div className="dashboard-stat-instances-title">INSTANSI TERHUBUNG</div>
                                <div className="dashboard-stat-instances-list">
                                    <div className="dashboard-stat-instances-item">
                                        <div className="dashboard-stat-instances-value">48</div>
                                        <div className="dashboard-stat-instances-label">Kementerian</div>
                                    </div>
                                    <div className="dashboard-stat-instances-item">
                                        <div className="dashboard-stat-instances-value">130</div>
                                        <div className="dashboard-stat-instances-label">Lembaga Negara</div>
                                    </div>
                                    <div className="dashboard-stat-instances-item">
                                        <div className="dashboard-stat-instances-value">41</div>
                                        <div className="dashboard-stat-instances-label">Perusahaan BUMN</div>
                                    </div>
                                    <div className="dashboard-stat-instances-item">
                                        <div className="dashboard-stat-instances-value">546</div>
                                        <div className="dashboard-stat-instances-label">Pemerintah Daerah</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="dashboard-section" id="fitur">
                            <h2 className="dashboard-section-title-minimal">Fitur Utama</h2>
                            <div className="dashboard-features-minimal">
                                <div className="feature-card-minimal feature-card-clickable" onClick={() => window.location.href = '/laporan'}>
                                    <span className="feature-icon-minimal" role="img" aria-label="lapor">📝</span>
                                    <h3>Buat Laporan</h3>
                                    <p>Kirim keluhan atau aspirasi Anda dengan mudah dan cepat.</p>
                                </div>
                                <div className="feature-card-minimal feature-card-clickable" onClick={() => window.location.href = '/status'}>
                                    <span className="feature-icon-minimal" role="img" aria-label="status">📊</span>
                                    <h3>Cek Status</h3>
                                    <p>Pantau perkembangan laporan Anda secara real-time.</p>
                                </div>
                                <div className="feature-card-minimal feature-card-clickable" onClick={() => window.location.href = '/login'}>
                                    <span className="feature-icon-minimal" role="img" aria-label="daftar">🔐</span>
                                    <h3>Registrasi & Login</h3>
                                    <p>Proses pendaftaran dan login yang cepat dan aman.</p>
                                </div>
                            </div>
                        </section>

                        <section className="dashboard-section dashboard-advantages-modern" id="keunggulan">
                            <h2 className="dashboard-section-title-minimal">Keunggulan SiPelMasD</h2>
                            <div className="advantages-list-modern">
                                {[{
                                    icon: "✨", title: "Mudah Digunakan", desc: "Antarmuka sederhana dan ramah pengguna."
                                }, {
                                    icon: "🔍", title: "Transparan", desc: "Pantau status dan proses laporan secara terbuka."
                                }, {
                                    icon: "⚡", title: "Real-time", desc: "Notifikasi otomatis setiap perubahan status laporan."
                                }, {
                                    icon: "🔒", title: "Aman", desc: "Data pengguna dijaga dengan keamanan modern."
                                }, {
                                    icon: "🔗", title: "Terintegrasi", desc: "Terhubung langsung ke instansi terkait."
                                }].map((item, i) => (
                                    <div className="advantage-card" key={i}>
                                        <span className="advantage-icon" role="img" aria-label="icon">{item.icon}</span>
                                        <div>
                                            <div className="advantage-title">{item.title}</div>
                                            <div className="advantage-desc">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>

                    <footer className="dashboard-footer-minimal">
                        &copy; {new Date().getFullYear()} SiPelMasD &mdash; Sistem Informasi Pelayanan Masyarakat Digital.
                    </footer>
                </div>
            </>
        );
    }
}

export default Dashboard;
