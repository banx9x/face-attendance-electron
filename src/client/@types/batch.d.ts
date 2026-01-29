type BatchStatus = "PREPARING" | "OPEN" | "CLOSED";

type BatchConfig = {
  startDate: string;
  endDate: string;
  registrationBeginDateTime: string;
  registrationEndDateTime: string;
};

type Address = {
  province: string;
  ward: string;
  detail: string;
};

type BatchLocation = {
  id: string;
  name: string;
  batchId: string;
  clusterId: string;
  address: Address;
  status: BatchStatus;
  code: string;
  templateId: string;
  version: number;
};

type Batch = {
  id: string;
  name: string;
  periodId: string;
  config: BatchConfig;
  status: BatchStatus;
  code: string;
  version: number;
  locations: BatchLocation[];
};

type GetBatchesPayload = {
  // periodId?: string;
};
type GetBatchesResponse = Batch[];
