const Card = ({ children, className }) => {
    return (
      <div className={`bg-gray-900 text-white p-4 rounded-2xl shadow-md ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  