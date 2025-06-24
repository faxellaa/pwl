import React, { useEffect, useState } from "react";
import "./FullScreenLoader.scss";

const FullScreenLoader = ({ isVisible }) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => setShouldRender(false), 500); // ⏱️ durasi fade-out
      return () => clearTimeout(timeout);
    } else {
      setShouldRender(true);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`fullscreen-loader ${!isVisible ? "fade-out" : ""}`}>
      <div className="loader-spinner" />
    </div>
  );
};

export default FullScreenLoader;
