// app/manage-images/page.jsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import getImagesPaginated, { type Images } from "@/actions/getImagesPaginated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

export default function ManageImagesPage() {
  const [isPending, startTransition] = useTransition();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Images | null>(null);
  const [images, setImages] = useState<Images[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5);
  const [hasFetched, setHasFetched] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    startTransition(async () => {
      try {
        const { images: newImages, totalCount } = await getImagesPaginated(
          (currentPage - 1) * itemsPerPage,
          itemsPerPage
        );
        setImages(newImages);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));

        // Initialize loading states for new images
        const newLoadingStates: Record<string, boolean> = {};
        newImages.forEach((img) => {
          newLoadingStates[img.id.toString()] = true;
        });
        setImageLoadingStates(newLoadingStates);

        setHasFetched(true);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        toast.error("Failed to load images. Please try again.");
        setHasFetched(true);
      }
    });
  }, [currentPage, itemsPerPage]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const deleteImage = async (id: number, cloudinaryId: string) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/images/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, cloudinaryId }),
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Delete failed:", error);
          toast.error("Failed to delete image.");
          return;
        }

        const result = await res.json();
        if (result.success) {
          setImages((prev) => prev.filter((img) => img.id !== id));
          setDeleteModalOpen(false);
          toast.success("Image deleted successfully.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting the image.");
      }
    });
  };

  const handleDeleteClick = (image: Images) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      await deleteImage(imageToDelete.id, imageToDelete.cloudinaryId);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImageLoad = (id: number) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [id.toString()]: false,
    }));
  };

  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: itemsPerPage }, (_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-16 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-6 w-24" />
      </TableCell>
    </TableRow>
  ));

  return (
    <div className=" mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Images</h2>
      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left font-medium text-muted-foreground">
                User ID
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium text-muted-foreground">
                Image
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-medium text-muted-foreground">
                Uploaded On
              </TableHead>
              <TableHead className="px-6 py-3 text-right font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              skeletonRows
            ) : images.length > 0 ? (
              images.map((img) => (
                <TableRow key={img.id} className="hover:bg-muted/50 transition">
                  <TableCell className="px-6 py-4 align-middle">
                    {img.userId}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      {imageLoadingStates[img.id.toString()] && (
                        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                      )}
                      <Image
                        src={img.cloudinaryUrl}
                        alt="Generated"
                        width={600}
                        height={600}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoadingStates[img.id.toString()]
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                        onLoad={() => handleImageLoad(img.id)}
                        onError={() => handleImageLoad(img.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    {formatDate(img.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(img)}
                      disabled={isPending}
                      className="px-3 py-2"
                    >
                      {isPending && imageToDelete?.id === img.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash size={16} />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-4 text-center text-muted-foreground"
                >
                  No images found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {hasFetched && (
          <Pagination className="p-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1 || isPending}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        aria-disabled={isPending}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === totalPages || isPending}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* Delete wartsConfirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <h3>Confirm Delete</h3>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
