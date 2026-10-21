export type RailwayApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RailwayApiRequest<TBody = unknown> {
  method: RailwayApiMethod;
  path: string;
  body?: TBody;
  query?: Record<string, string | number | boolean | undefined>;
}

export interface RailwayApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
  requestId: string;
  timestamp: string;
}

export interface RailwayEntity {
  id: string;
  status: string;
  updatedAt: string;
}

export interface TrainRecord extends RailwayEntity {
  serviceNumber: string;
  name: string;
  origin: string;
  destination: string;
  location: string;
  delayMinutes: number;
  platform?: string;
  occupancy?: number;
}

export interface DispatchCommand {
  trainId: string;
  command: 'dispatch' | 'hold' | 'reroute' | 'stop' | 'release';
  target?: string;
  reason?: string;
}

export interface RailwayApiClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

const requestId = () => `rail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class RailwayApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RailwayApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '/api/railway';
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async request<TResponse = unknown, TBody = unknown>(request: RailwayApiRequest<TBody>): Promise<RailwayApiResponse<TResponse>> {
    const response = await this.fetchImpl(`${this.baseUrl}${request.path}`, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
    });

    const payload = await response.json().catch(() => undefined);
    if (!response.ok) {
      return {
        ok: false,
        error: payload?.error ?? { code: `HTTP_${response.status}`, message: response.statusText },
        requestId: requestId(),
        timestamp: new Date().toISOString(),
      };
    }

    return {
      ok: true,
      data: payload?.data ?? payload,
      requestId: payload?.requestId ?? requestId(),
      timestamp: new Date().toISOString(),
    };
  }

  get<T>(path: string, query?: RailwayApiRequest['query']) {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => value !== undefined && params.set(key, String(value)));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return this.request<T>({ method: 'GET', path: `${path}${suffix}` });
  }

  dispatch(command: DispatchCommand) {
    return this.request<{ accepted: boolean }>({ method: 'POST', path: '/dispatch/commands', body: command });
  }

  getTrains() {
    return this.get<TrainRecord[]>('/trains');
  }

  getTrain(trainId: string) {
    return this.get<TrainRecord>(`/trains/${encodeURIComponent(trainId)}`);
  }

  getModuleState(moduleId: string) {
    return this.get<Record<string, unknown>>(`/modules/${encodeURIComponent(moduleId)}`);
  }
}

export const railwayApi = new RailwayApiClient();
