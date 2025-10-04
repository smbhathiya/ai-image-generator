import { saveGeneratedImage } from '@/actions/saveImageActions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { base64Image, prompt } = await req.json();

    if (!base64Image || !prompt) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const saved = await saveGeneratedImage({ base64Image, prompt });

    return NextResponse.json({ success: true, image: saved.image });
  } catch (error) {
    console.error('Save image error:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}
