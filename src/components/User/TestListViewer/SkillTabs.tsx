import { TabPanel, TabView } from "primereact/tabview"

interface SkillType {
  name: string
  value: string
}

interface SkillTabsProps {
  skillTypes: SkillType[]
  activeSkillTab: number
  setActiveSkillTab: (index: number) => void
}

export default function SkillTabs({ skillTypes, activeSkillTab, setActiveSkillTab }: SkillTabsProps) {
  return (
    <div className="surface-card p-4 shadow-2 border-round mb-4">
      <TabView activeIndex={activeSkillTab} onTabChange={(e) => setActiveSkillTab(e.index)} className="skill-tabs">
        {skillTypes.map((skill, index) => (
          <TabPanel key={skill.value} header={skill.name}>
            {index === activeSkillTab && (
              <div className="mt-3">
                <h3 className="text-lg font-medium text-700">
                  {skill.name === "Tất cả" ? "Tất cả các kỹ năng" : `Đề thi ${skill.name}`}
                </h3>
              </div>
            )}
          </TabPanel>
        ))}
      </TabView>
    </div>
  )
}
