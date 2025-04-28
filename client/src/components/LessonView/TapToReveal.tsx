import { useState } from "react";

interface TapToRevealProps {
  title: string;
  hiddenContent: string | string[];
}

export default function TapToReveal({ title, hiddenContent }: TapToRevealProps) {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <div className="bg-primary/5 rounded-xl p-4 mb-4">
      <div className="text-center">
        <h4 className="font-medium text-primary mb-2">{title}</h4>
        {!revealed && (
          <button 
            className="bg-white text-primary text-sm font-medium px-4 py-2 rounded-full shadow-sm"
            onClick={() => setRevealed(true)}
          >
            Tap to Reveal
          </button>
        )}
      </div>
      
      {revealed && (
        <div className="mt-4">
          {typeof hiddenContent === 'string' ? (
            <p>{hiddenContent}</p>
          ) : (
            <ul className="space-y-2">
              {hiddenContent.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
