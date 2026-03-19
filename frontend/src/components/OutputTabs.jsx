import { Button } from "@/components/ui/button";

const labels = {
  components: "Components",
  build: "Guidance",
  code: "Code"
};

export default function OutputTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(labels).map(([tab, label]) => (
        <Button
          key={tab}
          type="button"
          size="sm"
          variant={activeTab === tab ? "default" : "outline"}
          onClick={() => setActiveTab(tab)}
          className={activeTab === tab ? "" : "text-slate-200"}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
