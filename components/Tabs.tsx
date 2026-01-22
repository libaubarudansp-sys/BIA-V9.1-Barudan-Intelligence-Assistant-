import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  initialActiveTab?: string;
}

interface TabProps {
  label: string;
  children: React.ReactNode;
}

// Tab component (used internally by Tabs, not exported directly)
const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({ children, initialActiveTab }) => {
  const [activeTab, setActiveTab] = useState(
    initialActiveTab || children[0]?.props.label
  );

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {children.map((child) => (
            <button
              key={child.props.label}
              onClick={() => setActiveTab(child.props.label)}
              className={`${
                activeTab === child.props.label
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
            >
              {child.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {children.map((child) =>
          activeTab === child.props.label ? child.props.children : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
export { Tab, type TabProps }; // Export Tab and its props type for use with Tabs