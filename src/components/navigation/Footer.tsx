import React from 'react';

/**
 * Footer component with copyright information
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {currentYear} RRSA India. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0 text-sm text-gray-500">
            Developed by VB Entreprise
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;