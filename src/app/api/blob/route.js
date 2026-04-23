import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const loc = res.headers.get('Location');
    const id = loc ? loc.split('/').pop() : null;
    
    if (!id) throw new Error("Failed to get Blob ID");
    
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new Error("ID missing");

    const res = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`);
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
