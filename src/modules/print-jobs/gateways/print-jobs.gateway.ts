import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TokenService } from '@modules/auth/services/token.service';
import { PrintJob } from '../entities/print-job';
import { PrintStation } from '../enums/print-station';

export type ConnectedAgentInfo = {
  socketId: string;
  station: PrintStation;
  sourceDeviceId?: string;
};

type PrintJobsSocketData = {
  organizationId: string;
  userId: string;
  locationId: string;
  station: PrintStation;
  sourceDeviceId?: string;
};

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/print-jobs',
})
export class PrintJobsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PrintJobsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private tokenService: TokenService) {}

  afterInit(server: Server): void {
    server.use((socket: Socket, next: (err?: Error) => void) =>
      this.authenticate(socket, next),
    );
  }

  handleConnection(client: Socket): void {
    const { locationId, station } = client.data as PrintJobsSocketData;

    void client.join(this.getLocationRoom(locationId));
    void client.join(this.getStationRoom(locationId, station));

    this.logger.log(
      `Print agent joined location=${locationId} station=${station} (${client.id})`,
    );
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Print agent disconnected: ${client.id}`);
  }

  emitPrintJobCreated(locationId: string, job: PrintJob): void {
    if (!this.server) return;

    this.server
      .to(this.getStationRoom(locationId, job.targetStation))
      .emit('printJobCreated', job);
  }

  async listConnectedAgents(
    locationId: string,
    station?: PrintStation,
  ): Promise<ConnectedAgentInfo[]> {
    if (!this.server) return [];

    const room = station
      ? this.getStationRoom(locationId, station)
      : this.getLocationRoom(locationId);

    const sockets = await this.server.in(room).fetchSockets();

    return sockets.map((socket) => {
      const data = socket.data as PrintJobsSocketData;
      return {
        socketId: socket.id,
        station: data.station,
        sourceDeviceId: data.sourceDeviceId,
      };
    });
  }

  private authenticate(socket: Socket, next: (err?: Error) => void): void {
    const token = this.extractToken(socket);

    if (!token) {
      this.logger.warn('Print agent connection rejected: missing token');
      next(new Error('UNAUTHORIZED'));
      return;
    }

    let decoded: {
      organizationId?: string;
      userId?: string;
      locationId?: string;
    };

    try {
      if (!this.tokenService.isTokenValid(token)) {
        throw new Error('invalid token');
      }
      decoded = this.tokenService.decode(token);
    } catch {
      this.logger.warn('Print agent connection rejected: invalid token');
      next(new Error('UNAUTHORIZED'));
      return;
    }

    const locationId = this.extractLocationId(socket);

    if (!locationId) {
      this.logger.warn('Print agent connection rejected: missing locationId');
      next(new Error('LOCATION_REQUIRED'));
      return;
    }

    if (decoded.locationId && decoded.locationId !== locationId) {
      this.logger.warn(
        'Print agent connection rejected: locationId mismatch with token',
      );
      next(new Error('LOCATION_MISMATCH'));
      return;
    }

    const data: PrintJobsSocketData = {
      organizationId: decoded.organizationId,
      userId: decoded.userId,
      locationId,
      station: this.normalizeStation(socket.handshake.auth?.station),
      sourceDeviceId: socket.handshake.auth?.deviceId as string | undefined,
    };

    socket.data = data;
    next();
  }

  private extractToken(socket: Socket): string | undefined {
    const authToken = socket.handshake.auth?.token as string | undefined;
    if (authToken) return authToken;

    const headerAuth = socket.handshake.headers.authorization;
    const [type, token] = headerAuth?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractLocationId(socket: Socket): string | undefined {
    const fromAuth = socket.handshake.auth?.locationId as string | undefined;
    if (fromAuth) return fromAuth;

    const fromQuery = socket.handshake.query.locationId;
    return typeof fromQuery === 'string' ? fromQuery : undefined;
  }

  private normalizeStation(value: unknown): PrintStation {
    const stations = Object.values(PrintStation) as string[];
    return typeof value === 'string' && stations.includes(value)
      ? (value as PrintStation)
      : PrintStation.KITCHEN;
  }

  private getLocationRoom(locationId: string): string {
    return `location:${locationId}`;
  }

  private getStationRoom(locationId: string, station: PrintStation): string {
    return `location:${locationId}:station:${station}`;
  }
}
