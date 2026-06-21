export interface Bride {
  id: string;
  name: string;
  weddingDate: string;
  venue: string;
  venueType: 'church' | 'outdoor' | 'hotel' | 'garden';
  height: number;
  currentWeight: number;
  isPregnant: boolean;
  dueDate?: string;
  shoeHeelHeight: number;
  avatar?: string;
}

export interface BodyMeasurements {
  id: string;
  date: string;
  shoulderWidth: number;
  bust: number;
  waist: number;
  hips: number;
  weight: number;
  armLength?: number;
  backLength?: number;
  notes?: string;
}

export type Silhouette = 'A-line' | 'mermaid' | 'ballgown' | 'sheath';
export type FabricType = 'satin' | 'lace' | 'tulle' | 'chiffon' | 'organza';
export type TrainLength = 'none' | 'short' | 'medium' | 'long' | 'cathedral';
export type SleeveStyle = 'cap' | 'short' | 'long' | 'off-shoulder' | 'sleeveless';

export interface DressStyle {
  id: string;
  name: string;
  silhouette: Silhouette;
  fabric: FabricType;
  trainLength: TrainLength;
  hasDetachableSleeves: boolean;
  sleeveStyle?: SleeveStyle;
  neckline: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface FabricSwatch {
  id: string;
  name: string;
  type: FabricType;
  color: string;
  texture: string;
  description: string;
  priceLevel: number;
  sheen: 'matte' | 'satin' | 'silk' | 'shiny';
  drape: 'stiff' | 'structured' | 'flowing' | 'soft';
}

export type FittingStatus = 'upcoming' | 'completed' | 'in-progress';

export interface FittingRound {
  id: string;
  roundNumber: number;
  date: string;
  status: FittingStatus;
  title: string;
  description: string;
  photos: FittingPhoto[];
  consultantNotes: string;
  mobilityDifficulty: number;
  ceremonyMovement: string;
  familyOpinions: string;
  changes: ChangeItem[];
  consultantName: string;
}

export type PhotoAngle = 'front' | 'side' | 'back' | 'detail';

export interface FittingPhoto {
  id: string;
  url: string;
  angle: PhotoAngle;
  annotations: Annotation[];
}

export type AnnotationType = 'change' | 'note' | 'praise';

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: AnnotationType;
  author: string;
  createdAt: string;
}

export type ChangeStatus = 'pending' | 'approved' | 'in-progress' | 'completed';
export type DeliveryImpact = 'none' | 'minor' | 'major';

export interface ChangeItem {
  id: string;
  description: string;
  reason: string;
  affectedShoots: string[];
  deliveryImpact: DeliveryImpact;
  cost: number;
  status: ChangeStatus;
  fittingRoundId: string;
  estimatedDays: number;
}

export type ShootType = 'pre-wedding' | 'trial-makeup' | 'wedding-day';

export interface ShootPlan {
  id: string;
  name: string;
  date: string;
  type: ShootType;
  location: string;
  requiredDressState: string;
  relatedFittingRound: number;
  status: 'upcoming' | 'completed';
  photographer?: string;
}

export interface Budget {
  total: number;
  basePrice: number;
  fabricUpgrade: number;
  accessoryCost: number;
  alterationCost: number;
  paidAmount: number;
  paymentSchedule: PaymentItem[];
}

export interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Accessory {
  id: string;
  name: string;
  category: 'veil' | 'gloves' | 'jewelry' | 'shoes' | 'headpiece';
  price: number;
  imageUrl: string;
  description: string;
  selected: boolean;
}

export type ViewMode = 'bride' | 'consultant' | 'patternmaker';
