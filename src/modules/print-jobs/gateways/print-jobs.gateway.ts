import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrintJob } from '../entities/print-job';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/print-jobs',
})
export class PrintJobsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PrintJobsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    const locationId = client.handshake.query.locationId;

    if (typeof locationId !== 'string' || !locationId) {
      this.logger.warn('Print agent connected without locationId');
      client.disconnect();
      return;
    }

    const room = this.getLocationRoom(locationId);
    void client.join(room);
    this.logger.log(`Print agent joined room ${room}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Print agent disconnected: ${client.id}`);
  }

  emitPrintJobCreated(locationId: string, job: PrintJob): void {
    if (!this.server) return;

    this.server
      .to(this.getLocationRoom(locationId))
      .emit('printJobCreated', job);
  }

  private getLocationRoom(locationId: string): string {
    return `location:${locationId}`;
  }
}
