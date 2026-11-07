import { CategoryPage } from "@/components/category-page"
import { categoryMetadata } from "@/lib/seo"

export const metadata = categoryMetadata("os-screens")

export default function Page() {
  return <CategoryPage slug="os-screens" />
}
