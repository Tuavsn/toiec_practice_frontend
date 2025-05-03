"use client"

import type { PaginatorPageChangeEvent } from "primereact/paginator"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { callGetCategoryLabel, callGetTestCard } from "../api/api"
import SetWebPageTitle from "../utils/helperFunction/setTitlePage"
import type { CategoryLabel, TestCard } from "../utils/types/type"

export function useTestCard() {
  const navigate = useNavigate()
  const [currentFormatIndex, setCurrentFormatIndex] = useState<number>(0)
  const [currentYear, setCurrentYear] = useState<number>(0)
  const [testCards, setTestCards] = useState<TestCard[] | null>(null)
  const [categoryLabels, setCategoryLabels] = useState<CategoryLabel[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const totalItemsRef = useRef<number>(-1)

  const setNewFormat = (index: number) => {
    setCurrentFormatIndex(index)
    setCurrentYear(0)
    setPageIndex(0)
  }

  // Fetch test cards by page
  const fetchTestCardByPage = useCallback(async (selectedFormat: string, selectedYear: number, page: number) => {
    try {
      setTestCards(null)
      const responseData = await callGetTestCard(selectedFormat, selectedYear, page)
      totalItemsRef.current = responseData.data.meta.totalItems
      setTestCards(responseData.data.result)
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    }
  }, [])

  // Initialize category labels
  useLayoutEffect(() => {
    SetWebPageTitle("Thư viện đề thi")

    const fetchCategoryLabels = async () => {
      try {
        const responseData = await callGetCategoryLabel()
        setCategoryLabels(responseData.data)
        await fetchTestCardByPage(responseData.data[0].format, 0, 0)
      } catch (error) {
        console.error("Failed to fetch category labels:", error)
      }
    }

    fetchCategoryLabels()
  }, [])

  // Handle pagination
  const onPageChange = useCallback((event: PaginatorPageChangeEvent) => {
    setPageIndex(event.page)
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    if (categoryLabels.length !== 0) {
      fetchTestCardByPage(categoryLabels[currentFormatIndex].format, currentYear, pageIndex)
    }
  }, [currentFormatIndex, currentYear, pageIndex, categoryLabels, fetchTestCardByPage])

  return {
    currentFormatIndex,
    categoryLabels,
    setCurrentYear,
    totalItemsRef,
    setNewFormat,
    onPageChange,
    currentYear,
    testCards,
    pageIndex,
    navigate,
  }
}
