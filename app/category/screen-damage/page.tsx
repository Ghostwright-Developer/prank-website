import { CategoryPage } from "@/components/category-page"
import { categoryMetadata } from "@/lib/seo"

export const metadata = categoryMetadata("screen-damage")

export default function Page() {
  return <CategoryPage slug="screen-damage" />
}
