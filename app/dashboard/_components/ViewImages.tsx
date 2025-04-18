import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import useSWR from "swr";

interface ImageData {
  cloudinaryUrl: string;
}

interface ViewImagesProps {
  apiUrl: string; 
  title: string; 
  imageLimit?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewImages({
  apiUrl,
  title,
  imageLimit = 6,
}: ViewImagesProps) {
  // Fetch the images data
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Loading skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] break-inside-avoid overflow-hidden rounded-lg bg-muted"
              >
                <div className="w-full h-full animate-pulse bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Failed to fetch images, please try again later or refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If no images, show a message
  if (!data?.images || data.images.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary text-2xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No images available.</p>
        </CardContent>
      </Card>
    );
  }

  const images = data?.images.slice(0, imageLimit);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary text-2xl font-bold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images?.map((img: ImageData, i: number) => (
            <div
              key={i}
              className="w-full aspect-[2/3] break-inside-avoid overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={img.cloudinaryUrl}
                alt="Generated"
                width={300}
                height={450}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
