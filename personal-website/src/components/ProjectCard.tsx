'use client';

import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  companyLogo?: string;
  companyName?: string;
  technologies: string[];
  projectUrl: string;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  companyLogo,
  companyName,
  technologies,
  projectUrl,
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
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:shadow-xl">
      <div className="h-48 relative">
        {imageUrl && !imageError ? (
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {initials}
            </span>
          </div>
        )}
        
        {/* Company logo overlay */}
        {companyName && (
          <div className="absolute bottom-3 right-3 w-12 h-12 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md overflow-hidden">
            <div className="relative h-full w-full">
              {companyLogo && !logoError ? (
                <Image
                  src={companyLogo}
                  alt={companyName || title}
                  fill
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700">
                  <span className="text-white text-sm font-bold">{initials}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        {companyName && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            {companyName}
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        <a 
          href={projectUrl} 
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project →
        </a>
      </div>
    </div>
  );
} 