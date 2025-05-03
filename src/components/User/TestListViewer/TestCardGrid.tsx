import type React from "react"
import { TestCard } from "../../../utils/types/type"
import EmptyState from "./EmptyState"
import LoadingState from "./LoadingState"
import TestCardItem from "./TestCardItem"

interface TestCardGridProps {
  testCards: TestCard[] | null
  filterFn: (card: TestCard) => boolean
}

export default function TestCardGrid({ testCards, filterFn }: TestCardGridProps): React.ReactNode {
  if (testCards === null) {
    return <LoadingState />
  }

  const filteredCards = testCards.filter(filterFn)

  if (filteredCards.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid">
      {filteredCards.map((testCard, index) => (
        <div key={`card-${index}`} className="col-12 sm:col-6 lg:col-4 p-2">
          <TestCardItem testCard={testCard} />
        </div>
      ))}
    </div>
  )
}
