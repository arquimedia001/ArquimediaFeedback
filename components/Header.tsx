
import React from 'react';
import { ArquimediaLogo } from '../constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="py-8 px-4 sm:px-8 md:px-16 w-full">
      <div className="flex items-center space-x-4">
        <ArquimediaLogo />
        <div>
          <h2 className="text-sm font-medium text-gray-600">Arquimedia</h2>
          <p className="text-xs text-gray-500">Design feedback assistant</p>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-baseline space-x-4 border-b border-gray-200 pb-4">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{title}</h1>
          {subtitle && <h2 className="text-2xl font-normal text-gray-500">{subtitle}</h2>}
        </div>
      </div>
    </header>
  );
};

export default Header;
