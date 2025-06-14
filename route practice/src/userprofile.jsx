export function ProfileWrapper() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/Home");
  };

  if (!user) {
    return <Navigate to="/Signin" />;
  }
  return (
    <div className="profile-page-container">
      <div className="profile-preview-card-wrapper" style={{ marginBottom: '2rem' }}>
        <PreviewCard delay={200} closeDelay={300} defaultOpen={false}>
          <PreviewCardTrigger
            render={
              <button
                className="profile-preview-trigger"
                title={user.name || "User Profile"}
              >
                <span className="profile-icon-initials-page">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </span>
              </button>
            }
          />
          <PreviewCardContent
            side="bottom"
            sideOffset={8}
            align="end"
            className="w-72 profile-preview-content-card"
          >
            <div className="flex flex-col gap-3 p-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="preview-card-logout-button"
              >
                Logout
              </button>
            </div>
          </PreviewCardContent>
        </PreviewCard>
      </div>

      <h2 style={{clear: 'both'}}>Welcome to your Profile, {user.name}!</h2>
      <p style={{marginTop: '1rem'}}>
        This is where more detailed user profile information and settings would
        go.
      </p>
    </div>
  );
}