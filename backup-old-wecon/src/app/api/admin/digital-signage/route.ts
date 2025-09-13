import { NextRequest, NextResponse } from 'next/server';
import { SignageStore } from '@/lib/signageStore';

// GET - Fetch all digital signage displays and content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const displayId = searchParams.get('displayId');
    const contentType = searchParams.get('contentType') || 'all';

    if (displayId) {
      // Get specific display with its current content
      const display = await getDisplayById(displayId);
      return NextResponse.json({ display });
    }

    // Get all displays with their current content
    const displays = await SignageStore.listDisplays();
    const allContent = await SignageStore.listContent();
    const playlists = await SignageStore.listPlaylists();
    const content = contentType === 'all' ? allContent : allContent.filter(c => c.type === contentType.toUpperCase());

    return NextResponse.json({
      displays,
      content,
      playlists,
      stats: {
        totalDisplays: displays.length,
        onlineDisplays: displays.filter(d => d.status === 'ONLINE').length,
        totalContent: content.length,
        activeContent: content.filter(c => c.status === 'ACTIVE').length,
        totalPlaylists: playlists.length
      }
    });

  } catch (error) {
    console.error('Digital Signage GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital signage data' },
      { status: 500 }
    );
  }
}

// POST - Create new display, content, or playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    switch (type) {
      case 'display':
        const newDisplay = await SignageStore.createDisplay(data);
        return NextResponse.json({
          message: 'Display created successfully',
          display: newDisplay
        }, { status: 201 });

      case 'content':
        const newContent = await SignageStore.createContent(data);
        return NextResponse.json({
          message: 'Content created successfully',
          content: newContent
        }, { status: 201 });

      case 'playlist':
        const newPlaylist = await SignageStore.createPlaylist(data);
        return NextResponse.json({
          message: 'Playlist created successfully',
          playlist: newPlaylist
        }, { status: 201 });

      case 'emergency-broadcast':
        const broadcast = { id: Date.now().toString(), ...data, type: 'EMERGENCY', broadcastAt: new Date().toISOString() };
        return NextResponse.json({
          message: 'Emergency broadcast initiated',
          broadcast
        }, { status: 201 });

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Digital Signage POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create digital signage item' },
      { status: 500 }
    );
  }
}

// PUT - Update display, content, or playlist
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'display':
        const updatedDisplay = await SignageStore.updateDisplay(id, data);
        return NextResponse.json({
          message: 'Display updated successfully',
          display: updatedDisplay
        });

      case 'content':
        const updatedContent = await SignageStore.updateContent(id, data);
        return NextResponse.json({
          message: 'Content updated successfully',
          content: updatedContent
        });

      case 'playlist':
        const updatedPlaylist = await SignageStore.updatePlaylist(id, data);
        return NextResponse.json({
          message: 'Playlist updated successfully',
          playlist: updatedPlaylist
        });

      case 'assign-content':
        const assignment = { id: Date.now().toString(), ...data, assignedAt: new Date().toISOString() };
        return NextResponse.json({
          message: 'Content assigned to display successfully',
          assignment
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Digital Signage PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update digital signage item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove display, content, or playlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'display':
        await SignageStore.deleteDisplay(id);
        break;
      case 'content':
        await SignageStore.deleteContent(id);
        break;
      case 'playlist':
        await SignageStore.deletePlaylist(id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
    });

  } catch (error) {
    console.error('Digital Signage DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete digital signage item' },
      { status: 500 }
    );
  }
}

// Helper functions for digital signage operations
async function getAllDisplays() {
  // Mock data for now - in real implementation, this would be stored in database
  return [
    {
      id: '1',
      name: 'Main Entrance Display',
      location: 'Main Entrance',
      status: 'ONLINE',
      currentContent: 'Welcome Message',
      lastUpdate: new Date().toISOString(),
      resolution: '1920x1080',
      orientation: 'LANDSCAPE'
    },
    {
      id: '2',
      name: 'Registration Hall Display',
      location: 'Registration Hall',
      status: 'ONLINE',
      currentContent: 'Schedule Playlist',
      lastUpdate: new Date().toISOString(),
      resolution: '1920x1080',
      orientation: 'LANDSCAPE'
    },
    {
      id: '3',
      name: 'Exhibition Hall Display',
      location: 'Exhibition Hall',
      status: 'OFFLINE',
      currentContent: 'Exhibitor Directory',
      lastUpdate: new Date(Date.now() - 3600000).toISOString(),
      resolution: '1080x1920',
      orientation: 'PORTRAIT'
    }
  ];
}

async function getAllContent(contentType: string) {
  // Mock data for now
  const allContent = [
    {
      id: '1',
      name: 'Welcome Message',
      type: 'IMAGE',
      url: '/signage/welcome.jpg',
      duration: 10,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Event Schedule',
      type: 'VIDEO',
      url: '/signage/schedule.mp4',
      duration: 30,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Emergency Announcement',
      type: 'TEXT',
      content: 'Emergency evacuation procedures...',
      duration: 15,
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    }
  ];

  return contentType === 'all' 
    ? allContent 
    : allContent.filter(c => c.type === contentType.toUpperCase());
}

async function getAllPlaylists() {
  // Mock data for now
  return [
    {
      id: '1',
      name: 'Main Schedule Playlist',
      contentItems: ['1', '2'],
      duration: 40,
      loop: true,
      status: 'ACTIVE'
    }
  ];
}

async function getDisplayById(id: string) {
  const displays = await getAllDisplays();
  return displays.find(d => d.id === id);
}

async function createDisplay(data: any) {
  // In real implementation, save to database
  return {
    id: Date.now().toString(),
    ...data,
    status: 'OFFLINE',
    createdAt: new Date().toISOString()
  };
}

async function createContent(data: any) {
  // In real implementation, save to database
  return {
    id: Date.now().toString(),
    ...data,
    status: 'DRAFT',
    createdAt: new Date().toISOString()
  };
}

async function createPlaylist(data: any) {
  // In real implementation, save to database
  return {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString()
  };
}

async function createEmergencyBroadcast(data: any) {
  // In real implementation, this would override all displays
  return {
    id: Date.now().toString(),
    ...data,
    type: 'EMERGENCY',
    broadcastAt: new Date().toISOString()
  };
}

async function updateDisplay(id: string, data: any) {
  // In real implementation, update in database
  return { id, ...data, updatedAt: new Date().toISOString() };
}

async function updateContent(id: string, data: any) {
  // In real implementation, update in database
  return { id, ...data, updatedAt: new Date().toISOString() };
}

async function updatePlaylist(id: string, data: any) {
  // In real implementation, update in database
  return { id, ...data, updatedAt: new Date().toISOString() };
}

async function assignContentToDisplay(displayId: string, contentId: string, schedule: any) {
  // In real implementation, create assignment in database
  return {
    id: Date.now().toString(),
    displayId,
    contentId,
    schedule,
    assignedAt: new Date().toISOString()
  };
}

async function deleteDisplay(id: string) {
  // In real implementation, delete from database
  console.log(`Deleting display ${id}`);
}

async function deleteContent(id: string) {
  // In real implementation, delete from database
  console.log(`Deleting content ${id}`);
}

async function deletePlaylist(id: string) {
  // In real implementation, delete from database
  console.log(`Deleting playlist ${id}`);
}
