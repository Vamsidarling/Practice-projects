import { userAuth } from "./AuthContext";
export function ProfileWrapper()
{
    const {user} = userAuth();

  return (
    <div>
        {/* The PrivateRoute component already ensures that 'user' is not null 
             when this component is rendered. So, the conditional check for 'user' was redundant. */}
        <h2>welcome this is fucking anhoiign  to {user.name}</h2>
      
    </div>
  );
}