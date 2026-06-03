import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/client';
import { 
  getInstanceConnectionState, 
  createInstance, 
  connectInstance, 
  logoutInstance 
} from '../services/evolution';

export const whatsappRoutes: FastifyPluginAsync = async (app) => {
  // Add authentication middleware
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Get current connection status and QR code if needed
  app.get('/status', async (request: FastifyRequest, reply: FastifyReply) => {
    const tenantId = (request.user as { tenantId: string }).tenantId;
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return reply.code(404).send({ error: 'Tenant not found' });
    
    // We use a safe instance name just in case, but connection checks DB ID
    const instanceName = tenant.slug;
    
    try {
      const status = await getInstanceConnectionState(tenantId, instanceName);
      let qrCode = undefined;

      return reply.send({
        state: status.instance.state
      });
    } catch (err: any) {
      console.error(err);
      return reply.status(500).send({ error: 'Failed to fetch status' });
    }
  });

  // Get QR Code
  app.get('/qr', async (request, reply) => {
    const { tenantId } = request.user as { tenantId: string };
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found' });

    try {
      const connectData = await connectInstance(tenantId, tenant.slug);
      return reply.send({
        state: 'connecting',
        qrCode: connectData.base64 || null
      });
    } catch (err: any) {
      return reply.send({ state: 'disconnected', qrCode: null });
    }
  });

  // Create instance and connect
  app.post('/connect', async (request, reply) => {
    const { tenantId } = request.user as { tenantId: string };
    
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found' });

    const instanceName = tenant.slug;

    // Check if it already exists
    const status = await getInstanceConnectionState(tenantId, instanceName);

    // If it's totally disconnected (not created), we create it
    if (status.instance.state === 'disconnected') {
      try {
        // Usar um nome único pra garantir que não dê conflito no Evolution Go se ele já existir lá mas não no DB
        const uniqueInstanceName = `${tenant.slug}-${Math.random().toString(36).substring(2, 8)}`;
        await createInstance(tenantId, uniqueInstanceName);
      } catch (err: any) {
        // Ignore if already exists
        console.error('Error creating instance:', err);
      }
    }

    // Now request connection (QR Code)
    try {
      const connectData = await connectInstance(tenantId, instanceName);
      return reply.send({
        state: 'connecting',
        qrCode: connectData.base64
      });
    } catch (err: any) {
      console.error('Connect error:', err);
      return reply.status(500).send({ error: 'Failed to connect to WhatsApp API', details: err.message });
    }
  });

  // Logout / Disconnect
  app.post('/logout', async (request, reply) => {
    const { tenantId } = request.user as { tenantId: string };
    
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return reply.status(404).send({ error: 'Tenant not found' });

    const instanceName = tenant.slug;

    try {
      await logoutInstance(tenantId, instanceName);
      return reply.send({ success: true });
    } catch (err: any) {
      console.error('Logout error:', err.message);
      return reply.status(500).send({ error: 'Failed to disconnect WhatsApp' });
    }
  });
};
