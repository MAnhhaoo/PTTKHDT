import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  // import {
  //   useQuery,
  // } from '@tanstack/react-query'


import { routes } from "./routes/index"
import Default from "./components/DefaultComponent/Default";
import React from "react";
// import axios from "axios";
function App() {


// useEffect(() => {
//     fetchApi();
//   }, []);

// const fetchApi = async () => {
//   try {
//     const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/api/product/getAllProduct`);

//     console.log("res", res.data);
//     return res.data
//   } catch (err) {
//     console.error("Lỗi gọi API:", err);
//   }
// };

//  const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi , retry: false })

//  console.log("query" , query)



  return (
    <>
     <div>
      <Router>
        <Routes>
          {routes.map((route)=> {
            const Layout = route.isShowHeader ? Default : React.Fragment;
            const Page = route.page
            return (
          <Route  path={route.path} element={
          <Layout>
          <Page/> 
          </Layout>
          }/>

            )
          })}
        </Routes>
      </Router>
     </div>
    </>
  )
}

export default App
