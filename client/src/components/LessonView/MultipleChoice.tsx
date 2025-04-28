import { useState } from "react";
import { Question } from "@/lib/types";

interface MultipleChoiceProps {
  question: Question;
  multiSelect?: boolean;
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultipleChoice({ 
  question, 
  multiSelect = false, 
  onAnswer 
}: MultipleChoiceProps) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (submitted) return;
    
    if (multiSelect) {
      // For multi-select, toggle the selection
      setSelectedOptions(
        selectedOptions.includes(optionIndex)
          ? selectedOptions.filter(index => index !== optionIndex)
          : [...selectedOptions, optionIndex]
      );
    } else {
      // For single select, replace the selection
      setSelectedOptions([optionIndex]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedOptions.length === 0 || submitted) return;
    
    let isCorrect = false;
    
    if (multiSelect && Array.isArray(question.correctAnswer)) {
      // For multi-select, check if selected options match all correct answers
      const correctIndices = question.correctAnswer as number[];
      isCorrect = 
        selectedOptions.length === correctIndices.length && 
        selectedOptions.every(index => correctIndices.includes(index));
    } else if (!multiSelect) {
      // For single select, check if the selected option is correct
      const correctIndex = typeof question.correctAnswer === 'number' 
        ? question.correctAnswer 
        : question.options.indexOf(question.correctAnswer as string);
        
      isCorrect = selectedOptions[0] === correctIndex;
    }
    
    setSubmitted(true);
    onAnswer(isCorrect);
  };
  
  const isOptionCorrect = (optionIndex: number): boolean => {
    if (!submitted) return false;
    
    if (multiSelect && Array.isArray(question.correctAnswer)) {
      return (question.correctAnswer as number[]).includes(optionIndex);
    } else {
      const correctIndex = typeof question.correctAnswer === 'number' 
        ? question.correctAnswer 
        : question.options.indexOf(question.correctAnswer as string);
        
      return optionIndex === correctIndex;
    }
  };
  
  const getOptionClassNames = (optionIndex: number) => {
    const isSelected = selectedOptions.includes(optionIndex);
    
    if (!submitted) {
      return isSelected
        ? "border border-primary rounded-lg p-3 flex items-center bg-primary/5"
        : "border border-neutral-200 rounded-lg p-3 flex items-center";
    }
    
    const isCorrect = isOptionCorrect(optionIndex);
    
    if (isCorrect) {
      return "border border-success rounded-lg p-3 flex items-center bg-success/5";
    } else if (isSelected && !isCorrect) {
      return "border border-error rounded-lg p-3 flex items-center bg-error/5";
    } else {
      return "border border-neutral-200 rounded-lg p-3 flex items-center";
    }
  };
  
  return (
    <div className="mb-6">
      <h3 className="font-nunito font-bold text-lg mb-4">Quick Check</h3>
      
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
        <p className="font-medium text-neutral-800 mb-3">{question.questionText}</p>
        
        <div className="space-y-3 mb-4">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={getOptionClassNames(index)}
              onClick={() => handleOptionSelect(index)}
            >
              <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                selectedOptions.includes(index) 
                  ? submitted && !isOptionCorrect(index)
                    ? "bg-error border border-error"
                    : "bg-primary border border-primary"
                  : "border border-neutral-300"
              }`}>
                {selectedOptions.includes(index) && (
                  <span className="material-icons text-white text-sm">
                    {multiSelect ? 'check' : 'radio_button_checked'}
                  </span>
                )}
                {submitted && isOptionCorrect(index) && !selectedOptions.includes(index) && (
                  <span className="material-icons text-success text-sm">check</span>
                )}
              </div>
              <span className={`${
                selectedOptions.includes(index) && !submitted ? "font-medium" : ""
              }`}>
                {option}
              </span>
            </div>
          ))}
        </div>
        
        {!submitted && (
          <button 
            className="bg-primary text-white font-medium px-4 py-2 rounded-lg w-full"
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
          >
            Check Answer
          </button>
        )}
        
        {submitted && question.explanation && (
          <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Explanation:</span> {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
