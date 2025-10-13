import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { routes } from "./routes/index"
import Default from "./components/DefaultComponent/Default";
import React from "react";
function App() {
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
