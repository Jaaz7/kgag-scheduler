import { useParams } from "react-router-dom";

import { FilterDropdown, useTable } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";

import { ContactStatusTag, CustomAvatar, Text } from "@/components";
import type { CompanyContactsTableQuery } from "@/graphql/types";

import { COMPANY_CONTACTS_TABLE_QUERY } from "./queries";

type Contact = GetFieldsFromList<CompanyContactsTableQuery>;

export const CompanyContactsTable = () => {
  const params = useParams();

  const { tableProps } = useTable<Contact>({
    resource: "contacts",
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "jobTitle",
          value: "",
          operator: "contains",
        },
        {
          field: "name",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: params?.id as string,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
    },
  });

  return (
    <Card
      styles={{
        header: {
          borderBottom: "1px solid #D9D9D9",
          marginBottom: "1px",
        },
        body: { padding: 0 },
      }}
      title={
        <Space size="middle">
          {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
          <TeamOutlined />
          <Text>Contacts</Text>
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total contacts: </Text>
          <Text strong>
            {tableProps?.pagination !== false && tableProps.pagination?.total}
          </Text>
        </>
      }
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: false,
        }}
      >
        <Table.Column<Contact>
          title="Name"
          dataIndex="name"
          render={(_, record) => {
            return (
              <Space>
                <CustomAvatar name={record.name} src={record.avatarUrl} />
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </Text>
              </Space>
            );
          }}
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Name" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          title="Title"
          dataIndex="jobTitle"
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Title" />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          title="Stage"
          dataIndex="status"
          render={(_, record) => {
            return <ContactStatusTag status={record.status} />;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "200px" }}
                mode="multiple"
                placeholder="Select Stage"
                options={statusOptions}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<Contact>
          dataIndex="id"
          width={112}
          render={(value, record) => {
            return (
              <Space>
                <Button
                  size="small"
                  href={`mailto:${record.email}`}
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon={<MailOutlined />}
                />
                <Button
                  size="small"
                  href={`tel:${record.phone}`}
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon={<PhoneOutlined />}
                />
              </Space>
            );
          }}
        />
      </Table>
    </Card>
  );
};

const statusOptions: {
  label: string;
  value: Contact["status"];
}[] = [
  {
    label: "New",
    value: "NEW",
  },
  {
    label: "Qualified",
    value: "QUALIFIED",
  },
  {
    label: "Unqualified",
    value: "UNQUALIFIED",
  },
  {
    label: "Won",
    value: "WON",
  },
  {
    label: "Negotiation",
    value: "NEGOTIATION",
  },
  {
    label: "Lost",
    value: "LOST",
  },
  {
    label: "Interested",
    value: "INTERESTED",
  },
  {
    label: "Contacted",
    value: "CONTACTED",
  },
  {
    label: "Churned",
    value: "CHURNED",
  },
];
