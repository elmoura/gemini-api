import { PrintJobsGateway } from './print-jobs.gateway';
import { PrintStation } from '../enums/print-station';

describe('PrintJobsGateway', () => {
  const tokenService = {
    isTokenValid: jest.fn(),
    decode: jest.fn(),
  };

  let gateway: PrintJobsGateway;
  let middleware: (socket: never, next: (err?: Error) => void) => void;
  let serverMock: {
    use: jest.Mock;
    to: jest.Mock;
    emit: jest.Mock;
    in: jest.Mock;
    fetchSockets: jest.Mock;
  };

  function buildSocket(handshakeOverrides: Record<string, unknown> = {}) {
    return {
      id: 'socket-1',
      data: {},
      join: jest.fn(),
      handshake: {
        auth: {},
        query: {},
        headers: {},
        ...handshakeOverrides,
      },
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = new PrintJobsGateway(tokenService as never);

    serverMock = {
      use: jest.fn((fn) => {
        middleware = fn;
      }),
      to: jest.fn(),
      emit: jest.fn(),
      in: jest.fn(),
      fetchSockets: jest.fn(),
    };
    serverMock.to.mockReturnValue(serverMock);
    serverMock.in.mockReturnValue(serverMock);

    gateway.afterInit(serverMock as never);
    gateway.server = serverMock as never;
  });

  describe('authenticate middleware', () => {
    it('rejeita conexão sem token', () => {
      const socket = buildSocket({ auth: { locationId: 'loc-1' } });
      const next = jest.fn();

      middleware(socket as never, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('rejeita conexão com token inválido', () => {
      tokenService.isTokenValid.mockReturnValue(false);
      const socket = buildSocket({
        auth: { token: 'bad', locationId: 'loc-1' },
      });
      const next = jest.fn();

      middleware(socket as never, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('rejeita conexão sem locationId', () => {
      tokenService.isTokenValid.mockReturnValue(true);
      tokenService.decode.mockReturnValue({
        organizationId: 'org-1',
        userId: 'u1',
      });
      const socket = buildSocket({ auth: { token: 'good' } });
      const next = jest.fn();

      middleware(socket as never, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('rejeita quando locationId do token não bate com o solicitado', () => {
      tokenService.isTokenValid.mockReturnValue(true);
      tokenService.decode.mockReturnValue({
        organizationId: 'org-1',
        userId: 'u1',
        locationId: 'loc-2',
      });
      const socket = buildSocket({
        auth: { token: 'good', locationId: 'loc-1' },
      });
      const next = jest.fn();

      middleware(socket as never, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('aceita token válido e popula socket.data', () => {
      tokenService.isTokenValid.mockReturnValue(true);
      tokenService.decode.mockReturnValue({
        organizationId: 'org-1',
        userId: 'u1',
        locationId: 'loc-1',
      });
      const socket = buildSocket({
        auth: {
          token: 'good',
          locationId: 'loc-1',
          station: PrintStation.BAR,
          deviceId: 'device-1',
        },
      });
      const next = jest.fn();

      middleware(socket as never, next);

      expect(next).toHaveBeenCalledWith();
      expect(socket.data).toEqual({
        organizationId: 'org-1',
        userId: 'u1',
        locationId: 'loc-1',
        station: PrintStation.BAR,
        sourceDeviceId: 'device-1',
      });
    });

    it('usa KITCHEN como estação default quando ausente/inválida', () => {
      tokenService.isTokenValid.mockReturnValue(true);
      tokenService.decode.mockReturnValue({
        organizationId: 'org-1',
        userId: 'u1',
        locationId: 'loc-1',
      });
      const socket = buildSocket({
        auth: { token: 'good', locationId: 'loc-1', station: 'INVALID' },
      });
      const next = jest.fn();

      middleware(socket as never, next);

      expect((socket.data as { station: PrintStation }).station).toBe(
        PrintStation.KITCHEN,
      );
    });
  });

  describe('handleConnection', () => {
    it('entra na room da location e na room da estação', () => {
      const socket = buildSocket();
      socket.data = { locationId: 'loc-1', station: PrintStation.BAR };

      gateway.handleConnection(socket as never);

      expect(socket.join).toHaveBeenCalledWith('location:loc-1');
      expect(socket.join).toHaveBeenCalledWith('location:loc-1:station:BAR');
    });
  });

  describe('emitPrintJobCreated', () => {
    it('emite só para a room de estação do job', () => {
      gateway.emitPrintJobCreated('loc-1', {
        targetStation: PrintStation.BAR,
      } as never);

      expect(serverMock.to).toHaveBeenCalledWith('location:loc-1:station:BAR');
      expect(serverMock.emit).toHaveBeenCalledWith(
        'printJobCreated',
        expect.objectContaining({ targetStation: PrintStation.BAR }),
      );
    });
  });

  describe('listConnectedAgents', () => {
    it('retorna os agentes conectados na room da location', async () => {
      serverMock.fetchSockets.mockResolvedValue([
        {
          id: 's1',
          data: { station: PrintStation.KITCHEN, sourceDeviceId: 'd1' },
        },
      ]);

      const result = await gateway.listConnectedAgents('loc-1');

      expect(serverMock.in).toHaveBeenCalledWith('location:loc-1');
      expect(result).toEqual([
        { socketId: 's1', station: PrintStation.KITCHEN, sourceDeviceId: 'd1' },
      ]);
    });

    it('filtra pela room de estação quando informado', async () => {
      serverMock.fetchSockets.mockResolvedValue([]);

      await gateway.listConnectedAgents('loc-1', PrintStation.BAR);

      expect(serverMock.in).toHaveBeenCalledWith('location:loc-1:station:BAR');
    });
  });
});
