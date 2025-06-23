import GTrainIcon from "../../assets/train-icons/NYCS-bull-trans-G-Std.svg";

const trainIcons = {
  G: GTrainIcon,
  // Future train lines can be added here:
  // A: ATrainIcon,
  // L: LTrainIcon,
  // etc.
};

export default function TrainIcon({ line, className = "", alt }) {
  const iconSrc = trainIcons[line];
  
  if (!iconSrc) {
    // Fallback for unknown train lines
    return (
      <div className={`${className} train-icon-fallback`} style={{
        width: '40px',
        height: '40px',
        backgroundColor: '#6b7280',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        {line}
      </div>
    );
  }
  
  return (
    <img 
      src={iconSrc} 
      alt={alt || `${line} Train`} 
      className={className}
    />
  );
} 