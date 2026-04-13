import React from "react";

const RenderCounter = () => {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <span className="badge text-bg-primary">{renderCount.current}</span>
  );
};

export default RenderCounter;
