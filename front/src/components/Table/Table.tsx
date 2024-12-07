import React, { useState } from "react";
import { Table, Modal, Button, Form, Input, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

type TableComponentProps<T> = {
    columns: ColumnsType<T>;
    data: T[];
    onSave: (record: T) => void;
    onDelete: (keys: React.Key[]) => void;
    modalFields: Array<{ name: string; label: string; type?: "text" | "number" | "date" | string }>;
    rowKey: keyof T;
}

const TableComponent = <T extends { [key: string]: any }>({
    columns,
    data,
    onSave,
    onDelete,
    modalFields,
    rowKey,
}: TableComponentProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<T | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const handleEdit = (record: T) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleSave = (values: T) => {
        if (editingRecord) {
            onSave({ ...editingRecord, ...values });
        }
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    danger
                    onClick={() => onDelete(selectedRowKeys)}
                    disabled={selectedRowKeys.length === 0}
                >
                    Deletar Selecionados
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                rowKey={rowKey as string}
                onRow={(record) => ({
                    onClick: () => handleEdit(record),
                })}
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title="Editar Registro"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                {editingRecord && (
                    <Form
                        layout="vertical"
                        initialValues={editingRecord}
                        onFinish={handleSave}
                    >
                        {modalFields.map(({ name, label, type }) => (
                            <Form.Item
                                key={name}
                                label={label}
                                name={name}
                                rules={[{ required: true, message: `Insira ${label}!` }]}
                            >
                                <Input type={type || "text"} />
                            </Form.Item>
                        ))}
                        <Button type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default TableComponent;
