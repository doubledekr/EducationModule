import { Resource } from "@/lib/types";

interface LearningMaterialsProps {
  resources: Resource[];
}

export default function LearningMaterials({ resources }: LearningMaterialsProps) {
  return (
    <div className="mb-8">
      <h2 className="font-nunito font-bold text-lg text-neutral-800 mb-3">Helpful Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-3" 
              style={{ 
                backgroundColor: `${resource.iconBackground}10`
              }}
            >
              <span className="material-icons" style={{ color: resource.iconBackground }}>
                {resource.icon}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800">{resource.title}</h3>
              <p className="text-xs text-neutral-500">{resource.description}</p>
            </div>
            <button className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100">
              <span 
                className="material-icons text-sm"
                style={{ color: resource.iconBackground }}
              >
                arrow_forward
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
