import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { integrationManager, AVAILABLE_INTEGRATIONS } from '@/lib/integrations';

const prisma = new PrismaClient();

// GET - List available integrations and instances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const includeInstances = searchParams.get('includeInstances') === 'true';

    // Get available integrations
    let availableIntegrations = integrationManager.getAvailableIntegrations();
    
    if (type) {
      availableIntegrations = integrationManager.getIntegrationsByType(type as any);
    }

    const response: any = {
      available: availableIntegrations
    };

    if (includeInstances) {
      response.instances = integrationManager.getInstances();
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Integrations API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

// POST - Create new integration instance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId, name, config } = body;

    if (!integrationId || !name || !config) {
      return NextResponse.json(
        { error: 'Integration ID, name, and config are required' },
        { status: 400 }
      );
    }

    // Validate integration exists
    if (!AVAILABLE_INTEGRATIONS[integrationId]) {
      return NextResponse.json(
        { error: 'Invalid integration ID' },
        { status: 400 }
      );
    }

    // Create integration instance
    const instance = await integrationManager.createInstance(integrationId, name, config);

    // Save to database
    const dbIntegration = await prisma.integration.create({
      data: {
        id: instance.id,
        integrationId: instance.integrationId,
        name: instance.name,
        config: JSON.stringify(instance.config),
        status: instance.status,
        errorMessage: instance.errorMessage
      }
    });

    return NextResponse.json({
      message: 'Integration instance created successfully',
      instance: {
        ...instance,
        id: dbIntegration.id
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create Integration Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create integration instance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update integration instance
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { instanceId, name, config, status } = body;

    if (!instanceId) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    // Update in integration manager
    const updates: any = {};
    if (name) updates.name = name;
    if (config) updates.config = config;
    if (status) updates.status = status;

    const instance = await integrationManager.updateInstance(instanceId, updates);

    // Update in database
    await prisma.integration.update({
      where: { id: instanceId },
      data: {
        ...(name && { name }),
        ...(config && { config: JSON.stringify(config) }),
        ...(status && { status }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Integration instance updated successfully',
      instance
    });

  } catch (error) {
    console.error('Update Integration Error:', error);
    return NextResponse.json(
      { error: 'Failed to update integration instance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete integration instance
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceId = searchParams.get('instanceId');

    if (!instanceId) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    // Delete from integration manager
    const deleted = integrationManager.deleteInstance(instanceId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Integration instance not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.integration.delete({
      where: { id: instanceId }
    });

    return NextResponse.json({
      message: 'Integration instance deleted successfully'
    });

  } catch (error) {
    console.error('Delete Integration Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete integration instance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
