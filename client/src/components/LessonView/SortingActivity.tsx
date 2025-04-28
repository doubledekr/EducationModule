import { useState, useRef } from "react";
import { SortingActivity as SortingActivityType } from "@/lib/types";

interface SortingActivityProps {
  activity: SortingActivityType;
  onComplete: (isCorrect: boolean) => void;
}

export default function SortingActivity({ activity, onComplete }: SortingActivityProps) {
  const [categorizedItems, setCategorizedItems] = useState<Record<string, string[]>>(
    activity.categories.reduce((acc, category) => {
      acc[category.name] = [...category.items]; // Start with pre-sorted items
      return acc;
    }, {} as Record<string, string[]>)
  );
  
  const [unsortedItems, setUnsortedItems] = useState<string[]>(
    activity.unsortedItems.map(item => item.item)
  );
  
  const [currentDragItem, setCurrentDragItem] = useState<string | null>(null);
  const [dragSourceType, setDragSourceType] = useState<'unsorted' | 'category' | null>(null);
  const [dragSourceCategory, setDragSourceCategory] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleDragStart = (
    item: string, 
    sourceType: 'unsorted' | 'category', 
    sourceCategory: string | null = null
  ) => {
    setCurrentDragItem(item);
    setDragSourceType(sourceType);
    setDragSourceCategory(sourceCategory);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetCategory: string) => {
    if (!currentDragItem) return;
    
    // If dragging from unsorted items
    if (dragSourceType === 'unsorted') {
      setCategorizedItems({
        ...categorizedItems,
        [targetCategory]: [...categorizedItems[targetCategory], currentDragItem]
      });
      
      setUnsortedItems(unsortedItems.filter(item => item !== currentDragItem));
    } 
    // If dragging from another category
    else if (dragSourceType === 'category' && dragSourceCategory) {
      // Remove from source category
      const updatedSourceItems = categorizedItems[dragSourceCategory].filter(
        item => item !== currentDragItem
      );
      
      // Add to target category
      setCategorizedItems({
        ...categorizedItems,
        [dragSourceCategory]: updatedSourceItems,
        [targetCategory]: [...categorizedItems[targetCategory], currentDragItem]
      });
    }
    
    // Reset drag state
    setCurrentDragItem(null);
    setDragSourceType(null);
    setDragSourceCategory(null);
  };
  
  const handleUnsortedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!currentDragItem || dragSourceType !== 'category' || !dragSourceCategory) return;
    
    // Remove from source category
    const updatedCategorizedItems = {
      ...categorizedItems,
      [dragSourceCategory]: categorizedItems[dragSourceCategory].filter(
        item => item !== currentDragItem
      )
    };
    
    // Add back to unsorted
    setCategorizedItems(updatedCategorizedItems);
    setUnsortedItems([...unsortedItems, currentDragItem]);
    
    // Reset drag state
    setCurrentDragItem(null);
    setDragSourceType(null);
    setDragSourceCategory(null);
  };
  
  const handleCheck = () => {
    // Check if all items are correctly sorted
    let allCorrect = true;
    
    for (const unsortedItem of activity.unsortedItems) {
      const { item, correctCategory } = unsortedItem;
      
      // Check if item is in the correct category
      const isInCorrectCategory = categorizedItems[correctCategory]?.includes(item);
      
      if (!isInCorrectCategory) {
        allCorrect = false;
        break;
      }
    }
    
    setSubmitted(true);
    onComplete(allCorrect);
  };
  
  return (
    <div className="mb-6">
      <h3 className="font-nunito font-bold text-lg mb-4">{activity.title}</h3>
      
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
        <p className="font-medium text-neutral-800 mb-3">
          Sort these items into the correct categories:
        </p>
        
        <div className="space-y-4 mb-4">
          {activity.categories.map(category => (
            <div 
              key={category.name}
              className="border-2 border-dashed border-neutral-300 rounded-lg p-3"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(category.name)}
            >
              <h4 className="font-medium text-neutral-700 mb-2">{category.name}</h4>
              <div className="min-h-12 space-y-2">
                {categorizedItems[category.name]?.map(item => (
                  <div 
                    key={item}
                    className="bg-neutral-100 rounded-lg p-2 text-sm"
                    draggable={!submitted}
                    onDragStart={() => handleDragStart(item, 'category', category.name)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {unsortedItems.length > 0 && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleUnsortedDrop}
            >
              <h4 className="font-medium text-neutral-700 mb-2">Drag these items:</h4>
              <div className="flex flex-wrap gap-2">
                {unsortedItems.map(item => {
                  // Find the matching unsorted item to get correct category
                  const matchingItem = activity.unsortedItems.find(
                    unsortedItem => unsortedItem.item === item
                  );
                  
                  // Determine background color based on the correct category
                  const colors = {
                    primary: "bg-primary/10 border border-primary",
                    secondary: "bg-secondary/10 border border-secondary",
                    accent: "bg-accent/10 border border-accent"
                  };
                  
                  const categoryIndex = activity.categories.findIndex(
                    cat => cat.name === matchingItem?.correctCategory
                  );
                  
                  const colorClass = categoryIndex === 0 
                    ? colors.primary 
                    : categoryIndex === 1 
                      ? colors.secondary 
                      : colors.accent;
                  
                  return (
                    <div 
                      key={item}
                      className={`${colorClass} rounded-lg p-2 text-sm`}
                      draggable={!submitted}
                      onDragStart={() => handleDragStart(item, 'unsorted')}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {!submitted && unsortedItems.length === 0 && (
          <button 
            className="w-full bg-primary text-white font-bold py-2 rounded-lg shadow-sm"
            onClick={handleCheck}
          >
            Check Answers
          </button>
        )}
        
        {submitted && (
          <div className="p-3 rounded-lg bg-success/10 text-success font-medium">
            Great job! You've sorted all items correctly.
          </div>
        )}
      </div>
    </div>
  );
}
