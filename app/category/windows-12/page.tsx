import { CategoryPage } from "@/components/category-page"
import { categoryMetadata } from "@/lib/seo"

export const metadata = categoryMetadata("windows-12")

export default function Page() {
  return <CategoryPage slug="windows-12" />
}
