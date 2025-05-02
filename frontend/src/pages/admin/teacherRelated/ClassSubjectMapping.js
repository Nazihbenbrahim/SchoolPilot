import React, { useState, useEffect } from 'react';

const ClassSubjectMapping = ({ 
  sclassesList, 
  subjectsList, 
  initialClassSubjects = [], 
  onChange 
}) => {
  // Structure: { classId: [subjectId1, subjectId2, ...] }
  const [classSubjectMap, setClassSubjectMap] = useState({});
  // Selected classes
  const [selectedClasses, setSelectedClasses] = useState([]);

  // Initialize with any existing data
  useEffect(() => {
    if (initialClassSubjects.length > 0) {
      const initialMap = {};
      const initialSelectedClasses = [];
      
      initialClassSubjects.forEach(mapping => {
        if (mapping.classId) {
          initialSelectedClasses.push(mapping.classId);
          initialMap[mapping.classId] = mapping.subjects || [];
        }
      });
      
      setClassSubjectMap(initialMap);
      setSelectedClasses(initialSelectedClasses);
    }
  }, [initialClassSubjects]);

  // When classes are selected/deselected
  const handleClassChange = (event) => {
    const selectedClassIds = Array.from(
      event.target.selectedOptions, 
      option => option.value
    );
    
    // Create a new map that only includes the selected classes
    const newMap = {};
    selectedClassIds.forEach(classId => {
      // Keep existing subject mappings if the class was already selected
      newMap[classId] = classSubjectMap[classId] || [];
    });
    
    setSelectedClasses(selectedClassIds);
    setClassSubjectMap(newMap);
    
    // Notify parent component of the change
    if (onChange) {
      const mappings = selectedClassIds.map(classId => ({
        classId,
        subjects: newMap[classId]
      }));
      onChange(mappings);
    }
  };

  // When subjects for a specific class are selected/deselected
  const handleSubjectChange = (classId, event) => {
    const selectedSubjectIds = Array.from(
      event.target.selectedOptions, 
      option => option.value
    );
    
    const newMap = {
      ...classSubjectMap,
      [classId]: selectedSubjectIds
    };
    
    setClassSubjectMap(newMap);
    
    // Notify parent component of the change
    if (onChange) {
      const mappings = selectedClasses.map(classId => ({
        classId,
        subjects: newMap[classId] || []
      }));
      onChange(mappings);
    }
  };

  // Filter subjects by class
  const getSubjectsForClass = (classId) => {
    return subjectsList.filter(subject => 
      subject.sclassName && subject.sclassName._id === classId
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2">
          Sélectionner les classes
        </label>
        <select
          multiple
          value={selectedClasses}
          onChange={handleClassChange}
          className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins h-32"
        >
          {sclassesList.map((sclass) => (
            <option key={sclass._id} value={sclass._id}>
              {sclass.sclassName}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1 font-poppins">
          Maintenez Ctrl (ou Command sur Mac) pour sélectionner plusieurs classes.
        </p>
      </div>

      {selectedClasses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Sélectionner les matières pour chaque classe
          </h3>
          
          {selectedClasses.map(classId => {
            const currentClass = sclassesList.find(c => c._id === classId);
            const availableSubjects = getSubjectsForClass(classId);
            
            return (
              <div key={classId} className="p-4 border border-gray-300 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  {currentClass?.sclassName || 'Classe'}
                </h4>
                
                {availableSubjects.length > 0 ? (
                  <div>
                    <select
                      multiple
                      value={classSubjectMap[classId] || []}
                      onChange={(e) => handleSubjectChange(classId, e)}
                      className="w-full px-4 py-2 bg-gray-200/50 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-poppins h-24"
                    >
                      {availableSubjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.subName}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1 font-poppins">
                      Maintenez Ctrl (ou Command sur Mac) pour sélectionner plusieurs matières.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600">
                    Aucune matière disponible pour cette classe. Veuillez d'abord ajouter des matières à cette classe.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassSubjectMapping;
