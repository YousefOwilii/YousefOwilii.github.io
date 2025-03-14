'use client';

// Updated ProjectCard component with circular logos
import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  projectUrl: string;
  imageUrl: string;
  companyName: string;
  companyLogo: string;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  projectUrl,
  imageUrl,
  companyName,
  companyLogo,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Generate initials for placeholder
  const initials = companyName 
    ? companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : title
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl">
      {/* Project Image */}
      <div className="relative h-48 w-full">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">{title}</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-white mr-2">
            {logoError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                <span className="text-xs text-gray-500 dark:text-gray-400">{companyName.charAt(0)}</span>
              </div>
            ) : (
              <Image
                src={companyLogo}
                alt={companyName}
                fill
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          <span className="text-white text-sm font-medium">{companyName}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{description}</p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Link */}
        <a 
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          View Project
        </a>
      </div>
    </div>
  );
} 