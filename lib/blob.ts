import { put, del } from '@vercel/blob';

export async function uploadImageToBlob(base64Image: string, filename: string) {
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Create a blob from the buffer
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    
    // Upload to Vercel Blob
    const { url } = await put(filename, blob, {
      access: 'public',
    });
    
    return { url, success: true };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload image to blob storage');
  }
}

export async function deleteImageFromBlob(blobUrl: string) {
  try {
    await del(blobUrl);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    throw new Error('Failed to delete image from blob storage');
  }
}
