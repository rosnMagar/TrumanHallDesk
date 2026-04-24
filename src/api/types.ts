// ── Shared TypeScript types matching schema.sql ─────────────────────────────

export interface User {
  bannerID: string;
  firstName: string;
  lastName: string;
  homeAddress?: string;
  idPicture?: string;       // S3 object URL
  phoneNumber?: string;
  email?: string;
}

export interface Building {
  buildingID: string;
  streetAddress?: string;
}

export interface Room {
  roomID: string;           // e.g. "McClain101"
  buildingID: string;
  keyCode?: string;
}

export interface Resident {
  residentID?: number;
  user: string;             // bannerID FK
  dateCreated?: string;     // ISO date
  roomID?: string;
  building?: string;
}

export interface DeskWorker {
  workerID?: number;
  user: string;             // bannerID FK
  assignedBuilding?: string;
}

export interface Administrator {
  adminID?: number;
  user: string;             // bannerID FK
  assignedBuilding?: string;
  officeNumber?: string;
  notes?: string;
}

export interface WorksFor {
  workerID: number;
  adminID: number;
}

export interface Equipment {
  equipmentID?: number;
  currentOwner?: number;    // residentID FK
  type?: string;
  checkoutTime?: string;    // ISO datetime
  checkoutStaff?: number;   // workerID FK
  description?: string;
  // Joined fields from getAllEquipment
  borrowerName?: string;
  borrowerBannerID?: string;
  borrowerPhone?: string;
  residentID?: number;
  checkedOut?: 'Y' | 'N';
}

export interface Package {
  uniqueID?: number;
  owner?: number;           // residentID FK
  trackingID?: string;
  receivedDate?: string;    // ISO date
  emailSent?: boolean;
  pickedUp?: boolean;
  type?: string;
  requiresForwarding?: boolean;
}
