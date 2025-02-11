import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user.publicMetadata.userCredit) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          userCredit: 1000,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to initialize user:', error);
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 });
  }
}
