
import LandingPage from './Components/LandingPage'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./Components/home.tsx";
import LoginPage from './Components/LoginPage.tsx';
import ChefDashboard from './Components/ChefDashboard.tsx';
import UserList from './Components/UserList.tsx';
import CreateRecipe from './Components/CreateRecipe.tsx';
import Signup from "./Components/Signup.tsx";
import Profile from "./Components/profile.tsx";
import RecipeDetails from "./Components/RecipeDetails.tsx";
import AdminDashboard from "./Components/AdminDashboard.tsx";
import Favourite from "./Components/Favourite.tsx";
import PrivateRoute from "./utilities/PrivateRoute.tsx";
import Unauthorized from "./Components/Unauthorized.tsx";
import ChefList from "./Components/ChefList.tsx";
import {ToastContainer} from "react-toastify";
import MyRecipes from "./Components/MyRecipes.tsx";
import Chefs from "./Components/ViewChefs.tsx";
import UserRecipes from "./Components/UserRecipes.tsx";

function App() {

  return (
      <Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          {/* Define the routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/chefDashboard" element={
            <PrivateRoute allowedRoles={['chef']}>
              <ChefDashboard />
            </PrivateRoute>
          } />
          <Route path="/createRecipe" element={
            <PrivateRoute allowedRoles={['chef']}>
              <CreateRecipe />
            </PrivateRoute>
          } />
          <Route path="/myRecipes" element={
            <PrivateRoute allowedRoles={['chef']}>
              <MyRecipes />
            </PrivateRoute>
          } />
          <Route path="/createRecipe/:id" element={
            <PrivateRoute allowedRoles={['chef']}>
              <CreateRecipe />
            </PrivateRoute>
          } />
          <Route path="/adminDashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/home" element={
            <PrivateRoute allowedRoles={['user']}>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['user', 'chef', 'admin']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/favourite" element={
            <PrivateRoute allowedRoles={['user']}>
              <Favourite />
            </PrivateRoute>
          } />
          <Route path="/viewChefs" element={
            <PrivateRoute allowedRoles={['user']}>
              <Chefs />
            </PrivateRoute>
          } />
          <Route path="/recipeDetails/:id" element={
            <PrivateRoute allowedRoles={['user', 'chef']}>
              <RecipeDetails />
            </PrivateRoute>
          } />
          <Route path="/chefRecipes/:id" element={
            <PrivateRoute allowedRoles={['user']}>
              <UserRecipes />
            </PrivateRoute>
          } />
          <Route path="/userList" element={
            <PrivateRoute allowedRoles={['admin']}>
              <UserList />
            </PrivateRoute>
          } />
          <Route path="/chefList" element={
            <PrivateRoute allowedRoles={['admin']}>
              <ChefList />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
  )
}

export default App
