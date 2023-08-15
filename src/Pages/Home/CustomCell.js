import React from "react";

export const CustomCell = ({ data, width, onCustomCellClick, index }) => {
  const handleCellClick = () => {
    onCustomCellClick(index, data);
  };

  return (
    <div style={{ width }} onClick={handleCellClick}>
      Alert for {index + 1}
    </div>
  );
};
