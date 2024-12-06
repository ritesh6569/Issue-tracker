import Header from "./Header";
import Footer from "../components/Footer";

function Home() {
    return (
        <div className="home-body" >
            <Header />
            <div className="flex h-screen w-full">
                <div className="flex-1 bg-hero bg-cover bg-center bg-no-repeat bg-[url('https://www.parikhandassociates.com/wp-content/uploads/2023/05/Ushahkal-Abhinav-Institute-of-Medical-Sciences-22-683x441.jpg')]">
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Home