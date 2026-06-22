import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center brand-gradient-soft p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-brand-green mb-4">404</h1>
        <p className="text-slate-600 mb-6">Sorry, we couldn't find the page you were looking for.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 brand-btn-primary"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
