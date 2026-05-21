import { notFound } from 'next/navigation'

const VALID_CATEGORIES = ['accessories', 'clothing', 'shoes', 'new-items', 'sportswear']

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params

    if (!VALID_CATEGORIES.includes(category)) {
        notFound()
    }
}