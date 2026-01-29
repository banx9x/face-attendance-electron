type PaymentTimeUnit = "h" | "d" | "m" | "y";

type PaymentSessionDuration = {
  amount: number;
  timeUnit: PaymentTimeUnit;
};

type PeriodConfig = {
  fee: number;
  limitedNoRegistrations: number;
  dateBetweenExams: number;
  paymentSessionDuration: PaymentSessionDuration;
};

type PeriodStatus = "PREPARING" | "OPEN" | "CLOSED";

interface Period {
  id: string;
  name: string;
  year: number;
  config: PeriodConfig;
  status: PeriodStatus;
  code: string;
  version: number;
}

type GetPeriodsResponse = Period[];
