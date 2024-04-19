import NavbarHome from "../components/pages/landing/NavbarHome";
import AuthForm from "./auth-form";

export default function Home() {
  return (
    <>
      <NavbarHome />
      <div className="row">
        <div className="col-6 auth-widget">
          <AuthForm />
        </div>
      </div>
    </>
  );
}
