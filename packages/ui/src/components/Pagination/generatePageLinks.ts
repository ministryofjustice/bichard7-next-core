export type PageLabel = "Ellipsis" | "Next" | "Previous" | number
export type PageLink = { destinationPage?: number; label: PageLabel }

// Returns an list of elements to display in the pagination widget
// Page numbers are 1-indexed
// totalPages should be >= 0 and currentPage should be >=0 and <= totalPages
export const generatePageLinks = (currentPage: number, totalPages: number): PageLink[] => {
  const labels: PageLink[] = []

  // Don't show any pagination controls if there's only one page
  if (totalPages < 2) {
    return []
  }

  // Previous page arrow
  if (currentPage > 1) {
    labels.push({
      destinationPage: currentPage - 1,
      label: "Previous"
    })
  }

  // First page
  if (currentPage > 2) {
    labels.push({ destinationPage: 1, label: 1 })
  }

  // Abridged gap between first page and previous page
  if (currentPage > 3) {
    labels.push({ label: "Ellipsis" })
  }

  // Previous page
  if (currentPage > 1) {
    labels.push({ destinationPage: currentPage - 1, label: currentPage - 1 })
  }

  // Current page
  if (currentPage > 0) {
    labels.push({ label: currentPage })
  }

  // Next page
  if (currentPage < totalPages) {
    labels.push({ destinationPage: currentPage + 1, label: currentPage + 1 })
  }

  // Abridged gap between next and last page
  if (currentPage < totalPages - 2) {
    labels.push({ label: "Ellipsis" })
  }

  // Last page
  if (currentPage < totalPages - 1) {
    labels.push({ destinationPage: totalPages, label: totalPages })
  }

  // Next page arrow
  if (currentPage < totalPages) {
    labels.push({ destinationPage: currentPage + 1, label: "Next" })
  }

  return labels
}
