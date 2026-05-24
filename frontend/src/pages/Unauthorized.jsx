import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h1 className="display-6">403 — Yetkisiz Erişim</h1>
        <p className="text-muted">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        <Link to="/login" className="btn btn-primary">
          Giriş Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}
