"use client";

import React, { useState, KeyboardEvent } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

interface SkillTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({
  skills,
  onChange,
  placeholder = "Add skill...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Container for Bubbles */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-emerald-500/20"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(index)}
              className="text-emerald-500/50 hover:text-red-500 transition-colors"
              title="Remove skill"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-background border border-border py-2.5 pl-9 pr-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-text-muted/50"
        />
      </div>
    </div>
  );
};
