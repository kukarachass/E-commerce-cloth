"use client"

type ImageRow = { url: string; isMain: boolean };

interface ImagesFormSectionProps {
    images: ImageRow[];
    setImages: React.Dispatch<React.SetStateAction<ImageRow[]>>;
    error?: string; // Принимаем уже готовую ошибку для поля "images"
}

export default function ImagesFormSection({ images, setImages, error }: ImagesFormSectionProps) {
    return (
        <div>
            <div className="mb-2 text-sm text-gray-600">Картинки (URL)</div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            {images.map((img, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                    <input
                        value={img.url}
                        placeholder="https://…"
                        onChange={(e) =>
                            setImages(images.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                        }
                        className="border rounded-md px-3 py-2 flex-1"
                    />
                    <label className="text-sm flex items-center gap-1 whitespace-nowrap">
                        <input
                            type="radio"
                            checked={img.isMain}
                            onChange={() =>
                                setImages(images.map((x, j) => ({ ...x, isMain: j === i })))
                            }
                        />
                        главная
                    </label>
                    <button
                        type="button"
                        onClick={() => setImages(images.filter((_, x) => x !== i))}
                        className="px-2 text-gray-500 hover:text-red-600"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() =>
                    setImages([...images, { url: "", isMain: images.length === 0 }])
                }
                className="text-sm text-blue-600"
            >
                + картинка
            </button>
        </div>
    );
}