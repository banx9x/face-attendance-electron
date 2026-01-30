import { Button, Form, Select } from "antd";
import dataApi from "../store/data/data.api";
import { useEffect } from "react";

const PeriodSelector: React.FC = () => {
  const { data = [], isLoading } = dataApi.useGetPeriodsQuery();

  return (
    <Form.Item label="Kỳ thi" name="periodId">
      <Select
        options={data.map((period) => ({
          label: period.name,
          value: period.id,
        }))}
        loading={isLoading}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};

const BatchSelector: React.FC = () => {
  const form = Form.useFormInstance();
  const periodId = Form.useWatch("periodId");
  const { data = [], isLoading } = dataApi.useGetBatchesQuery({});

  useEffect(() => {
    form.setFieldsValue({ batchId: undefined });
  }, [periodId]);

  const batches = data.filter((batch) => batch.periodId === periodId);

  return (
    <Form.Item label="Đợt thi" name="batchId">
      <Select
        options={batches.map((batch) => ({
          label: batch.name,
          value: batch.id,
        }))}
        loading={isLoading}
        style={{ width: "100%" }}
        disabled={!periodId}
      />
    </Form.Item>
  );
};

const LocationSelector: React.FC = () => {
  const form = Form.useFormInstance();
  const batchId = Form.useWatch("batchId");

  const { data = [], isLoading } = dataApi.useGetBatchesQuery({});

  useEffect(() => {
    form.setFieldsValue({ locationId: undefined });
  }, [batchId]);

  const locations = data.find((batch) => batch.id === batchId)?.locations || [];

  return (
    <Form.Item label="Địa điểm" name="locationId">
      <Select
        options={locations.map((location) => ({
          label: location.name,
          value: location.id,
        }))}
        loading={isLoading}
        style={{ width: "100%" }}
        disabled={!batchId}
      />
    </Form.Item>
  );
};

const SlotSelector: React.FC = () => {
  const form = Form.useFormInstance();
  const periodId = Form.useWatch("periodId");
  const batchId = Form.useWatch("batchId");
  const locationId = Form.useWatch("locationId");

  const { data = [], isLoading } = dataApi.useGetSlotsQuery({});

  useEffect(() => {
    form.setFieldsValue({ slotId: undefined });
  }, [locationId]);

  const slots = data.filter(
    (slot) =>
      slot.genealogy.periodId === periodId &&
      slot.genealogy.batchId === batchId &&
      slot.genealogy.locationId === locationId,
  );

  return (
    <Form.Item label="Ca thi" name="slotId">
      <Select
        options={slots.map((slot) => ({
          label: slot.name,
          value: slot.id,
        }))}
        loading={isLoading}
        style={{ width: "100%" }}
        disabled={!locationId}
        mode="tags"
      />
    </Form.Item>
  );
};

type DataFormValues = {
  periodId: string;
  batchId: string;
  locationId: string;
  slotId: string[];
};

const DataForm: React.FC = () => {
  const [form] = Form.useForm<DataFormValues>();
  const [getAccounts, { data, isLoading }] = dataApi.useLazyGetAccountsQuery();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Select Exam Period</h1>
      <Form form={form} layout="vertical" onFinish={getAccounts}>
        <PeriodSelector />
        <BatchSelector />
        <LocationSelector />
        <SlotSelector />

        {data && <div>Tải thành công {data.data.length} tài khoản</div>}

        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DataForm;
