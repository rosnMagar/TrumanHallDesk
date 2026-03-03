export interface Package {
  packageId: number;
  building: string;
  tracking: string;
  description: string;
  name: string;
  inDate: string;
  outDate: string | null;
  type: 'pickup' | 'forward';
}

export interface Resident {
  id: string;
  name: string;
  building: string;
  room: string;
  phone: string;
}

export interface Equipment {
  id: string;
  name: string;
  available: number;
  total: number;
}

export interface TimeclockEntry {
  id: string;
  workerName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
}

export interface LockoutRequest {
  id: string;
  residentName: string;
  roomNumber: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'completed';
}

export const mockPackages: Package[] = [
  {
    packageId: 1001,
    building: 'Truman',
    tracking: '1Z999AA10123456784',
    description: 'White Amazon Mailer',
    name: 'Smith, John',
    inDate: '2024-01-15',
    outDate: null,
    type: 'pickup',
  },
  {
    packageId: 1002,
    building: 'Kennedy',
    tracking: '1Z999AA10123456785',
    description: 'Brown Box - A',
    name: 'Doe, Jane',
    inDate: '2024-01-14',
    outDate: null,
    type: 'forward',
  },
  {
    packageId: 1003,
    building: 'Truman',
    tracking: '1Z999AA10123456786',
    description: 'Purple Poly Bag - B',
    name: 'Johnson, Bob',
    inDate: '2024-01-13',
    outDate: '2024-01-14',
    type: 'pickup',
  },
  {
    packageId: 1004,
    building: 'Winfield',
    tracking: '1Z999AA10123456787',
    description: 'Small Padded Envelope',
    name: 'Williams, Mary',
    inDate: '2024-01-12',
    outDate: null,
    type: 'pickup',
  },
  {
    packageId: 1005,
    building: 'Truman',
    tracking: '1Z999AA10123456788',
    description: 'Large Box',
    name: 'Brown, David',
    inDate: '2024-01-11',
    outDate: '2024-01-12',
    type: 'forward',
  },
];

export const mockResidents: Record<string, Resident> = {
  'Smith, John': {
    id: 'R001',
    name: 'Smith, John',
    building: 'Truman',
    room: '204A',
    phone: '555-0101',
  },
  'Doe, Jane': {
    id: 'R002',
    name: 'Doe, Jane',
    building: 'Kennedy',
    room: '115B',
    phone: '555-0102',
  },
  'Johnson, Bob': {
    id: 'R003',
    name: 'Johnson, Bob',
    building: 'Truman',
    room: '308C',
    phone: '555-0103',
  },
  'Williams, Mary': {
    id: 'R004',
    name: 'Williams, Mary',
    building: 'Winfield',
    room: '102D',
    phone: '555-0104',
  },
  'Brown, David': {
    id: 'R005',
    name: 'Brown, David',
    building: 'Truman',
    room: '401A',
    phone: '555-0105',
  },
};

export const mockEquipment: Equipment[] = [
  { id: 'E001', name: 'Vacuum Cleaner', available: 3, total: 5 },
  { id: 'E002', name: 'Floor Buffer', available: 1, total: 2 },
  { id: 'E003', name: 'Ladder (6ft)', available: 2, total: 4 },
  { id: 'E004', name: 'Couch Dolly', available: 0, total: 3 },
  { id: 'E005', name: 'Hand Truck', available: 4, total: 6 },
];

export const mockTimeclockEntries: TimeclockEntry[] = [
  { id: 'T001', workerName: 'Alice Johnson', date: '2024-01-15', clockIn: '08:00', clockOut: null },
  { id: 'T002', workerName: 'Bob Smith', date: '2024-01-15', clockIn: '09:00', clockOut: null },
  { id: 'T003', workerName: 'Carol Davis', date: '2024-01-14', clockIn: '08:00', clockOut: '16:00' },
  { id: 'T004', workerName: 'Dan Wilson', date: '2024-01-14', clockIn: '12:00', clockOut: '20:00' },
];

export const mockLockoutRequests: LockoutRequest[] = [
  { id: 'L001', residentName: 'Taylor Green', roomNumber: 'Truman 205', reason: 'Lost key', requestedAt: '2024-01-15 10:30', status: 'pending' },
  { id: 'L002', residentName: 'Morgan Lee', roomNumber: 'Kennedy 312', reason: 'Locked out', requestedAt: '2024-01-15 09:15', status: 'completed' },
];

export const buildings = ['Truman', 'Kennedy', 'Winfield', 'Lincoln', 'Roosevelt'];
