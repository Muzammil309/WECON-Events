import { NextRequest, NextResponse } from 'next/server';
import { SignageStore } from '@/lib/signageStore';

export async function GET(request: NextRequest) {
  try {
    // Fetch displays and their current content/playlists
    const displays = await SignageStore.listDisplays();
    const content = await SignageStore.listContent();
    const playlists = await SignageStore.listPlaylists();

    // Format displays with current content for public consumption
    const publicDisplays = displays.map(display => {
      // For now, we'll simulate current content assignment
      // In a full implementation, you'd have a DisplayAssignment table
      let currentContent = null;
      let playlist = null;

      // Simple assignment logic - assign content based on display name
      if (display.name.toLowerCase().includes('lobby')) {
        currentContent = content.find(c => c.type === 'TEXT' && c.name.toLowerCase().includes('welcome'));
      } else if (display.name.toLowerCase().includes('hall')) {
        currentContent = content.find(c => c.type === 'TEXT' && c.name.toLowerCase().includes('schedule'));
      } else if (display.name.toLowerCase().includes('exhibition')) {
        currentContent = content.find(c => c.type === 'TEXT' && c.name.toLowerCase().includes('sponsor'));
      }

      // If no specific content found, use the first active content
      if (!currentContent && content.length > 0) {
        currentContent = content.find(c => c.status === 'ACTIVE') || content[0];
      }

      return {
        id: display.id,
        name: display.name,
        location: display.location,
        status: display.status,
        currentContent: currentContent ? {
          id: currentContent.id,
          name: currentContent.name,
          type: currentContent.type,
          url: currentContent.url,
          contentText: currentContent.contentText,
          duration: currentContent.duration
        } : null,
        playlist: playlist ? {
          id: playlist.id,
          name: playlist.name,
          items: playlist.items || []
        } : null,
        lastUpdate: new Date().toISOString()
      };
    });

    return NextResponse.json({
      displays: publicDisplays,
      stats: {
        total: displays.length,
        online: displays.filter(d => d.status === 'ONLINE').length,
        offline: displays.filter(d => d.status === 'OFFLINE').length,
        error: displays.filter(d => d.status === 'ERROR').length
      },
      lastRefresh: new Date().toISOString()
    });

  } catch (error) {
    console.error('Public Signage API Error:', error);
    
    // Return fallback data for demo
    return NextResponse.json({
      displays: [
        {
          id: '1',
          name: 'Main Lobby Display',
          location: 'Main Entrance',
          status: 'ONLINE',
          currentContent: {
            id: 'welcome',
            name: 'Welcome Message',
            type: 'TEXT',
            contentText: 'Welcome to WECON Masawat 2024!\n\nJoin us for an amazing conference experience.\n\n🎯 Innovation • 🤝 Networking • 🚀 Growth',
            duration: 10
          },
          lastUpdate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Conference Hall A',
          location: 'Hall A Entrance',
          status: 'ONLINE',
          currentContent: {
            id: 'schedule',
            name: 'Today\'s Schedule',
            type: 'TEXT',
            contentText: '📅 Today\'s Agenda\n\n🕘 9:00 AM - Opening Keynote\n🕘 10:30 AM - Tech Innovation Panel\n🕘 12:00 PM - Networking Lunch\n🕘 1:30 PM - Workshops\n🕘 3:00 PM - Startup Showcase\n🕘 4:30 PM - Closing Ceremony',
            duration: 15
          },
          lastUpdate: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Exhibition Area',
          location: 'Exhibition Hall',
          status: 'ONLINE',
          currentContent: {
            id: 'sponsors',
            name: 'Sponsor Showcase',
            type: 'TEXT',
            contentText: '🏢 Our Amazing Sponsors\n\n💎 Platinum: TechCorp, InnovateLab\n🥇 Gold: StartupHub, DevTools Inc\n🥈 Silver: CloudSoft, DataFlow\n\nThank you for making WECON possible!',
            duration: 12
          },
          lastUpdate: new Date().toISOString()
        }
      ],
      stats: {
        total: 3,
        online: 3,
        offline: 0,
        error: 0
      },
      lastRefresh: new Date().toISOString()
    });
  }
}
