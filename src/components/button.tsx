import React from 'react';

interface IButtonProps {
  buttonClass?: string;
  onClick?: () => void;
  isIcon?: string;
  textValue?: string | number;
}

const Button: React.FC<IButtonProps> = ({ buttonClass, onClick, isIcon, textValue }) => {
  return (
    <button className={buttonClass} onClick={onClick}>
      {isIcon ? (
        <React.Fragment>
          <i className={isIcon}></i>
        </React.Fragment>
      ) : (
        textValue
      )}
    </button>
  );
}

export default Button;
