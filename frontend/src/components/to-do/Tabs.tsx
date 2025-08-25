import type { TabType,TabsProps } from "../../types/props";

export default function Tabs({ activeTab, setActiveTab, getTabCount }:TabsProps) {
  const tabs: TabType[] = ["all", "pending", "completed"];

  return (
    <div className="flex bg-gray-100 rounded-full p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {tab === "all" ? "All" : tab === "pending" ? "To-Do" : "Completed"} (
          {getTabCount(tab)})
        </button>
      ))}
    </div>
  );
}
