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

export interface RailwayEntity { id: string; status: string; updatedAt: string; }
export interface TrainRecord extends RailwayEntity { serviceNumber: string; name: string; origin: string; destination: string; location: string; delayMinutes: number; platform?: string; occupancy?: number; }
export interface DispatchCommand { trainId: string; command: 'dispatch' | 'hold' | 'reroute' | 'stop' | 'release'; target?: string; reason?: string; }
export interface RailwayApiClientOptions { baseUrl?: string; fetchImpl?: typeof fetch; }

const requestId = () => `rail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const id = (value: string) => encodeURIComponent(value);

export class RailwayApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  constructor(options: RailwayApiClientOptions = {}) { this.baseUrl = (options.baseUrl ?? '/api/railway').replace(/\/$/, ''); this.fetchImpl = options.fetchImpl ?? fetch; }

  async request<TResponse = unknown, TBody = unknown>(request: RailwayApiRequest<TBody>): Promise<RailwayApiResponse<TResponse>> {
    const response = await this.fetchImpl(`${this.baseUrl}${request.path}`, { method: request.method, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: request.body === undefined ? undefined : JSON.stringify(request.body) });
    const payload = await response.json().catch(() => undefined);
    if (!response.ok) return { ok: false, error: payload?.error ?? { code: `HTTP_${response.status}`, message: response.statusText || 'Request failed' }, requestId: requestId(), timestamp: new Date().toISOString() };
    return { ok: true, data: payload?.data ?? payload, requestId: payload?.requestId ?? requestId(), timestamp: new Date().toISOString() };
  }

  get<T>(path: string, query?: RailwayApiRequest['query']) {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => value !== undefined && params.set(key, String(value)));
    return this.request<T>({ method: 'GET', path: `${path}${params.toString() ? `?${params}` : ''}` });
  }
  post<T, B = unknown>(path: string, body: B) { return this.request<T, B>({ method: 'POST', path, body }); }
  put<T, B = unknown>(path: string, body: B) { return this.request<T, B>({ method: 'PUT', path, body }); }
  patch<T, B = unknown>(path: string, body: B) { return this.request<T, B>({ method: 'PATCH', path, body }); }
  delete<T>(path: string) { return this.request<T>({ method: 'DELETE', path }); }

  health() { return this.get<{ status: string; service: string }>('/health'); }
  getTrains(query?: RailwayApiRequest['query']) { return this.get<TrainRecord[]>('/trains', query); }
  getTrain(trainId: string) { return this.get<TrainRecord>(`/trains/${id(trainId)}`); }
  dispatch(command: DispatchCommand) { return this.post<{ accepted: boolean }, DispatchCommand>('/dispatch/commands', command); }
  getModuleState(moduleId: string) { return this.get<Record<string, unknown>>(`/modules/${id(moduleId)}`); }
  getServices(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/services', query); }
  getTimetables(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/timetables', query); }
  getRoutes(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/routes', query); }
  getTrackSections(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/track-sections', query); }
  getStations(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/stations', query); }
  getPlatforms(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/platforms', query); }
  getSignals(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/signals', query); }
  getInterlockings(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/interlockings', query); }
  getVehicles(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/vehicles', query); }
  getMaintenance(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/maintenance/work-orders', query); }
  getCrew(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/crew', query); }
  getDuties(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/crew/duties', query); }
  getIncidents(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/incidents', query); }
  getAlerts(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/alerts', query); }
  getKpis(query?: RailwayApiRequest['query']) { return this.get<Record<string, number>>('/analytics/kpis', query); }
  getPunctuality(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/analytics/punctuality', query); }
  getCapacity(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/analytics/capacity', query); }
  getUsers(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/admin/users', query); }
  getAuditLog(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/admin/audit', query); }
  getIntegrations(query?: RailwayApiRequest['query']) { return this.get<unknown[]>('/admin/integrations', query); }
}

export const railwayApi = new RailwayApiClient();
