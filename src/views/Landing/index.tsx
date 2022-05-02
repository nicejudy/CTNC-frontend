import "./landing.scss";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function Landing() {
    return (
        <div className="landing-root">
            <Header />
            <Main />
            <Footer />
        </div>
    );
}

export default Landing;
