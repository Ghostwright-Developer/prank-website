import { CategoryPage } from "@/components/category-page"
import { categoryMetadata } from "@/lib/seo"

export const metadata = categoryMetadata("phishing")

export default function Page() {
  return <CategoryPage slug="phishing" />
}
