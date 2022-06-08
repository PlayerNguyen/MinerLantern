import React, { useEffect } from "react";

export function Profile() {
  useEffect(() => {
    console.log("[Profile] Mounted");
  }, []);
  return (
    <div className="profile">
      <h1>Profile</h1>
    </div>
  );
}
