type SlotStatus = "PREPARING" | "OPEN" | "CLOSED";

type SlotGenealogy = {
  periodId: string;
  batchId: string;
  locationId: string;
  slotId: string;
};

type Slot = {
  id: string;
  name: string;
  locationId: string;
  eventDateTime: string;
  numberOfSeats: number;
  status: SlotStatus;
  code: string;
  version: number;
  genealogy: SlotGenealogy;
  registeredSlots: number;
};

type GetSlotsPayload = {
  // periodId?: string;
  // batchId?: string;
  // locationId?: string;
};
type GetSlotsResponse = Slot[];
