import { NextRequest } from 'next/server';

// Gestionăm conexiunile active pentru fiecare admin (folosind globalThis)
globalThis.adminConnections = globalThis.adminConnections || new Map<string, ReadableStreamDefaultController<Uint8Array>>();
const adminConnections = globalThis.adminConnections;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get('adminId');
  console.log(adminId);

  if (!adminId) {
    return new Response('Missing adminId', { status: 400 });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      console.log(`Connection established for adminId=${adminId}`);
      adminConnections.set(adminId, controller);
      req.signal.addEventListener('abort', () => {
        console.log(`Connection aborted for adminId=${adminId}`);
        // clearInterval(interval);
        controller.close();
        adminConnections.delete(adminId);
      });
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Dezactivează buffering-ul (dacă serverul suportă)
    },
  });
}

export function sendEventToAdmin(adminId: string, data: string) {
  console.log(`Sending event to adminId=${adminId}`);
  const controller = adminConnections.get(adminId);
  if (controller) {
    console.log("controller este tot ok");
  }
  
  if (!controller) {
    console.log(`No active connection for adminId=${adminId}`);
    return;
  }
  controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
}
