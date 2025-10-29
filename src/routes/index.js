import CartComponent from "../components/CartComponent/CartComponent";
import detailProduct from "../components/detailProduct/detailProduct";
import LoginComponent from "../components/LoginComponent/LoginComponent";
import Menu from "../components/MenuComponent/Menu";
import SignupComponent from "../components/SigupComponent/SignupComponent";
import AboutPage from "../pages/AboutPage/AboutPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import homePage from "../pages/homePage";
import MenuPage from "../pages/MenuPage/MenuPage";
import NotfoundPage from "../pages/NotpundPage/NotfoundPage";
import orderPage from "../pages/orderPage";
import ProfilePage from "../pages/ProfilePage";
import AdminLogin from "../pages/AdminPage/AdminLogin";

export const routes = [
    {
        path : '/',
        page: homePage ,
        isShowHeader: true
    } ,
     {
        path : '/profile',
        page: ProfilePage , 
        isShowHeader: true
    } ,
     {
        path : '/order',
        page: orderPage,
        isShowHeader: true
    } ,
    {
        path : '/menu',
        page: MenuPage,
        isShowHeader: true
    } ,
     {
        path : '/login',
        page: LoginComponent,
        isShowHeader: true
    } ,
    {
        path : '/cart',
        page: CartComponent,
        isShowHeader: true
    } ,
     
    {
        path : '/detailProduct/:id',
        page: detailProduct,
        isShowHeader: true
    } ,
     
     {
        path : '/signup',
        page: SignupComponent,
        isShowHeader: true
    } ,
    {
        path : '/contact',
        page: ContactPage,
        isShowHeader: true
    } ,
     {
        path : '/about',
        page: AboutPage,
        isShowHeader: true
    } ,
 
     
    {
        path : '/adminlogin',
        page: AdminLogin,
        isShowHeader: false
    } ,

      {
        path : '*',
        page: NotfoundPage ,
          isShowHeader: false
    } ,
    
    

]

