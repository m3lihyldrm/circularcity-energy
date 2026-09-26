export type StationStatus = 'aktif' | 'sinirli' | 'bakimda' | 'baglanti_yok';
export type BatteryReadiness = 'yeterli' | 'sinirli' | 'bakimda';
export type BatteryState = 'Normal' | 'İzleme gerekli' | 'Bakım gerekli' | 'İzolasyona alındı';

export interface SafeEnergyCabinetPublicInfo {
  location: string;
  isLocked: boolean;
  isVentilated: boolean;
  isFireResistant: boolean;
  safetySummary: string;
}

export interface PublicStation {
  stationId: string;
  name: string;
  description: string;
  coordinates: [number, number];
  status: StationStatus;
  lastUpdated: string;
  usbCPorts: number;
  powerOutlets: number;
  wirelessCharging: boolean;
  hvacStatus: string;
  accessibility: string;
  batteryReadiness: BatteryReadiness;
  solarProductionKw: number;
  instantConsumptionKw: number;
  dailyCleanEnergyRatio: number;
  gridFeedEnergyKwh: number;
  indoorTemperature: number;
  indoorHumidity: number;
  airQuality: string;
  maintenanceMessage: string | null;
  energyCabinet: SafeEnergyCabinetPublicInfo;
  distanceKm?: number;
  walkingMinutes?: number;
  isDemoData?: boolean;
  policyNotice?: string;
}

export interface AdminAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  stationId?: string;
  stationName?: string;
}

export interface SecurityCameraInfo {
  activeCount: number;
  systemHealth: string;
  blindSpotWarning: boolean;
}

export interface AdminStationTelemetry {
  moduleId: string;
  batterySerialNumber: string;
  chemistryType: string;
  nominalCapacityAh: number;
  usableCapacityAh: number;
  sohRaw: number;
  socRaw: number;
  cycleCount: number;
  currentVoltageV: number;
  currentAmperageA: number;
  cellTemperatures: number[];
  bmsStatus: string;
  bmsFaultCode: string;
  bmsConnection: string;
  lastMaintenanceDate: string;
  technicalEvaluation: string;
  batteryState: BatteryState;
  cabinetAccessInfo: string;
  cabinetDoorStatus: string;
  energyCabinetDetails: {
    exactPosition: string;
    lockMechanism: string;
    ventilationStatus: string;
    fireSuppressionSystem: string;
    fireRating: string;
    internalTemperature: number;
    tamperSensor: string;
  };
  inverterStatus: string;
  inverterCommands: string[];
  securityCameras: SecurityCameraInfo;
  technicalDiagnostics: string;
  alerts: AdminAlert[];
}

export interface AdminStation extends PublicStation {
  adminOnly: AdminStationTelemetry;
}

export interface FeedbackSubmission {
  feedbackId: string;
  stationId: string;
  stationName: string;
  issueType: string;
  message: string;
  createdAt: string;
  status: string;
}

export interface AiRecommendation {
  id: string;
  stationId: string;
  stationName: string;
  priority: string;
  title: string;
  reason: string;
  expectedImpact: string;
  timestamp: string;
  actionCommand: string;
  status: 'pending' | 'applied' | 'dismissed';
}

export interface EventLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
}

export interface FilterState {
  chargingAvailable: boolean;
  wirelessCharging: boolean;
  powerOutlet: boolean;
  hvacActive: boolean;
  accessible: boolean;
  onlyActive: boolean;
  showNearestOnly: boolean;
  searchQuery: string;
}
