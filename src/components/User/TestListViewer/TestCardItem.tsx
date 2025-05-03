import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { Tag } from "primereact/tag"
import { Link } from "react-router-dom"
import { TestCard } from "../../../utils/types/type"

interface TestCardItemProps {
  testCard: TestCard
}

export default function TestCardItem({ testCard }: TestCardItemProps) {
  const { id, name, completed, format, totalUser, year } = testCard

  return (
    <Card className="h-full test-card shadow-2 border-round-xl" style={{ transition: "all 0.3s ease" }}>
      <div className="flex flex-column h-full">
        {/* Card Header */}
        <div className="flex justify-content-between align-items-start mb-3">
          <Tag
            value={completed ? "Hoàn thành" : "Chưa thử"}
            severity={completed ? "success" : "warning"}
            className="text-sm"
          />
          <Badge value={totalUser} severity="info" className="p-overlay-badge">
            <i className="pi pi-users text-xl"></i>
          </Badge>
        </div>

        {/* Card Content */}
        <div className="flex-grow-1">
          <h3 className="text-xl font-bold text-900 mb-2 line-clamp-2" title={name}>
            {name}
          </h3>
          <div className="flex align-items-center mb-3">
            <i className="pi pi-calendar mr-2 text-500"></i>
            <span className="text-500 font-medium">{year}</span>
          </div>
          <div className="flex align-items-center">
            <i className="pi pi-file mr-2 text-500"></i>
            <span className="text-500 font-medium">{format}</span>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Card Footer */}
        <div className="flex justify-content-end">
          <Link to={`/test/${id}`} className="no-underline">
            <Button label="Xem chi tiết" icon="pi pi-arrow-right" iconPos="right" className="p-button-rounded" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
