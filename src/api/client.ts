import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  User, Building, Room, Resident, DeskWorker,
  Administrator, Equipment, Package,
} from './types';

// ── Per-resource API Gateway URLs (fill in .env.local after deploy) ───────────
const baseUrl = (import.meta.env.VITE_API_URL as string) || '';

const URL = {
  users: (baseUrl ? `${baseUrl}/users` : import.meta.env.VITE_USERS_API_URL) as string,
  buildings: (baseUrl ? `${baseUrl}/buildings` : import.meta.env.VITE_BUILDINGS_API_URL) as string,
  rooms: (baseUrl ? `${baseUrl}/rooms` : import.meta.env.VITE_ROOMS_API_URL) as string,
  residents: (baseUrl ? `${baseUrl}/residents` : import.meta.env.VITE_RESIDENTS_API_URL) as string,
  deskWorkers: (baseUrl ? `${baseUrl}/deskWorkers` : import.meta.env.VITE_DESKWORKERS_API_URL) as string,
  administrators: (baseUrl ? `${baseUrl}/administrators` : import.meta.env.VITE_ADMINISTRATORS_API_URL) as string,
  equipment: (baseUrl ? `${baseUrl}/equipment` : import.meta.env.VITE_EQUIPMENT_API_URL) as string,
  packages: (baseUrl ? `${baseUrl}/packages` : import.meta.env.VITE_PACKAGES_API_URL) as string,
  lockouts: (baseUrl ? `${baseUrl}/lockouts` : '') as string,
  admin: (baseUrl ? `${baseUrl}/admin` : '') as string,
};

// ── Auth header ───────────────────────────────────────────────────────────────
async function authHeaders(): Promise<HeadersInit> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

// ── Query string serializer ───────────────────────────────────────────────────
function toQuery(params?: object): string {
  if (!params) return '';
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function apiFetch<T>(base: string, path: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: await authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as T;
}

// ── Shared filter options ─────────────────────────────────────────────────────
interface ListOptions { limit?: number | 'all' }

// ── Users ─────────────────────────────────────────────────────────────────────
type UserFilter = Partial<Pick<User, 'firstName' | 'lastName' | 'email'>> & ListOptions;
export const getUsers = (f?: UserFilter) => apiFetch<User[]>(URL.users, toQuery(f));
export const getUser = (id: string) => apiFetch<User>(URL.users, `/${id}`);
export const createUser = (u: User) => apiFetch<{ bannerID: string }>(URL.users, '', 'POST', u);
export const updateUser = (id: string, u: Partial<User>) => apiFetch<{ updated: boolean }>(URL.users, `/${id}`, 'PUT', u);
export const deleteUser = (id: string) => apiFetch<{ deleted: boolean }>(URL.users, `/${id}`, 'DELETE');
export const getUserUploadUrl = (id: string, extension: string = 'jpg', contentType: string = 'image/jpeg') =>
  apiFetch<{ uploadUrl: string, fileName: string }>(URL.users, `/${id}/upload-url?extension=${extension}&contentType=${encodeURIComponent(contentType)}`, 'GET');

// ── Buildings ─────────────────────────────────────────────────────────────────
type BuildingFilter = Partial<Pick<Building, 'buildingID'>> & ListOptions;
export const getBuildings = (f?: BuildingFilter) => apiFetch<Building[]>(URL.buildings, toQuery(f));
export const getBuilding = (id: string) => apiFetch<Building>(URL.buildings, `/${id}`);
export const createBuilding = (b: Building) => apiFetch<{ buildingID: string }>(URL.buildings, '', 'POST', b);
export const updateBuilding = (id: string, b: Partial<Building>) => apiFetch<{ updated: boolean }>(URL.buildings, `/${id}`, 'PUT', b);
export const deleteBuilding = (id: string) => apiFetch<{ deleted: boolean }>(URL.buildings, `/${id}`, 'DELETE');

// ── Rooms ─────────────────────────────────────────────────────────────────────
type RoomFilter = Partial<Pick<Room, 'buildingID'>> & ListOptions;
export const getRooms = (f?: RoomFilter) => apiFetch<Room[]>(URL.rooms, toQuery(f));
export const getRoom = (id: string) => apiFetch<Room>(URL.rooms, `/${id}`);
export const createRoom = (r: Room) => apiFetch<{ roomID: string }>(URL.rooms, '', 'POST', r);
export const updateRoom = (id: string, r: Partial<Room>) => apiFetch<{ updated: boolean }>(URL.rooms, `/${id}`, 'PUT', r);
export const deleteRoom = (id: string) => apiFetch<{ deleted: boolean }>(URL.rooms, `/${id}`, 'DELETE');

// ── Residents ─────────────────────────────────────────────────────────────────
type ResidentFilter = Partial<Pick<Resident, 'user' | 'building' | 'roomID'>> & ListOptions;
export const getResidents = (f?: ResidentFilter) => apiFetch<Resident[]>(URL.residents, toQuery(f));
export const getResident = (id: number) => apiFetch<Resident>(URL.residents, `/${id}`);
export const createResident = (r: Omit<Resident, 'residentID'>) => apiFetch<{ residentID: number }>(URL.residents, '', 'POST', r);
export const updateResident = (id: number, r: Partial<Resident>) => apiFetch<{ updated: boolean }>(URL.residents, `/${id}`, 'PUT', r);
export const deleteResident = (id: number) => apiFetch<{ deleted: boolean }>(URL.residents, `/${id}`, 'DELETE');

// ── Desk Workers ──────────────────────────────────────────────────────────────
type DeskWorkerFilter = Partial<Pick<DeskWorker, 'user' | 'assignedBuilding'>> & ListOptions;
export const getDeskWorkers = (f?: DeskWorkerFilter) => apiFetch<DeskWorker[]>(URL.deskWorkers, toQuery(f));
export const getDeskWorker = (id: number) => apiFetch<DeskWorker>(URL.deskWorkers, `/${id}`);
export const createDeskWorker = (d: Omit<DeskWorker, 'workerID'>) => apiFetch<{ workerID: number }>(URL.deskWorkers, '', 'POST', d);
export const updateDeskWorker = (id: number, d: Partial<DeskWorker>) => apiFetch<{ updated: boolean }>(URL.deskWorkers, `/${id}`, 'PUT', d);
export const deleteDeskWorker = (id: number) => apiFetch<{ deleted: boolean }>(URL.deskWorkers, `/${id}`, 'DELETE');

// ── Administrators ────────────────────────────────────────────────────────────
type AdminFilter = Partial<Pick<Administrator, 'user' | 'assignedBuilding'>> & ListOptions;
export const getAdministrators = (f?: AdminFilter) => apiFetch<Administrator[]>(URL.administrators, toQuery(f));
export const getAdministrator = (id: number) => apiFetch<Administrator>(URL.administrators, `/${id}`);
export const createAdministrator = (a: Omit<Administrator, 'adminID'>) => apiFetch<{ adminID: number }>(URL.administrators, '', 'POST', a);
export const updateAdministrator = (id: number, a: Partial<Administrator>) => apiFetch<{ updated: boolean }>(URL.administrators, `/${id}`, 'PUT', a);
export const deleteAdministrator = (id: number) => apiFetch<{ deleted: boolean }>(URL.administrators, `/${id}`, 'DELETE');

// ── Equipment ─────────────────────────────────────────────────────────────────
// TODO: When switching to Cognito UUID as primary key:
// - Update getAvailableEquipment parameter and filtering approach
// - Update workerID lookup to use new user identifier
type EquipmentFilter = Partial<Pick<Equipment, 'currentOwner' | 'checkoutStaff' | 'type'>> & ListOptions;
export const getAllEquipment = (f?: EquipmentFilter) =>
  apiFetch<Equipment[]>(URL.equipment, toQuery(f));
export const getEquipment = (id: number) => apiFetch<Equipment>(URL.equipment, `/${id}`);
export const createEquipment = (data: { type: string, description?: string }) =>
  apiFetch<{ success: true, equipmentID: number }>(URL.equipment, '', 'POST', data);

export const checkoutEquipment = async (
  equipmentID: number,
  bannerID: string
) => {
  return apiFetch<{ success: boolean }>(
    URL.equipment, '/checkout', 'POST',
    { equipmentID, bannerID }
  );
};

export const checkinEquipment = (equipmentID: number) =>
  apiFetch<{ success: boolean }>(URL.equipment, '/checkin', 'POST', { equipmentID });

interface ResidentInfo {
  residentID: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const getResidentByBannerId = (bannerID: string) =>
  apiFetch<ResidentInfo | null>(URL.equipment, '/resident', 'POST', { bannerID });

export const getAvailableEquipment = async () => {
  const all = await getAllEquipment();
  // Filter to items where checkedOut is NOT 'Y' (available)
  return all.filter(e => e.checkedOut !== 'Y');
};

// ── Admin ─────────────────────────────────────────────────────────────────────
interface ProvisionWorkerPayload {
  firstName: string;
  lastName: string;
  email: string;
  assignedBuilding?: string;
}
export const provisionWorker = (data: ProvisionWorkerPayload) => apiFetch<{ message: string, bannerID: string, cognitoID: string }>(URL.admin, '/provision', 'POST', data);

// ── Packages ──────────────────────────────────────────────────────────────────
type PackageFilter = Partial<Pick<Package, 'owner' | 'type' | 'pickedUp' | 'emailSent' | 'requiresForwarding'>> & ListOptions;
export const getPackages = (f?: PackageFilter) => apiFetch<Package[]>(URL.packages, toQuery(f));
export const getPackage = (id: number) => apiFetch<Package>(URL.packages, `/${id}`);
export const createPackage = (p: Omit<Package, 'uniqueID'>) => apiFetch<{ uniqueID: number }>(URL.packages, '', 'POST', p);
export const updatePackage = (id: number, p: Partial<Package>) => apiFetch<{ updated: boolean }>(URL.packages, `/${id}`, 'PUT', p);
export const deletePackage = (id: number) => apiFetch<{ deleted: boolean }>(URL.packages, `/${id}`, 'DELETE');

// ── Lockouts ──────────────────────────────────────────────────────────────────
interface CreateLockoutPayload {
  ownerBannerID: string;
  checkoutBannerID: string;
  keyNumber: string;
  phoneNumber?: string;
}
export const createLockout = (data: CreateLockoutPayload) => apiFetch<{ message: string, equipmentID: number }>(URL.lockouts, '', 'POST', data);

