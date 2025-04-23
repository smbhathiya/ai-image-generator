"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { getUsers } from "@/actions/userActions";
import getImagesPaginated from "@/actions/getImagesPaginated";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

// Type definitions
type User = {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  subscription: boolean | null;
};

type ImageItem = {
  id: number;
  userId: number;
  cloudinaryId: string;
  cloudinaryUrl: string;
  createdAt: Date | null;
};

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Modal state
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null); // Image to be deleted

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
    getImagesPaginated().then((data) => setImages(data));
  }, []);

  const deleteImage = async (id: number, cloudinaryId: string) => {
    setIsLoading(true); // Set button loading state to true
    const res = await fetch("/api/images/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, cloudinaryId }),
    });

    if (!res.ok) {
      console.error("Delete failed", await res.json());
      setIsLoading(false); // Reset loading state
    } else {
      const result = await res.json();
      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setDeleteModalOpen(false); // Close the modal on successful delete
      }
    }
  };

  const handleDeleteClick = (image: ImageItem) => {
    setImageToDelete(image);
    setDeleteModalOpen(true); // Open the modal
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      await deleteImage(imageToDelete.id, imageToDelete.cloudinaryId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((img) => (
                  <TableRow key={img.id}>
                    <TableCell>{img.userId}</TableCell>
                    <TableCell>
                      <Image
                        src={img.cloudinaryUrl}
                        alt="Generated"
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(img)}
                        disabled={isLoading} // Disable the button while loading
                      >
                        {isLoading && imageToDelete?.id === img.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
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
                onClick={() => setDeleteModalOpen(false)} // Close the modal
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete} // Confirm the delete
                disabled={isLoading} // Disable while processing
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
