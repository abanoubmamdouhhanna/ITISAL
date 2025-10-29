import { User } from "@supabase/supabase-js";

/**
 * Checks if user is logged in based on localStorage
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user data', e);
    return null;
  }
};

/**
 * Logout user by removing localStorage items
 */
export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
};
// export class UserCls{
//   userName:string;
//   password:string
// }
// export async function login(user:UserCls){
//   //console.log(JSON.stringify({ places }));
//   console.log({user})
//   const response = await fetch("http://localhost:5000/auth/login",{
//     method:"POST",
//     body: JSON.stringify({ user }),
//     headers: { 'Content-Type': 'application/json' },
//   });
//   const resData = await response.json();
//   if (!response.ok) {
// ;
//     throw new Error(" Failed to Update UserData");

//   }
//   console.log(resData.message);
//   return resData.message;
// }
export async function login(user: { userName: string; password: string }) {
  console.log({ user });

  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(user), // no longer need `{ user }`
    headers: { 'Content-Type': 'application/json' },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  console.log(resData.message);
  return resData.message;
}
