
const ProgressBar: React.FC = () => {
    const progress = 50; // Example: Replace with dynamic progress
  
    return (
      <div className="progress-bar">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
  




