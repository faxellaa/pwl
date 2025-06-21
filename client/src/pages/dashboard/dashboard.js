import React, { Component } from "react";
import "./dasboard.scss";
import logo from '../../image/logo_.png';

class Dashboard extends Component {
    state = {
        jumlahLaporan: 0,
        jumlahInstansi: 0,
    };

    componentDidMount() {
        // Ambil jumlah laporan dari backend
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/pelaporan`)
            .then(res => res.json())
            .then(data => {
                this.setState({ jumlahLaporan: data.length });
            })
            .catch(() => this.setState({ jumlahLaporan: 0 }));

        // Jumlah instansi bisa di-hardcode atau fetch dari backend jika ada endpoint-nya
        // Contoh hardcode:
        this.setState({ jumlahInstansi: 12 }); // Ganti sesuai jumlah instansi terhubung sebenarnya
    }

    handleLogout = () => {
        localStorage.removeItem('isLogin');
        window.location.href = '/';
    };

    render() {
        const isLogin = localStorage.getItem('isLogin') === 'true';
        const { jumlahLaporan, jumlahInstansi } = this.state;
        return (
            <div className="dashboard-fullscreen">
                {/* NAVBAR */}
                <nav className="modern-navbar">
                    <div className="modern-navbar-left">
                        <img src={logo} alt="Logo" className="modern-navbar-logo" />
                        <span className="modern-navbar-title">SiPelMasD</span>
                        <button
                            className="modern-navbar-link"
                            onClick={() => document.getElementById("fitur").scrollIntoView({ behavior: "smooth" })}
                        >
                            Fitur
                        </button>
                        <button
                            className="modern-navbar-link"
                            onClick={() => document.getElementById("keunggulan").scrollIntoView({ behavior: "smooth" })}
                        >
                            Keunggulan
                        </button>
                    </div>
                    <div className="modern-navbar-right">
                        {!isLogin && (
                            <>
                                <a href="/login" className="modern-navbar-btn modern-navbar-btn-primary">Login</a>
                                <a href="/register" className="modern-navbar-btn modern-navbar-btn-outline">Register</a>
                            </>
                        )}
                        {isLogin && (
                            <button
                                className="modern-navbar-btn modern-navbar-btn-outline"
                                onClick={this.handleLogout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>
                {/* END NAVBAR */}

                <main className="dashboard-main">
                    <div className="dashboard-bg-poly">
                      <svg
                        className="dashboard-bg-poly-svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 1920 1080"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <polygon points="0,0 600,0 400,400" fill="#eaf1fb" opacity="0.35">
                          <animate attributeName="opacity" values="0.35;0.18;0.35" dur="8s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="600,0 1200,0 1000,400" fill="#f4f6fa" opacity="0.22">
                          <animate attributeName="opacity" values="0.22;0.10;0.22" dur="7s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="1200,0 1920,0 1600,400" fill="#dbeafe" opacity="0.18">
                          <animate attributeName="opacity" values="0.18;0.09;0.18" dur="9s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="0,400 400,400 200,900" fill="#f1f5f9" opacity="0.18">
                          <animate attributeName="opacity" values="0.18;0.09;0.18" dur="10s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="400,400 1000,400 700,900" fill="#e0e7ef" opacity="0.13">
                          <animate attributeName="opacity" values="0.13;0.06;0.13" dur="12s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="1000,400 1600,400 1300,900" fill="#eaf1fb" opacity="0.18">
                          <animate attributeName="opacity" values="0.18;0.09;0.18" dur="11s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="1600,400 1920,400 1920,1080 1300,900" fill="#f4f6fa" opacity="0.22">
                          <animate attributeName="opacity" values="0.22;0.10;0.22" dur="8s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="0,900 700,900 0,1080" fill="#eaf1fb" opacity="0.13">
                          <animate attributeName="opacity" values="0.13;0.06;0.13" dur="9s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="700,900 1300,900 1000,1080 0,1080" fill="#f4f6fa" opacity="0.18">
                          <animate attributeName="opacity" values="0.18;0.09;0.18" dur="10s" repeatCount="indefinite" />
                        </polygon>
                        <polygon points="1300,900 1920,1080 1000,1080" fill="#e0e7ef" opacity="0.13">
                          <animate attributeName="opacity" values="0.13;0.06;0.13" dur="12s" repeatCount="indefinite" />
                        </polygon>
                      </svg>
                    </div>

                    {/* Apa itu SiPelMasD */}
                    <section className="dashboard-section dashboard-hero-minimal" id="tentang">
                        <h1 className="dashboard-title-minimal">Layanan Aspirasi dan Pengaduan Online Rakyat</h1>
                        <p className="dashboard-desc-minimal">
                            Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
                        </p>

                        {/* Statistik Jumlah Laporan */}
                        <div className="dashboard-stat-total">
                            <div className="dashboard-stat-total-label">JUMLAH LAPORAN SEKARANG</div>
                            <div className="dashboard-stat-total-value">{jumlahLaporan}</div>
                        </div>

                        {/* Statistik Instansi Terhubung */}
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

                    {/* Fitur */}
                    <section className="dashboard-section" id="fitur">
                        <h2 className="dashboard-section-title-minimal">Fitur Utama</h2>
                        <div className="dashboard-features-minimal">
                            <div
                                className="feature-card-minimal feature-card-clickable"
                                onClick={() => window.location.href = '/laporan'}
                                style={{ cursor: "pointer" }}
                                title="Buat Laporan"
                            >
                                <span className="feature-icon-minimal" role="img" aria-label="lapor">📝</span>
                                <h3>Buat Laporan</h3>
                                <p>Kirim keluhan atau aspirasi Anda dengan mudah dan cepat.</p>
                            </div>
                            <div className="feature-card-minimal" onClick={() => window.location.href = '/admin'}>
                                <span className="feature-icon-minimal" role="img" aria-label="status">📊</span>
                                <h3>Cek Status</h3>
                                <p>Pantau perkembangan laporan Anda secara real-time.</p>
                            </div>
                            <div
                                className="feature-card-minimal feature-card-clickable"
                                onClick={() => window.location.href = '/login'}
                                style={{ cursor: "pointer" }}
                                title="Registrasi & Login"
                            >
                                <span className="feature-icon-minimal" role="img" aria-label="daftar">🔐</span>
                                <h3>Registrasi & Login</h3>
                                <p>Proses pendaftaran dan login yang cepat dan aman.</p>
                            </div>
                        </div>
                    </section>

                    {/* Keunggulan */}
                    <section className="dashboard-section dashboard-advantages-modern" id="keunggulan">
                        <h2 className="dashboard-section-title-minimal">Keunggulan SiPelMasD</h2>
                        <div className="advantages-list-modern">
                            <div className="advantage-card">
                                <span className="advantage-icon" role="img" aria-label="mudah">✨</span>
                                <div>
                                    <div className="advantage-title">Mudah Digunakan</div>
                                    <div className="advantage-desc">Antarmuka sederhana dan ramah pengguna, siapapun dapat mengakses tanpa kesulitan.</div>
                                </div>
                            </div>
                            <div className="advantage-card">
                                <span className="advantage-icon" role="img" aria-label="transparan">🔍</span>
                                <div>
                                    <div className="advantage-title">Transparan</div>
                                    <div className="advantage-desc">Status dan proses laporan dapat dipantau secara terbuka dan real-time.</div>
                                </div>
                            </div>
                            <div className="advantage-card">
                                <span className="advantage-icon" role="img" aria-label="realtime">⚡</span>
                                <div>
                                    <div className="advantage-title">Real-time</div>
                                    <div className="advantage-desc">Update status laporan secara langsung, notifikasi otomatis setiap perubahan.</div>
                                </div>
                            </div>
                            <div className="advantage-card">
                                <span className="advantage-icon" role="img" aria-label="aman">🔒</span>
                                <div>
                                    <div className="advantage-title">Aman</div>
                                    <div className="advantage-desc">Data pengguna dan laporan dijaga kerahasiaannya dengan sistem keamanan modern.</div>
                                </div>
                            </div>
                            <div className="advantage-card">
                                <span className="advantage-icon" role="img" aria-label="terintegrasi">🔗</span>
                                <div>
                                    <div className="advantage-title">Terintegrasi</div>
                                    <div className="advantage-desc">Terhubung langsung dengan instansi terkait untuk penanganan lebih efektif.</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer minimalis */}
                <footer className="dashboard-footer-minimal">
                    &copy; {new Date().getFullYear()} SiPelMasD &mdash; Sistem Informasi Pelayanan Masyarakat Digital.
                </footer>
            </div>
        );
    }
}

export default Dashboard;