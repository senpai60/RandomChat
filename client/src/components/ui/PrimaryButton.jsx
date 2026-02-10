const PrimaryButton = ({ children, onClick }) => {
  return <button className="btn-primary" onClick={onClick}>{children}</button>;
};

export default PrimaryButton;
